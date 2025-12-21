import { Request, Response } from "express";

export const getCurrentUser = async (req: Request, res: Response) => {
  return res.success(req.user, "User fetched successfully");
};
