import { z } from "zod";

// Settings schemas for various settings forms

export const contactSettingsSchema = z.object({
  sitePhone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  address: z.string().optional(),
});

export const socialSettingsSchema = z.object({
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ContactSettingsData = z.infer<typeof contactSettingsSchema>;
export type SocialSettingsData = z.infer<typeof socialSettingsSchema>;
