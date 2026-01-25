import { Area } from "@/db/models";
import { Request, Response } from "express";

export const getAreas = async (req: Request, res: Response) => {
  try {
    const areas = await Area.getAreas();

    return res.success(areas, "Areas fetched successfully");
  } catch (error: any) {
    return res.error("Failed to fetch areas", 500, error.message);
  }
};

