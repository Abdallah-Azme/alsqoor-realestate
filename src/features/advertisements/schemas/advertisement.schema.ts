import { z } from "zod";

// Operation type: sale or rent
export const operationTypeSchema = z.enum(["sale", "rent"]);

// Finishing type
export const finishingTypeSchema = z.enum([
  "none",
  "basic",
  "good",
  "luxury",
  "super_luxury",
]);

// Property use
export const propertyUseSchema = z.enum([
  "apartment",
  "villa",
  "land_residential",
  "land_commercial",
  "commercial_shop",
  "office",
  "warehouse",
  "building",
  "farm",
  "factory",
  "other",
]);

// Facade direction
export const facadeSchema = z.enum([
  "north",
  "south",
  "east",
  "west",
  "north_east",
  "north_west",
  "south_east",
  "south_west",
  "multiple",
  "unknown",
]);

// Marketing option
export const marketingOptionSchema = z.enum(["none", "advertising", "agent"]);

// Contact method (UI only, not sent to API)
export const contactMethodSchema = z.enum(["phone", "whatsapp", "chat"]);

// ============= Step Schemas =============

// Step 1: License check
export const licenseStepSchema = z.object({
  hasLicense: z.boolean(),
});

// Step 2: Property type & category
export const propertyTypeStepSchema = z.object({
  category_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== 0, {
      message: "category_required",
    }),
  operation_type: operationTypeSchema,
  property_use: propertyUseSchema,
});

// Step 3: Location
export const locationStepSchema = z.object({
  country_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== 0, {
      message: "country_required",
    }),
  city_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== 0, {
      message: "city_required",
    }),
  district: z.string().min(1, "district_required"),
});

// Step 4: Details
export const detailsStepSchema = z.object({
  title: z.string().min(3, "title_required"),
  description: z.string().min(10, "description_min"),
  area: z.string().min(1, "area_required"),
  usable_area: z.string().optional(),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  balconies: z.string().optional(),
  garages: z.string().optional(),
  finishing_type: finishingTypeSchema,
  property_age: z.string().optional(),
  facade: facadeSchema.optional(),
  price_min: z.string().min(1, "price_required"),
  price_max: z.string().min(1, "price_required"),
  price_per_meter: z.string().optional(),
  price_hidden: z.boolean().optional(),
  amenity_ids: z.array(z.number()).optional(),
  services: z.array(z.string()).optional(),
  obligations: z.string().optional(),
});

// Step 5: Media
export const mediaStepSchema = z.object({
  images: z.array(z.any()).min(1, "images_required"),
  videos: z.array(z.any()).optional(),
});

// Step 6: Contact
export const contactStepSchema = z.object({
  contactMethods: z.array(contactMethodSchema).min(1, "contact_required"),
});

// Step 7: Authority / Legal
export const authorityStepSchema = z.object({
  license_number: z.string().optional(),
  license_expiry_date: z.string().optional(),
  qr_code: z.any().optional(),
  plan_number: z.string().optional(),
  plot_number: z.string().optional(),
  area_name: z.string().optional(),
  has_mortgage: z.boolean().optional(),
  has_restriction: z.boolean().optional(),
  guarantees: z.string().optional(),
  marketing_option: marketingOptionSchema,
  is_featured: z.boolean().optional(),
});

// Full advertisement schema
export const createAdvertisementSchema = z.object({
  // License (UI only)
  hasLicense: z.boolean(),

  // Property type & category
  category_id: z.union([z.string(), z.number()]),
  operation_type: operationTypeSchema,
  property_use: propertyUseSchema,

  // Location
  country_id: z.union([z.string(), z.number()]),
  city_id: z.union([z.string(), z.number()]),
  district: z.string().min(1),

  // Details
  title: z.string().min(3),
  description: z.string().min(10),
  area: z.string().min(1),
  usable_area: z.string().optional(),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  balconies: z.string().optional(),
  garages: z.string().optional(),
  finishing_type: finishingTypeSchema,
  property_age: z.string().optional(),
  facade: facadeSchema.optional(),
  price_min: z.string().min(1),
  price_max: z.string().min(1),
  price_per_meter: z.string().optional(),
  price_hidden: z.boolean().optional(),
  amenity_ids: z.array(z.number()).optional(),
  services: z.array(z.string()).optional(),
  obligations: z.string().optional(),

  // Media
  images: z.array(z.any()).min(1),
  videos: z.array(z.any()).optional(),

  // Contact (UI only)
  contactMethods: z.array(contactMethodSchema).min(1),

  // Authority / Legal
  license_number: z.string().optional(),
  license_expiry_date: z.string().optional(),
  qr_code: z.any().optional(),
  plan_number: z.string().optional(),
  plot_number: z.string().optional(),
  area_name: z.string().optional(),
  has_mortgage: z.boolean().optional(),
  has_restriction: z.boolean().optional(),
  guarantees: z.string().optional(),
  marketing_option: marketingOptionSchema,
  is_featured: z.boolean().optional(),
});

export type CreateAdvertisementFormData = z.infer<
  typeof createAdvertisementSchema
>;

// Legacy aliases for backward compatibility
export const propertyTypeSchema = propertyUseSchema;
export const adTypeSchema = operationTypeSchema;
export const streetFacingSchema = facadeSchema;
export const rentPeriodSchema = z.enum(["daily", "monthly", "yearly"]);
export const housingTypeSchema = z.enum(["families", "singles", "both"]);
export const propertyUsageSchema = z.enum([
  "residential",
  "commercial",
  "industrial",
  "agricultural",
]);
export const propertyAmenitySchema = z.string();
