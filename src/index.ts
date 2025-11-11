import * as Sentry from '@sentry/node';
import { Server } from 'http';

import app from './app';
import envConfig from './config/config';
import Logger from './config/logger';

const server: Server = app.listen(envConfig.server.port, () => {
  Logger.log(
    'info',
    `Server is running at port ${envConfig.server.port} in ${envConfig.server.env} mode`
  );
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      Logger.log('info', {
        message: 'Server closed'
      });
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  Sentry.captureException(error);

  Logger.log('error', {
    error,
    message: 'Unexpected error occurred'
  });

  // Force exit after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    Logger.log('error', {
      message: 'Forced exit due to timeout'
    });
    process.exit(1);
  }, 10000);

  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  Logger.log('info', {
    message: 'SIGTERM received'
  });

  if (server) {
    // Force exit after 10 seconds if server doesn't close gracefully
    const timeout = setTimeout(() => {
      Logger.log('warn', {
        message: 'Server close timeout, forcing exit'
      });
      process.exit(1);
    }, 10000);

    server.close(() => {
      clearTimeout(timeout);
      Logger.log('info', {
        message: 'Server closed due to SIGTERM'
      });
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  Logger.log('info', {
    message: 'SIGINT received'
  });

  if (server) {
    // Force exit after 10 seconds if server doesn't close gracefully
    const timeout = setTimeout(() => {
      Logger.log('warn', {
        message: 'Server close timeout, forcing exit'
      });
      process.exit(1);
    }, 10000);

    server.close(() => {
      clearTimeout(timeout);
      Logger.log('info', {
        message: 'Server closed due to SIGINT'
      });
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
