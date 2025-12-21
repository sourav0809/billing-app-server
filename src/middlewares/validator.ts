import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = await schema.parseAsync(req.body);
    req.body = data;
    return next();
  };
};
