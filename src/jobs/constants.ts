import { checkBatchEvaluationStatus } from './checkBatchEvaluationStatus';
import { updateExamAnalytics } from './exam/update-exam-analytics';

export const scheduledJobs = [
  {
    action: async () => {
      await updateExamAnalytics();
    },
    cronTime: '0 0 * * *', // Every day at midnight
    name: 'Analytics Job',
    timezone: 'Asia/Kolkata'
  },

  // commenting out for production
  {
    action: async () => {
      await checkBatchEvaluationStatus();
    },
    cronTime: '*/1 * * * *', // Every 5 minutes
    name: 'Batch Evaluation Status Checker',
    timezone: 'Asia/Kolkata'
  }
];
export const MAXIMUM_RETRIES = 3;
