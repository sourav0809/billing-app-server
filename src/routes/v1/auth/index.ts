import { validate } from "@/middlewares";
import { loginSchema, registerSchema } from "@/validators";
import express from "express";
import { login } from "./login";
import { register } from "./register";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
