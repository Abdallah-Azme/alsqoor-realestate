import { z } from "zod";

// Offers are read-only from API
// This schema is for any filter functionality

export const offersFilterSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  type: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type OffersFilterData = z.infer<typeof offersFilterSchema>;

// Property Offers Schema
export const submitOfferSchema = z.object({
  property_new_id: z.number().int().positive("Property ID is required"),
  offer_details: z
    .string()
    .min(10, "Offer details must be at least 10 characters")
    .max(1000, "Offer details must not exceed 1000 characters"),
});

export type SubmitOfferFormData = z.infer<typeof submitOfferSchema>;

// Site Offer Creation Schema
export const createSiteOfferSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  validity_days: z.coerce
    .number()
    .int()
    .positive("Validity days must be a positive integer"),
  whatsapp_number: z.string().optional(),
  is_active: z.boolean().default(true),
  features: z
    .array(
      z.object({
        feature: z.string().min(1, "Feature description is required"),
      }),
    )
    .default([]),
});

export type CreateSiteOfferFormData = z.infer<typeof createSiteOfferSchema>;
