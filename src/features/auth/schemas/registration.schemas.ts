import { z } from "zod";

// Helper type for translation function
type TFunction = (key: string) => string;

// Base object for common fields (without refinements to allow extension)
const createBaseRegistrationFields = (t: TFunction) =>
  z.object({
    name: z.string().min(2, t("validation.name_min")),
    email: z.string().email(t("validation.email_invalid")),
    mobile: z.string().min(10, t("validation.phone_min")),
    password: z
      .string()
      .min(8, t("validation.password_min"))
      .regex(/[A-Z]/, t("password_requirements.has_uppercase"))
      .regex(/[0-9]/, t("password_requirements.has_number"))
      .regex(/[!@#$%^&*]/, t("password_requirements.has_special")),
    password_confirmation: z.string(),
    terms_accepted: z.literal("1"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
  });

// Helper for password confirmation refinement
// Helper for password confirmation refinement
const withPasswordConfirmation = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  t: TFunction,
) =>
  schema.refine((data: any) => data.password === data.password_confirmation, {
    message: t("validation.passwords_not_match"),
    path: ["password_confirmation"],
  });

// Owner schema
export const createOwnerRegistrationSchema = (t: TFunction) =>
  withPasswordConfirmation(
    createBaseRegistrationFields(t).extend({
      role: z.literal("owner"),
      whatsapp: z.string().optional(),
      backup_mobile: z.string().optional(),
      fal_number: z.string().optional(),
      fal_expiry_date: z.string().optional(),
      has_fal_license: z.enum(["0", "1"]).optional(),
      fal_license_image: z.instanceof(File).optional(),
      has_ad_license: z.enum(["0", "1"]).optional(),
    }),
    t,
  );

// Agent schema
export const createAgentRegistrationSchema = (t: TFunction) =>
  withPasswordConfirmation(
    createBaseRegistrationFields(t).extend({
      role: z.literal("agent"),
      fal_number: z.string().min(1, t("validation.required")),
      agent_type: z.enum(["individual", "office"]).optional(),
      company_name: z.string().optional(),
      company_logo: z.instanceof(File).optional(),
      whatsapp: z.string().optional(),
      backup_mobile: z.string().optional(),
      fal_expiry_date: z.string().min(1, t("validation.required")),
      has_ad_license: z.enum(["0", "1"]),
      fal_license_image: z.instanceof(File, {
        message: t("validation.required"),
      }),
    }),
    t,
  );

// Developer schema
export const createDeveloperRegistrationSchema = (t: TFunction) =>
  withPasswordConfirmation(
    createBaseRegistrationFields(t).extend({
      role: z.literal("developer"),
      type: z.literal("developer"),
      company_name: z
        .string()
        .min(
          1,
          t("validation.company_name_required") || t("validation.required"),
        ),
      company_logo: z.instanceof(File, {
        message:
          t("validation.company_logo_required") || t("validation.required"),
      }),
      commercial_register: z
        .string()
        .min(1, t("validation.commercial_registration_required")),
      whatsapp: z.string().optional(),
      backup_mobile: z.string().optional(),
      fal_number: z.string().min(1, t("validation.required")),
      fal_expiry_date: z.string().min(1, t("validation.required")),
      has_fal_license: z.enum(["0", "1"]),
      fal_license_image: z.instanceof(File).optional(),
      has_ad_license: z.enum(["0", "1"]),
    }),
    t,
  );

// Seeker schema
export const createSeekerRegistrationSchema = (t: TFunction) =>
  withPasswordConfirmation(
    createBaseRegistrationFields(t).extend({
      role: z.literal("seeker"),
    }),
    t,
  );

// Static schemas for type inference
const staticBaseFields = z.object({
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  terms_accepted: z.literal("1"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const staticWithPasswordConfirmation = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) =>
  schema.refine((data: any) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
  });

const staticOwnerSchema = staticWithPasswordConfirmation(
  staticBaseFields.extend({
    role: z.literal("owner"),
    whatsapp: z.string().optional(),
    backup_mobile: z.string().optional(),
    fal_number: z.string().optional(),
    fal_expiry_date: z.string().optional(),
    has_fal_license: z.enum(["0", "1"]).optional(),
    fal_license_image: z.instanceof(File).optional(),
    has_ad_license: z.enum(["0", "1"]).optional(),
  }),
);

const staticAgentSchema = staticWithPasswordConfirmation(
  staticBaseFields.extend({
    role: z.literal("agent"),
    fal_number: z.string(),
    agent_type: z.enum(["individual", "office"]).optional(),
    company_name: z.string().optional(),
    company_logo: z.instanceof(File).optional(),
    whatsapp: z.string().optional(),
    backup_mobile: z.string().optional(),
    fal_expiry_date: z.string(),
    has_ad_license: z.enum(["0", "1"]),
    fal_license_image: z.instanceof(File),
  }),
);

const staticDeveloperSchema = staticWithPasswordConfirmation(
  staticBaseFields.extend({
    role: z.literal("developer"),
    type: z.literal("developer"),
    company_name: z.string(),
    company_logo: z.instanceof(File),
    commercial_register: z.string(),
    whatsapp: z.string().optional(),
    backup_mobile: z.string().optional(),
    fal_number: z.string(),
    fal_expiry_date: z.string(),
    has_fal_license: z.enum(["0", "1"]),
    fal_license_image: z.instanceof(File).optional(),
    has_ad_license: z.enum(["0", "1"]),
  }),
);

const staticSeekerSchema = staticWithPasswordConfirmation(
  staticBaseFields.extend({
    role: z.literal("seeker"),
  }),
);

// Export types from static schemas
export type OwnerRegistrationFormData = z.infer<typeof staticOwnerSchema>;
export type AgentRegistrationFormData = z.infer<typeof staticAgentSchema>;
export type DeveloperRegistrationFormData = z.infer<
  typeof staticDeveloperSchema
>;
export type SeekerRegistrationFormData = z.infer<typeof staticSeekerSchema>;
