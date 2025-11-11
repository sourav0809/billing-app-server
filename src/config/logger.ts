import type { TransformableInfo } from 'logform';

import { createLogger, format, transports } from 'winston';

const { align, colorize, combine, printf, timestamp } = format;

interface ExtendedInfo extends TransformableInfo {
  err?: {
    cause?: {
      code?: string;
      message?: string;
      name?: string;
    };
    message?: string;
    name?: string;
  };

  req?: {
    body?: any;
    headers?: any;
    ip?: string;
    method?: string;
    originalUrl?: string;
    query?: any;
    url?: string;
    user?: {
      email?: string;
      id?: string;
    };
  };
}

// Console formatter with req/user context
const contextualConsoleFormat = printf((info: ExtendedInfo) => {
  const { err, level: logLevel, message, req, timestamp } = info;

  let logMessage: string = timestamp ? `[${timestamp}] ` : '';
  logMessage += logLevel ? `${logLevel}: ` : '';

  if (message) {
    logMessage += `${String(message)?.trim()}`;
  }

  if (req?.method && (req?.originalUrl || req?.url)) {
    logMessage += ` | ${req.method} request to ${req?.originalUrl || req?.url} failed`;
  }

  if (req?.ip) {
    const ip = req?.ip || req?.headers['x-forwarded-for'] || 'UNKNOWN_IP';
    logMessage += ` | IP: ${ip}`;
  }

  if (err) {
    const errorCode: string = err?.name || 'INTERNAL_SERVER_ERROR';
    const cause: string =
      err?.cause?.code || err?.cause?.message || err?.cause?.name || 'Unknown Error';
    logMessage += ` | Code: ${errorCode ?? err}`;
    logMessage += `Cause: ${cause}.`;
  }

  if (req?.body && Object.keys(req.body).length) {
    logMessage += ` | body: ${JSON.stringify(req.body)}`;
  }

  if (req?.query && Object.keys(req.query).length) {
    logMessage += ` | query: ${JSON.stringify(req.query)}`;
  }

  const user: number | string | undefined = req?.user?.email || req?.user?.id;
  if (user) {
    logMessage += ` | User: ${user}`;
  }

  return logMessage.trim();
});

const consoleTransport = new transports.Console({
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    align(),
    contextualConsoleFormat
  ),
  level: 'debug'
});

const Logger = createLogger({
  levels: {
    debug: 4,
    error: 0,
    http: 3,
    info: 2,
    silly: 5,
    warn: 1
  },
  transports: [consoleTransport]
});

export const logLevels = {
  debug: 'debug',
  error: 'error',
  http: 'http',
  info: 'info',
  silly: 'silly',
  warn: 'warn'
};

export default Logger;
