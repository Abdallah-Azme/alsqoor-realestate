import { z } from "zod";

// Blog schemas for admin forms if needed

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().optional(),
});

export const blogFilterSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  search: z.string().optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
export type BlogFilterData = z.infer<typeof blogFilterSchema>;
