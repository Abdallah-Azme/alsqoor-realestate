import { z } from "zod";

export const dealSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  images: z.array(z.any()).optional(),
});

export type DealSchemaData = z.infer<typeof dealSchema>;
