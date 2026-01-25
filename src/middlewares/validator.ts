import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodSchema } from "zod";

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync(req.body);
      req.body = data;
      return next();
    } catch (error: any) {
      return res.error(
        error.errors?.[0]?.message || "Validation failed",
        400,
        error.errors
      );
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync(req.query);
      // Store validated query in a custom property
      (req as any).validatedQuery = data;
      return next();
    } catch (error: any) {
      return res.error(
        error.errors?.[0]?.message || "Validation failed",
        400,
        error.errors
      );
    }
  };
};
