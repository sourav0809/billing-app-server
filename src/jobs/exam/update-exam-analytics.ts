import Logger from '../../config/logger';
import { prisma } from '../../config/prisma';
import { AnalyticsService } from '../../services';

// Configuration constants
const BATCH_SIZE = parseInt(process.env.ANALYTICS_BATCH_SIZE || '10');
const MAX_RETRIES = parseInt(process.env.ANALYTICS_MAX_RETRIES || '3');
const RETRY_DELAY_MS = parseInt(process.env.ANALYTICS_RETRY_DELAY_MS || '1000');

interface AnalyticsJobMetrics {
  duration?: number;
  endTime?: Date;
  failedExams: number;
  failedSets: number;
  processedExams: number;
  processedSets: number;
  startTime: Date;
  totalExams: number;
  totalSets: number;
}

interface AnalyticsProcessingResult {
  error?: string;
  examId: string;
  failedSets: string[];
  processedSets: string[];
  retryCount: number;
  success: boolean;
}

/**
 * Validates exam data before processing
 */
const validateExamData = (exam: any): { errors: string[]; isValid: boolean } => {
  const errors: string[] = [];

  if (!exam.id || typeof exam.id !== 'string') {
    errors.push('Invalid or missing exam ID');
  }

  if (!exam.questionPapers || !Array.isArray(exam.questionPapers)) {
    errors.push('Invalid or missing question papers');
  } else if (exam.questionPapers.length === 0) {
    errors.push('No question papers found for exam');
  } else {
    exam.questionPapers.forEach((qp: any, index: number) => {
      if (!qp.setName || typeof qp.setName !== 'string') {
        errors.push(`Question paper at index ${index} has invalid setName`);
      }
    });
  }

  return { errors, isValid: errors.length === 0 };
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Process analytics for a single exam with retry logic
 */
const processExamAnalytics = async (
  exam: any,
  retryCount = 0
): Promise<AnalyticsProcessingResult> => {
  const result: AnalyticsProcessingResult = {
    examId: exam.id,
    failedSets: [],
    processedSets: [],
    retryCount,
    success: false
  };

  Logger.info(`Processing exam ${exam.id} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);

  try {
    const validation = validateExamData(exam);
    if (!validation.isValid) {
      result.error = `Validation failed: ${validation.errors.join(', ')}`;
      Logger.warn(`Validation failed for exam ${exam.id}: ${result.error}`);
      return result;
    }

    // Use transaction for atomic operations
    await prisma.$transaction(async (tx) => {
      // Double-check that analytics isn't already done (concurrency protection)
      const currentExam = await tx.exam.findUnique({
        select: { analyticsData: true, analyticsDone: true },
        where: { id: exam.id }
      });

      if (!currentExam) {
        throw new Error(`Exam ${exam.id} not found during processing`);
      }

      if (currentExam.analyticsDone) {
        Logger.info(`Exam ${exam.id} analytics already completed, skipping`);
        result.success = true;
        return;
      }

      const currentAnalyticsData = (currentExam.analyticsData as any) || {};
      let hasNewAnalytics = false;

      // Process each question paper set
      for (const questionPaper of exam.questionPapers) {
        try {
          Logger.debug(`Calculating analytics for exam ${exam.id}, set ${questionPaper.setName}`);

          const analytics = await AnalyticsService.calculateExamAnalytics(
            exam.id,
            questionPaper.setName,
            tx
          );

          if (analytics) {
            currentAnalyticsData[questionPaper.setName] = analytics;
            result.processedSets.push(questionPaper.setName);
            hasNewAnalytics = true;
            Logger.debug(
              `Successfully calculated analytics for exam ${exam.id}, set ${questionPaper.setName}`
            );
          } else {
            Logger.warn(`No analytics generated for exam ${exam.id}, set ${questionPaper.setName}`);
          }
        } catch (setError: any) {
          result.failedSets.push(questionPaper.setName);
          Logger.error(
            `Error processing set ${questionPaper.setName} for exam ${exam.id}: ${setError.message}`
          );

          // Continue processing other sets even if one fails
          continue;
        }
      }

      // Update exam only if we have new analytics data
      if (hasNewAnalytics || result.failedSets.length === 0) {
        await tx.exam.update({
          data: {
            analyticsData: currentAnalyticsData,
            analyticsDone: result.failedSets.length === 0 // Only mark as done if no sets failed
          },
          where: { id: exam.id }
        });
        result.success = result.failedSets.length === 0;
      } else {
        result.success = false;
        result.error = `Failed to process ${result.failedSets.length} sets`;
      }
    });
  } catch (error: any) {
    result.error = error.message;
    Logger.error(`Error processing exam ${exam.id}: ${error.message}`);

    // Retry logic
    if (retryCount < MAX_RETRIES) {
      Logger.info(
        `Retrying exam ${exam.id} in ${RETRY_DELAY_MS}ms (attempt ${retryCount + 2}/${
          MAX_RETRIES + 1
        })`
      );
      await sleep(RETRY_DELAY_MS);
      return processExamAnalytics(exam, retryCount + 1);
    }
  }

  Logger.info(
    `Completed processing exam ${exam.id}: success=${result.success}, processed=${result.processedSets.length}, failed=${result.failedSets.length}`
  );
  return result;
};

/**
 * Process exams in batches to avoid memory issues
 */
const processExamsBatch = async (exams: any[], metrics: AnalyticsJobMetrics): Promise<void> => {
  const batches = [];
  for (let i = 0; i < exams.length; i += BATCH_SIZE) {
    batches.push(exams.slice(i, i + BATCH_SIZE));
  }

  Logger.info(`Processing ${exams.length} exams in ${batches.length} batches of max ${BATCH_SIZE}`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    Logger.info(`Processing batch ${i + 1}/${batches.length} with ${batch.length} exams`);

    const batchPromises = batch.map((exam) => processExamAnalytics(exam));
    const batchResults = await Promise.allSettled(batchPromises);

    // Process results
    batchResults.forEach((promiseResult, index) => {
      const exam = batch[index];
      metrics.totalSets += exam.questionPapers?.length || 0;

      if (promiseResult.status === 'fulfilled') {
        const result = promiseResult.value;
        metrics.processedExams++;

        if (result.success) {
          metrics.processedSets += result.processedSets.length;
        } else {
          metrics.failedExams++;
          metrics.failedSets += result.failedSets.length;
          Logger.warn(`Exam ${exam.id} processing completed with failures: ${result.error}`);
        }
      } else {
        metrics.failedExams++;
        Logger.error(`Exam ${exam.id} processing failed completely: ${promiseResult.reason}`);
      }
    });

    // Log batch progress
    Logger.info(
      `Batch ${i + 1}/${batches.length} completed. Progress: ${metrics.processedExams}/${
        metrics.totalExams
      } exams, ${metrics.processedSets}/${metrics.totalSets} sets`
    );
  }
};

/**
 * Main function to update exam analytics
 * Handles all exams that need analytics calculation
 */
export const updateExamAnalytics = async (): Promise<void> => {
  const startTime = new Date();
  const metrics: AnalyticsJobMetrics = {
    failedExams: 0,
    failedSets: 0,
    processedExams: 0,
    processedSets: 0,
    startTime,
    totalExams: 0,
    totalSets: 0
  };

  try {
    Logger.info('Starting exam analytics update job');

    // Find exams that need analytics processing
    const exams = await prisma.exam.findMany({
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        questionPapers: {
          select: {
            setName: true
          }
        }
      },
      where: {
        analyticsDone: false
      }
    });

    metrics.totalExams = exams.length;

    if (exams.length === 0) {
      Logger.info('No exams found that need analytics processing');
      return;
    }

    Logger.info(`Found ${exams.length} exams requiring analytics processing`);

    // Validate all exams before processing
    const validExams = [];
    let invalidCount = 0;

    for (const exam of exams) {
      const validation = validateExamData(exam);
      if (validation.isValid) {
        validExams.push(exam);
      } else {
        invalidCount++;
        Logger.warn(`Skipping invalid exam ${exam.id}: ${validation.errors.join(', ')}`);
      }
    }

    if (invalidCount > 0) {
      Logger.warn(`Skipped ${invalidCount} invalid exams`);
    }

    if (validExams.length === 0) {
      Logger.info('No valid exams to process after validation');
      return;
    }

    // Process valid exams in batches
    await processExamsBatch(validExams, metrics);

    // Calculate final metrics
    metrics.endTime = new Date();
    metrics.duration = metrics.endTime.getTime() - startTime.getTime();

    // Log final results
    const successRate =
      metrics.totalExams > 0 ? Math.round((metrics.processedExams / metrics.totalExams) * 100) : 0;

    Logger.info(`Exam analytics update job completed`, {
      duration: `${metrics.duration}ms`,
      failedExams: metrics.failedExams,
      failedSets: metrics.failedSets,
      processedExams: metrics.processedExams,
      processedSets: metrics.processedSets,
      successRate: `${successRate}%`,
      totalExams: metrics.totalExams,
      totalSets: metrics.totalSets
    });
  } catch (error: any) {
    metrics.endTime = new Date();
    metrics.duration = metrics.endTime.getTime() - startTime.getTime();

    Logger.error(`Critical error in exam analytics update job: ${error.message}`, {
      duration: `${metrics.duration}ms`,
      error: error.stack,
      metrics
    });
  }
};
