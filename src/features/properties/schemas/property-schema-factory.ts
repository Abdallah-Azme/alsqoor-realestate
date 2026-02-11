import { z } from "zod";

/**
 * Factory to create property schema with translated error messages
 * @param t - Translation function from useTranslations("validation")
 */
export const createPropertySchema = (
  t: (key: string, values?: Record<string, any>) => string,
) => {
  // ============= Enum Schemas =============

  const operationTypeSchema = z.enum(["sale", "rent"]);

  const finishingTypeSchema = z.enum([
    "none",
    "basic",
    "good",
    "luxury",
    "super_luxury",
  ]);

  const propertyUseSchema = z.enum([
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

  const facadeSchema = z.enum([
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

  const marketingOptionSchema = z.enum(["none", "advertising", "agent"]);

  const obligationsSchema = z.enum(["yes", "no"]);

  // ============= Main Property Schema (Add) =============

  const basePropertySchema = z.object({
    // Basic info
    title: z
      .string()
      .min(5, t("string_min", { min: 5 }))
      .max(255, t("string_max", { max: 255 })),
    description: z
      .string()
      .min(20, t("string_min", { min: 20 }))
      .max(5000, t("string_max", { max: 5000 }))
      .optional(),

    // Location
    country_id: z.number().int().positive(t("country_required")),
    city_id: z.number().int().positive(t("city_required")),
    district: z.string().min(2, t("district_required")),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),

    // Category & operation
    category_id: z.number().int().positive(t("category_required")),
    operation_type: operationTypeSchema,

    // Pricing
    price_min: z.number().positive(t("number_positive")),
    price_max: z.number().positive(t("number_positive")),
    price_hidden: z.boolean().optional().default(false),
    price_per_meter: z.number().positive().optional(),

    // Dimensions
    area: z.number().positive(t("area_positive")),
    usable_area: z.number().positive().optional(),
    rooms: z.number().int().positive(t("rooms_positive")),
    bathrooms: z.number().int().positive(t("bathrooms_positive")),
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

  const propertySchema = basePropertySchema.refine(
    (data) => data.price_max >= data.price_min,
    {
      message: t("price_max_greater"),
      path: ["price_max"],
    },
  );

  return {
    propertySchema,
    basePropertySchema,
    operationTypeSchema,
    finishingTypeSchema,
    propertyUseSchema,
    facadeSchema,
    marketingOptionSchema,
    obligationsSchema,
  };
};

// Export type helpers
export type PropertyFormInput = z.infer<
  ReturnType<typeof createPropertySchema>["propertySchema"]
>;
