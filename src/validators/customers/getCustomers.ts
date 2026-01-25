import z from "zod";

export const getCustomersSchema = z.object({
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined) return 1;
      return typeof val === "string" ? parseInt(val, 10) : val;
    })
    .pipe(z.number().int().min(1, "Page must be greater than 0")),
  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined) return 10;
      return typeof val === "string" ? parseInt(val, 10) : val;
    })
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(100, "Limit must be at most 100")
    ),
  name: z.string().optional(),
});

export type GetCustomersSchema = z.infer<typeof getCustomersSchema>;
