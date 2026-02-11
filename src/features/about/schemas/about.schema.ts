import { z } from "zod";

// About page data is read-only from API
// This schema is for admin editing if needed in the future

export const aboutSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
});

export const aboutSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  sections: z.array(aboutSectionSchema).optional(),
});

export type AboutSectionData = z.infer<typeof aboutSectionSchema>;
export type AboutFormData = z.infer<typeof aboutSchema>;
