import { BatchEvaluationStatus } from '@prisma/client';

import Logger from '../config/logger';
import { prisma } from '../config/prisma';
import batchEvaluationService from '../services/batchEvaluation.service';
import { LangChainService } from '../services/langchain.service';
import resultService from '../services/result.service';
import { evaluationSchema } from '../validations/result.validations';

/**
 * Cron job to check batch evaluation status and process completed batches
 * Runs every 5 minutes to poll the Google Gemini Batch API
 */
export const checkBatchEvaluationStatus = async (): Promise<void> => {
  try {
    Logger.info('Starting batch evaluation status check...');

    // Get all pending and processing batch evaluations
    const pendingBatches = await batchEvaluationService.getByStatus(BatchEvaluationStatus.PENDING);
    const processingBatches = await batchEvaluationService.getByStatus(
      BatchEvaluationStatus.PROCESSING
    );

    const batchesToCheck = [...pendingBatches, ...processingBatches];

    Logger.info(`Found ${batchesToCheck.length} batch evaluations to check`);

    if (batchesToCheck.length === 0) {
      Logger.info('No batch evaluations to check');
      return;
    }

    const langChainService = new LangChainService();

    for (const batch of batchesToCheck) {
      try {
        Logger.info(`Checking status for batch: ${batch.batchName}`);

        // Check batch job status using LangChain service
        const batchStatus = await langChainService.checkBatchJobStatus(batch.batchName!);

        Logger.info(`Batch ${batch.batchName} status: ${batchStatus.state}`);

        switch (batchStatus.state) {
          case 'JOB_STATE_FAILED':
            // Update batch status to failed
            await batchEvaluationService.updateStatus(batch.id, BatchEvaluationStatus.FAILED, {
              errorMessage: batchStatus.error || 'Batch job failed'
            });
            Logger.error(`Batch ${batch.batchName} failed: ${batchStatus.error}`);
            break;

          case 'JOB_STATE_PENDING':
            break;
          case 'JOB_STATE_RUNNING':
            // Update status to processing if not already
            if (batch.status === BatchEvaluationStatus.PENDING) {
              await batchEvaluationService.updateStatus(batch.id, BatchEvaluationStatus.PROCESSING);
            }
            break;
          case 'JOB_STATE_SUCCEEDED':
            // Process completed batch
            await processCompletedBatch(batch, batchStatus.results!);
            break;

          default:
            Logger.warn(`Unknown batch state: ${batchStatus.state} for batch ${batch.batchName}`);
        }
      } catch (error) {
        Logger.error(`Error checking batch ${batch.batchName}:`, error);
        // Don't update status here - let it retry on next run
      }
    }

    Logger.info('Batch evaluation status check completed');
  } catch (error) {
    Logger.error('Error in batch evaluation status check cron job:', error);
    throw error;
  }
};

/**
 * Process a completed batch evaluation
 * @param batch - The batch evaluation record
 * @param results - The results from the batch API
 */
async function processCompletedBatch(batch: any, results: any[]): Promise<void> {
  Logger.info(`Processing completed batch: ${batch.batchName}`);

  try {
    // Process each result in the batch
    for (const result of results) {
      try {
        // Parse the AI response
        const responseText = result.response.candidates[0].content.parts[0].text;

        const evaluationCleanText = responseText
          .replace(/```json\s*/g, '')
          .replace(/```\s*$/g, '')
          .trim();

        // Parse and validate the response using Zod schema
        let parsedEvaluationResponse;
        try {
          const jsonResponse = JSON.parse(evaluationCleanText);
          parsedEvaluationResponse = evaluationSchema.parse(jsonResponse);
        } catch (parseError) {
          throw new Error(
            `Invalid response from AI: ${
              parseError instanceof Error ? parseError.message : 'Unknown parsing/validation error'
            }`
          );
        }

        Logger.info(
          `Processing ${
            parsedEvaluationResponse.evaluations?.length || 0
          } evaluations for request ${result.requestIndex}`
        );

        // Group evaluations by questionId and save each question's evaluations
        if (
          parsedEvaluationResponse.evaluations &&
          parsedEvaluationResponse.evaluations.length > 0
        ) {
          // Group evaluations by questionId
          const evaluationsByQuestion = parsedEvaluationResponse.evaluations.reduce(
            (acc: any, evaluation: any) => {
              if (!acc[evaluation.questionId]) {
                acc[evaluation.questionId] = [];
              }
              acc[evaluation.questionId].push(evaluation);
              return acc;
            },
            {}
          );

          // Process each question's evaluations
          for (const [questionId, evaluations] of Object.entries(evaluationsByQuestion) as [
            string,
            any[]
          ][]) {
            console.log('Question Id', questionId);
            console.log('Evaluations', evaluations);
            try {
              // Get the answer key for this question
              const answerKey = await prisma.answerKeyResponse.findFirst({
                where: {
                  OR: [
                    {
                      examId: batch.examId,
                      itemId: questionId
                    },
                    {
                      examId: batch.examId,
                      id: questionId
                    }
                  ]
                }
              });

              if (!answerKey) {
                Logger.warn(
                  `No answer key found for question ${questionId} in exam ${batch.examId}`
                );
                continue;
              }

              // Create EvaluationResult object for this question
              const questionEvaluationResult = {
                evaluations: evaluations,
                examId: batch.examId,
                questionId: answerKey.itemId ?? questionId,
                status: 'SUCCESS' as const
              };

              // Save the evaluation results for this question
              await resultService.saveQuestionEvaluationResults(
                answerKey.itemId ?? questionId,
                batch.examId,
                questionEvaluationResult,
                answerKey
              );

              Logger.info(
                `Saved ${evaluations.length} evaluations for question ${
                  answerKey.itemId ?? questionId
                }`
              );
            } catch (error) {
              Logger.error(`Error saving evaluations for question ${questionId}:`, error);
            }
          }
        }
      } catch (error) {
        Logger.error(`Error processing batch result ${result.requestIndex}:`, error);
      }
    }

    // Update batch status to completed
    await batchEvaluationService.updateStatus(batch.id, BatchEvaluationStatus.COMPLETED);
    Logger.info(`Batch ${batch.batchName} processing completed successfully`);
  } catch (error) {
    Logger.error(`Error processing completed batch ${batch.batchName}:`, error);
    // Update batch status to failed
    await batchEvaluationService.updateStatus(batch.id, BatchEvaluationStatus.FAILED, {
      errorMessage: error instanceof Error ? error.message : 'Failed to process batch results'
    });
    throw error;
  }
}
