import { authenticate } from "@/middlewares/auth";
import { validate, validateQuery } from "@/middlewares";
import { createCustomerSchema, getCustomersSchema } from "@/validators";
import express from "express";
import { createCustomer } from "./create";
import { getCustomers } from "./getCustomers";

const router = express.Router();

router
  .get("/", authenticate, validateQuery(getCustomersSchema), getCustomers)
  .post("/", authenticate, validate(createCustomerSchema), createCustomer);

export default router;
