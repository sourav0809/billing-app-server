import { NextFunction, Request, Response } from "express";
import { UniqueViolationError } from "objection";

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof UniqueViolationError) {
    return res.error("Entity already exists", 409, error);
  }
  return res.error(error.message, 500, error);
};
