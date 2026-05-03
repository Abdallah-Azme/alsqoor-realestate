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

// Property Offers Schema (messages from `offers` namespace via next-intl)
export const getSubmitOfferSchema = (t: (key: string) => string) =>
  z.object({
    property_new_id: z.number().int().positive(t("property_id_required")),
    offer_details: z
      .string()
      .min(10, t("offer_details_min"))
      .max(1000, t("offer_details_max")),
  });

export type SubmitOfferFormData = z.infer<
  ReturnType<typeof getSubmitOfferSchema>
>;

// Site Offer Creation Schema
export const getCreateSiteOfferSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t("name_min_3")),
    description: z.string().min(10, t("description_min_10")),
    price: z.coerce.number().positive(t("price_positive")),
    validity_days: z.coerce.number().int().positive(t("validity_positive")),
    whatsapp_number: z.string().optional(),
    is_active: z.boolean().default(true),
    features: z
      .array(
        z.object({
          feature: z.string().min(1, t("feature_required")),
        }),
      )
      .default([]),
  });

export type CreateSiteOfferFormData = z.infer<
  ReturnType<typeof getCreateSiteOfferSchema>
>;
