import z from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  vc_number: z.string().optional(),
  stb_number: z.string().optional(),
  pan_number: z.string().optional(),
  aadhaar_number: z.string().optional(),
  address: z.string().optional(),
  area_id: z.string().uuid("Invalid area ID").optional(),
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
