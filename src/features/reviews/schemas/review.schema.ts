import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating must be 5 or less"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
