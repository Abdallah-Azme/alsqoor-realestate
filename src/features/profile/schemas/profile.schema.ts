import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

export const updateAvatarSchema = z.object({
  avatar: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Avatar must be less than 5MB",
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type UpdateAvatarData = z.infer<typeof updateAvatarSchema>;
