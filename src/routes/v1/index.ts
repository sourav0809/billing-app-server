import { authenticate } from "@/middlewares/auth";
import express from "express";

import authRouter from "./auth";
import customersRouter from "./customers";
import meRouter from "./me";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/me", authenticate, meRouter);
router.use("/customer", authenticate, customersRouter);

export default router;
