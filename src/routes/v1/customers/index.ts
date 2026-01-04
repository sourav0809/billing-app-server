import { authenticate } from "@/middlewares/auth";
import { validate } from "@/middlewares";
import { createCustomerSchema } from "@/validators";
import express from "express";
import { createCustomer } from "./create";

const router = express.Router();

router.post("/", authenticate, validate(createCustomerSchema), createCustomer);

export default router;
