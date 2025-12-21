import { Request, Response } from "express";

export const routeNotFound = async (_req: Request, res: Response) => {
  return res.error("Route not found");
};
