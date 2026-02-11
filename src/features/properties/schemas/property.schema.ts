import { z } from "zod";

// ============= Enum Schemas =============

export const operationTypeSchema = z.enum(["sale", "rent"]);

export const finishingTypeSchema = z.enum([
  "none",
  "basic",
  "good",
  "luxury",
  "super_luxury",
]);

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

export const marketingOptionSchema = z.enum(["none", "advertising", "agent"]);

export const obligationsSchema = z.enum(["yes", "no"]);

// ============= Main Property Schema (Add) =============

export const basePropertySchema = z.object({
  // Basic info
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .optional(),

  // Location
  country_id: z.number().int().positive("Country is required"),
  city_id: z.number().int().positive("City is required"),
  district: z.string().min(2, "District is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Category & operation
  category_id: z.number().int().positive("Category is required"),
  operation_type: operationTypeSchema,

  // Pricing
  price_min: z.number().positive("Minimum price must be positive"),
  price_max: z.number().positive("Maximum price must be positive"),
  price_hidden: z.boolean().optional().default(false),
  price_per_meter: z.number().positive().optional(),

  // Dimensions
  area: z.number().positive("Area must be positive"),
  usable_area: z.number().positive().optional(),
  rooms: z.number().int().positive("Number of rooms must be positive"),
  bathrooms: z.number().int().positive("Number of bathrooms must be positive"),
  balconies: z.number().int().nonnegative().optional(),
  garages: z.number().int().nonnegative().optional(),

  // Property details
  finishing_type: finishingTypeSchema,
  property_use: propertyUseSchema,
  facade: facadeSchema.optional(),
  property_age: z.number().int().nonnegative().optional(),

  // Services & amenities
  services: z.array(z.string()).optional(),
  amenity_ids: z.array(z.number().int().positive()).optional(),

  // Legal & documentation
  obligations: obligationsSchema.optional(),
  license_number: z.string().optional(),
  license_expiry_date: z.string().optional(),
  plan_number: z.string().optional(),
  plot_number: z.string().optional(),
  area_name: z.string().optional(),

  // Financial
  has_mortgage: z.boolean().optional(),
  has_restriction: z.boolean().optional(),
  guarantees: z.string().optional(),

  // Media (handled separately as File objects)
  images: z.array(z.any()).optional(),
  videos: z.array(z.any()).optional(),
  qr_code: z.any().optional(),

  // Marketing
  is_featured: z.boolean().optional().default(false),
  marketing_option: marketingOptionSchema.optional().default("none"),
});

export const propertySchema = basePropertySchema.refine(
  (data) => data.price_max >= data.price_min,
  {
    message: "Maximum price must be greater than or equal to minimum price",
    path: ["price_max"],
  },
);

// ============= Update Property Schema =============

export const updatePropertySchema = basePropertySchema.partial().extend({
  // At least one field must be provided for update
  title: z.string().min(5).max(255).optional(),
  description: z.string().min(20).max(5000).optional(),
});

// ============= Convert to Advertisement Schema =============

export const convertToAdvertisementSchema = z.object({
  // Required fields for conversion
  license_number: z.string().min(1, "License number is required"),
  license_expiry_date: z.string().min(1, "License expiry date is required"),
  qr_code: z.any().refine((file) => file !== null && file !== undefined, {
    message: "QR code is required",
  }),

  // Category & operation
  category_id: z.number().int().positive("Category is required"),
  operation_type: operationTypeSchema,

  // Optional fields
  usable_area: z.number().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  balconies: z.number().int().nonnegative().optional(),
  garages: z.number().int().nonnegative().optional(),
  finishing_type: finishingTypeSchema.optional(),
  property_use: propertyUseSchema.optional(),
  facade: facadeSchema.optional(),
  property_age: z.number().int().nonnegative().optional(),
  services: z.array(z.string()).optional(),
  plan_number: z.string().optional(),
  plot_number: z.string().optional(),
  area_name: z.string().optional(),
  has_mortgage: z.boolean().optional(),
  has_restriction: z.boolean().optional(),
  guarantees: z.string().optional(),
  price_per_meter: z.number().positive().optional(),
  images: z.array(z.any()).optional(),
  videos: z.array(z.any()).optional(),
  amenity_ids: z.array(z.number().int().positive()).optional(),
  is_featured: z.boolean().optional(),
  marketing_option: marketingOptionSchema.optional(),
});

// ============= Type Exports =============

export type PropertyFormData = z.infer<typeof propertySchema>;
export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;
export type ConvertToAdvertisementFormData = z.infer<
  typeof convertToAdvertisementSchema
>;
