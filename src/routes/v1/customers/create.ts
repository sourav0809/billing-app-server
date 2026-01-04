import { CustomerProfile, User } from "@/db/models";
import { createHash, createId } from "@/utils";
import { CreateCustomerSchema } from "@/validators";
import { Request, Response } from "express";
import { Model } from "objection";

export const createCustomer = async (
  req: Request<{}, {}, CreateCustomerSchema>,
  res: Response
) => {
  const {
    name,
    email,
    phone,
    password,
    vc_number,
    stb_number,
    pan_number,
    aadhaar_number,
    address,
    area_id,
  } = req.body;

  // Get the authenticated user (parent user)
  const parentUser = req.user;

  // Check if user with email already exists
  const existingUser = await User.getUserByEmail(email);
  if (existingUser) {
    return res.error("User with this email already exists", 400);
  }

  const trx = await Model.startTransaction();
  try {
    const hashedPassword = await createHash(password);

    const user = await User.createUser(
      {
        id: createId(),
        name,
        email,
        phone,
        password: hashedPassword,
        role: "customer",
        parent_user_id: parentUser.id,
        status: "active",
      },
      trx
    );

    await CustomerProfile.createCustomerProfile(
      {
        id: createId(),
        user_id: user.id,
        vc_number,
        stb_number,
        pan_number,
        aadhaar_number,
        address,
        area_id,
        status: "active",
      },
      trx
    );

    await trx.commit();

    const createdUser = await User.getUserById(user.id);

    return res.success(createdUser, "Customer created successfully", 201);
  } catch (error: any) {
    await trx.rollback();
    if (error.code === "23505") {
      return res.error("User with this email or phone already exists", 400);
    }

    return res.error("Failed to create customer", 500, error.message);
  }
};
