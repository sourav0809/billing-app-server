import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import config from '../config/config';
import { prisma } from '../config/prisma';
import { response } from '../utils/response';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response(
        res,
        httpStatus.UNAUTHORIZED,
        'Unauthorized: Missing or invalid authorization header'
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return response(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Missing token');
    }

    const decoded = jwt.verify(token, config.security.secretKey) as {
      email: string;
      role: string;
      userId: string;
    };

    // Fetch the user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      include: {
        institute: true,
        studentProfile: true
      },
      where: { id: decoded.userId }
    });

    if (!user) {
      return response(res, httpStatus.UNAUTHORIZED, 'Unauthorized: User not found');
    }

    // Attach user to request
    (req as any).user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return response(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      return response(res, httpStatus.UNAUTHORIZED, 'Unauthorized: Token expired');
    } else {
      next(error);
    }
  }
};

export default auth;
