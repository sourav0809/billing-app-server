import { User } from "@/db/models";
import { createHash, createJWTToken } from "@/utils";
import { RegisterSchema } from "@/validators";
import { Request, Response } from "express";

export const register = async (
  req: Request<{}, {}, RegisterSchema>,
  res: Response
) => {
  const { email, password } = req.body;

  const isUserExists = await User.getUserByEmail(email);

  if (isUserExists) {
    return res.error("User already exists", 400);
  }

  const hashedPassword = await createHash(password);

  const user = await User.createUser({
    email,
    password: hashedPassword,
  });

  const accessToken = createJWTToken({
    id: user.id,
    email: user.email,
  });

  return res.success({ accessToken }, "User registered");
};
