import { Area, User } from "@/db/models";
import { createId } from "@/utils";
import { CreateAreaSchema } from "@/validators";
import { Request, Response } from "express";

export const createArea = async (
  req: Request<{}, {}, CreateAreaSchema>,
  res: Response
) => {
  const { name, pincode, status } = req.body;
  const user = req.user as User;

  try {
    const area = await Area.createArea({
      id: createId(),
      name,
      pincode,
      status: status || "active",
      user_id: user.id,
    });

    return res.success(area, "Area created successfully", 201);
  } catch (error: any) {
    // Handle unique constraint violations
    if (error.code === "23505") {
      return res.error("Area with this name or pincode already exists", 400);
    }

    return res.error("Failed to create area", 500, error.message);
  }
};
