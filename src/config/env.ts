import dotenv from "dotenv";
import uuid from "uuid";
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  SALT: Number(process.env.SALT) || 10,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  UUID_NAMESPACE: process.env.UUID_NAMESPACE || uuid.v5.URL,
  MASTER_PASSWORD: process.env.MASTER_PASSWORD,
};
