import { User } from "@/db/models";
import { decodedJWTToken } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.error("Unauthorized", 401);
  }

  const decoded = decodedJWTToken(token) as {
    id: string;
    email: string;
  };

  if (!decoded) {
    return res.error("Unauthorized", 401);
  }

  const user = await User.getUserById(decoded.id);

  if (!user) {
    return res.error("Unauthorized", 401);
  }

  req.user = user;

  next();
};
