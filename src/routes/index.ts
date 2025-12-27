import { Express } from "express";
import { errorHandler } from "./errorHandler";
import { healthCheck } from "./healthCheck";
import { routeNotFound } from "./routeNotFound";
import v1Router from "./v1";

export const setupRoutes = (app: Express) => {
  app.use("/api/v1", v1Router);
  app.get("/health", healthCheck);
  app.use(routeNotFound);
  app.use(errorHandler);
};
