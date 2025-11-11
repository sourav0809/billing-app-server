import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import envConfig from '../config/config';
import { response } from '../utils/response';

/**
 * Middleware to authenticate public API requests using Bearer token
 * Checks for 'Authorization' header with Bearer token format and validates it
 */
const publicAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader) {
      return response(
        res,
        httpStatus.UNAUTHORIZED,
        'Unauthorized: Missing Authorization header. Please provide Bearer token'
      );
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return response(
        res,
        httpStatus.UNAUTHORIZED,
        'Unauthorized: Invalid authorization format. Use Bearer token'
      );
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return response(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Missing token in Bearer header');
    }

    // Validate the token against the configured API key
    if (token !== envConfig.apiKeys.publicAuthApiKey) {
      return response(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Invalid API key');
    }

    next();
  } catch (_error) {
    return response(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error during authentication'
    );
  }
};

export default publicAuth;
