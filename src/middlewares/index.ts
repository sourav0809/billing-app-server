import cors from "cors";
import { Express, json } from "express";
import { responseFormatter } from "./request-response-formatter";
export * from "./validator";

export const setupMiddlewares = (app: Express) => {
  app.use(json());
  app.use(cors());
  app.use(responseFormatter);
};
