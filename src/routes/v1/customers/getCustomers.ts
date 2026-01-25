import { User } from "@/db/models";
import { GetCustomersSchema } from "@/validators";
import { Request, Response } from "express";

export const getCustomers = async (req: Request, res: Response) => {
  const parentUser = req.user as User;
  const { page, limit, name } = (req as any)
    .validatedQuery as GetCustomersSchema;

  // Determine parent_user_id filter
  // Admin can see all customers, others see only their children
  const parent_user_id =
    parentUser.role === "admin" ? undefined : parentUser.id;

  try {
    const result = await User.getCustomers({
      page,
      limit,
      parent_user_id,
      name,
    });

    return res.success(result, "Customers fetched successfully");
  } catch (error: any) {
    return res.error("Failed to fetch customers", 500, error.message);
  }
};
