import { authenticate } from "@/middlewares/auth";
import { validate } from "@/middlewares";
import { createAreaSchema } from "@/validators";
import express from "express";
import { createArea } from "./create";
import { getAreas } from "./getAreas";

const router = express.Router();

router
  .get("/", authenticate, getAreas)
  .post("/", authenticate, validate(createAreaSchema), createArea);

export default router;
