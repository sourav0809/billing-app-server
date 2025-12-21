import { db } from "@/config/db";
import { Request, Response } from "express";

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    await db.raw("SELECT 1");
    return res.status(200).json({ status: "OK" });
  } catch (error) {
    return res.error("Health check failed");
  }
};
