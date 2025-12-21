import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Response {
    success: (data: any, message?: string, statusCode?: number) => void;

    error: (message: string, statusCode?: number, error?: any) => void;
  }

  interface Request {
    user: {
      id: string;
      email: string;
    };
  }
}

export const responseFormatter = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.success = (
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.error = (message: string, statusCode = 500, error?: any) => {
    res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  };

  next();
};
