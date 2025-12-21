import express from "express";
import { getCurrentUser } from "./getCurrentUser";

const router = express.Router();

router.get("/", getCurrentUser);

export default router;
