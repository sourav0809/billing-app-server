import cron from 'node-cron';

import Logger from '../config/logger';
import { timeFormats } from '../constants';
import { getCurrentDateAndTime } from '../helpers';
import { MAXIMUM_RETRIES, scheduledJobs } from './constants';


type CronJobConfig = {
  action: () => Promise<void>;
  allowRetry?: boolean;
  cronTime: string;
  name: string;
  slugName: string;
  timezone: string;
};

/**
 * Executes a cron job.
 * @param {CronJobConfig} job - The cron job configuration.
 * @param {number} attempt - The attempt number.
 * @returns {Promise<void>} - A promise that resolves when the job is executed.
 */
const executeJob = async (
  { action, allowRetry, cronTime, name, slugName, timezone }: CronJobConfig,
  attempt: number = 1
): Promise<void> => {
  Logger.info(
    `Executing cron job: ${name}, Attempt: ${attempt} Time: ${
      getCurrentDateAndTime(timeFormats.DATETIME_24_WITH_SECONDS) as string
    }`
  );

  try {
    await action();
  } catch (error) {
    if (allowRetry && attempt < MAXIMUM_RETRIES) {
      Logger.info(`Retrying job ${name} in 10 seconds...`);
      setTimeout(() => {
        executeJob({ action, allowRetry, cronTime, name, slugName, timezone }, attempt + 1);
      }, 10000);
    }
    Logger.error(`Job ${name} failed on attempt ${attempt}:`, error);
  }
};

/**
 * Starts all cron jobs.
 * @returns {void} - A promise that resolves when the jobs are started.
 */
export const startAllCronJobs: () => void = (): void => {
  scheduledJobs.forEach((job: any) =>
    cron.schedule(
      job.cronTime,
      async (): Promise<void> => {
        await executeJob(job);
      },
      { name: job.name, timezone: job.timezone }
    )
  );
};
