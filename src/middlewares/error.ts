import { ErrorRequestHandler, Request } from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';

import config from '../config/config';
import Logger from '../config/logger';
import { SERVER_ENVIRONMENT } from '../constants';
import ApiError from '../utils/ApiError';
import { response } from '../utils/response';

// Error converter middleware: Converts non-ApiError to ApiError
export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;

  // Convert Prisma Client errors to ApiError
  if (!(error instanceof ApiError)) {
    let statusCode;
    let message;

    // Handle Prisma-specific errors
    if (error) {
      // General errors
      statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      message = error.message;
    }

    // Wrap the error in ApiError
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error); // Pass error to the next middleware
};

// Error handler middleware: Sends the error response to the client
export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const message = err.message;
  let { statusCode } = err;

  // For non-operational errors in production, don't expose the exact message
  if (config.server.env === SERVER_ENVIRONMENT.PRODUCTION && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }

  // Log the error message in development
  if (config.server.env === SERVER_ENVIRONMENT.DEVELOPMENT) {
    Logger.log('error', {
      err: err,
      message: err?.message || 'Internal Server Error',
      req: req
    });
  }

  // Set response locals for error message
  res.locals.errorMessage = err.message;

  // Structure the error response
  const response = {
    code: statusCode,
    message,
    ...(config.server.env === SERVER_ENVIRONMENT.DEVELOPMENT && { stack: err.stack }) // Include stack trace only in development
  };

  // Send error response
  return res.status(statusCode).send(response);
};

export const asyncErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: any) => {
  Logger.log('error', {
    err: err,
    message: err?.message || 'Internal Server Error',
    req: req
  });

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return response(
      res,
      err.statusCode, // Use the statusCode from ApiError
      err.message // Use the message from ApiError
    );
  }

  if (err.name === 'JsonWebTokenError' || err.message === 'access denied') {
    // Handle specific JWT or access-related errors
    return response(
      res,
      httpStatus.UNAUTHORIZED,
      "You don't have permission to access this resource."
    );
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return response(
      res,
      httpStatus.BAD_REQUEST,
      'Validation failed. Please review your input and try again.'
    );
  }

  // Handle any unhandled errors gracefully
  return response(
    res,
    httpStatus.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred. Please try again later.'
  );
};
