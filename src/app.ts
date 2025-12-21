import express from "express";
import { initDb } from "./config/db";
import { setupMiddlewares } from "./middlewares";
import { setupRoutes } from "./routes";

export const createApp = async () => {
  const app = express();
  await initDb();

  setupMiddlewares(app);
  setupRoutes(app);
  return app;
};
