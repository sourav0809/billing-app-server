import z from "zod";

export const createAreaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pincode: z.string().min(1, "Pincode is required"),
  status: z.enum(["active", "archived"]).optional().default("active"),
});

export type CreateAreaSchema = z.infer<typeof createAreaSchema>;
