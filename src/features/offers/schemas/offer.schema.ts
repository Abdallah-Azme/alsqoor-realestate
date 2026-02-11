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
