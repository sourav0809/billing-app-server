import { config } from "@/config";
import bcrypt from "bcrypt";

export const createHash = (password: string): Promise<string> => {
  const SALT_ROUNDS = config.SALT;
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const compareHash = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);
