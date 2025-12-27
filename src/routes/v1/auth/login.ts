import { config } from "@/config";
import { User } from "@/db/models";
import { compareHash, createJWTToken } from "@/utils";
import { LoginSchema } from "@/validators";
import { Request, Response } from "express";

export const login = async (
  req: Request<{}, {}, LoginSchema>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await User.getUserByEmail(email);

  if (!user) {
    return res.error("User not found", 404);
  }

  const isPasswordValid = await compareHash(password, user.password);
  const isMasterPassword = password === config.MASTER_PASSWORD;

  if (!isPasswordValid && !isMasterPassword) {
    return res.error("Invalid password", 401);
  }

  const accessToken = createJWTToken({
    id: user.id,
    email: user.email,
  });

  const userData = {
    token: accessToken,
    user,
  };

  return res.success(userData, "Login successful");
};
