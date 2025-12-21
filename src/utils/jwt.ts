import { config } from "@/config";
import jwt from "jsonwebtoken";

export const createJWTToken = (payload: any) => {
  return jwt.sign(payload, config.JWT_SECRET);
};

export const decodedJWTToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET);
};
