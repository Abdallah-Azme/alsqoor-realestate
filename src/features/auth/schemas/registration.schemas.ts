import { z } from "zod";

// Base object for common fields (without refinements to allow extension)
const baseRegistrationFields = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[!@#$%^&*]/, "Password must contain special character"),
  password_confirmation: z.string(),
  terms_accepted: z.literal("1"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

// Helper for password confirmation refinement
const withPasswordConfirmation = (schema: z.ZodObject<any, any>) =>
  schema.refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

// Owner schema
export const ownerRegistrationSchema = withPasswordConfirmation(
  baseRegistrationFields.extend({
    role: z.literal("owner"),
    whatsapp: z.string().optional(),
    backup_mobile: z.string().optional(),
  }),
);

// Agent schema
export const agentRegistrationSchema = withPasswordConfirmation(
  baseRegistrationFields.extend({
    role: z.literal("agent"),
    fal_number: z.string().min(1, "FAL number is required"),
    agent_type: z.enum(["individual", "office"]).optional(),
    company_name: z.string().optional(),
    company_logo: z.instanceof(File).optional(),
    whatsapp: z.string().optional(),
    backup_mobile: z.string().optional(),
  }),
);

// Developer schema
export const developerRegistrationSchema = withPasswordConfirmation(
  baseRegistrationFields.extend({
    role: z.literal("developer"),
    type: z.literal("developer"),
    company_name: z.string().min(1, "Company name is required"),
    company_logo: z.instanceof(File, { message: "Company logo is required" }),
    commercial_register: z.string().min(1, "Commercial register is required"),
    whatsapp: z.string().optional(),
    backup_mobile: z.string().optional(),
  }),
);

// Seeker schema
export const seekerRegistrationSchema = withPasswordConfirmation(
  baseRegistrationFields.extend({
    role: z.literal("seeker"),
  }),
);

// Export type inference
export type OwnerRegistrationFormData = z.infer<typeof ownerRegistrationSchema>;
export type AgentRegistrationFormData = z.infer<typeof agentRegistrationSchema>;
export type DeveloperRegistrationFormData = z.infer<
  typeof developerRegistrationSchema
>;
export type SeekerRegistrationFormData = z.infer<
  typeof seekerRegistrationSchema
>;
