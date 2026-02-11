import { z } from "zod";

// Property type enum
export const propertyTypeSchema = z.enum([
  "villa",
  "residential_land",
  "commercial_land",
  "apartment",
  "floor",
  "shop",
  "building",
  "warehouse",
  "rest_house",
  "farm",
]);

// Ad type enum
export const adTypeSchema = z.enum(["sale", "rent"]);

// Rent period enum
export const rentPeriodSchema = z.enum(["daily", "monthly", "yearly"]);

// Housing type enum
export const housingTypeSchema = z.enum(["families", "singles", "both"]);

// Street facing enum
export const streetFacingSchema = z.enum([
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
]);

// Property usage enum
export const propertyUsageSchema = z.enum([
  "residential",
  "commercial",
  "industrial",
  "agricultural",
]);

// Property amenity enum
export const propertyAmenitySchema = z.enum([
  "parking",
  "elevator",
  "security",
  "pool",
  "gym",
  "garden",
  "central_ac",
  "furnished",
  "kitchen",
  "maid_room",
  "driver_room",
  "basement",
]);

// Contact method enum
export const contactMethodSchema = z.enum(["phone", "whatsapp", "chat"]);

// Step 1: License check
export const licenseStepSchema = z.object({
  hasLicense: z.boolean(),
});

// Step 2: Property type & ad type
export const propertyTypeStepSchema = z.object({
  propertyType: propertyTypeSchema,
  adType: adTypeSchema,
  rentPeriod: rentPeriodSchema.optional(),
  housingType: housingTypeSchema.optional(),
});

// Step 3: Location
export const locationStepSchema = z.object({
  city: z.string().min(1, "city_required"),
  neighborhood: z.string().min(1, "neighborhood_required"),
});

// Step 4: Details
export const detailsStepSchema = z.object({
  area: z.string().min(1, "area_required"),
  totalPrice: z.string().min(1, "price_required"),
  pricePerMeter: z.string().optional(),
  usage: z.array(propertyUsageSchema).min(1, "usage_required"),
  amenities: z.array(propertyAmenitySchema).optional(),
  streetWidth: z.string().optional(),
  streetFacing: streetFacingSchema.optional(),
  obligations: z.string().optional(),
  description: z.string().min(10, "description_min"),
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

// Step 7: Authority registration
export const authorityStepSchema = z.object({
  licenseNumber: z.string().optional(),
  advertiserId: z.string().optional(),
  advertiserIdType: z.string().optional(),
  wantsBrokerContract: z.boolean().default(false),
});

// Full advertisement schema
export const createAdvertisementSchema = z.object({
  hasLicense: z.boolean(),
  propertyType: propertyTypeSchema,
  adType: adTypeSchema,
  rentPeriod: rentPeriodSchema.optional(),
  housingType: housingTypeSchema.optional(),
  city: z.string().min(1),
  neighborhood: z.string().min(1),
  area: z.string().min(1),
  totalPrice: z.string().min(1),
  pricePerMeter: z.string().optional(),
  usage: z.array(propertyUsageSchema).min(1),
  amenities: z.array(propertyAmenitySchema).optional(),
  streetWidth: z.string().optional(),
  streetFacing: streetFacingSchema.optional(),
  obligations: z.string().optional(),
  description: z.string().min(10),
  images: z.array(z.any()).min(1),
  videos: z.array(z.any()).optional(),
  contactMethods: z.array(contactMethodSchema).min(1),
  licenseNumber: z.string().optional(),
  advertiserId: z.string().optional(),
  advertiserIdType: z.string().optional(),
  wantsBrokerContract: z.boolean().default(false),
});

export type CreateAdvertisementFormData = z.infer<
  typeof createAdvertisementSchema
>;
