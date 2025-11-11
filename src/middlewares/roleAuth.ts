import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import envConfig from '../config/config';
import ApiError from '../utils/ApiError';
import auth from './auth';

const studentMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, (error) => {
      if (error) {
        return next(error);
      }

      if ((req as any).user?.role !== Role.STUDENT && (req as any).user?.role !== Role.ADMIN) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Access denied: Student role required'));
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};

const teacherMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, (error) => {
      if (error) {
        return next(error);
      }

      if ((req as any).user?.role !== Role.TEACHER && (req as any).user?.role !== Role.ADMIN) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Access denied: Teacher role required'));
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};

const smeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, (error) => {
      if (error) {
        return next(error);
      }

      if ((req as any).user?.role !== Role.SME && (req as any).user?.role !== Role.ADMIN) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Access denied: SME role required'));
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};
const instituteAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, (error) => {
      if (error) {
        return next(error);
      }

      if ((req as any).user?.role !== Role.ADMIN) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Access denied: Admin role required'));
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};

const evaluationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization !== envConfig.apiKeys.evaluationLambdaApiKey) {
      return next(
        new ApiError(httpStatus.FORBIDDEN, 'Access denied: Evaluation Lambda API key required')
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export {
  evaluationMiddleware,
  instituteAdminMiddleware,
  smeMiddleware,
  studentMiddleware,
  teacherMiddleware
};
