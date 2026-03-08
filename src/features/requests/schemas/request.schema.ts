import { z } from "zod";

export const getRequestSchema = (t: any) =>
  z.object({
    request_type: z.enum(["buy", "rent"]),
    area: z.string().min(1, t("area_required")),
    property_age: z.string().min(1, t("property_age_required")),
    payment_method: z.enum(["cash", "finance"]),
    details: z.string().min(10, t("details_min_10")),
    offer: z.string().min(10, t("offer_min_10")),
    budget_type: z.enum(["market_price", "specific_budget"]),
    budget_amount: z.string().optional(),
    whatsapp: z.string().min(10, t("whatsapp_required")),
    telegram: z.string().min(3, t("telegram_required")),
    country_id: z.number().min(1, t("country_required")),
    city_id: z.number().min(1, t("city_required")),
    district: z.string().min(2, t("district_required")),
    is_urgent: z.enum(["0", "1"]),
  });

export const requestFilterSchema = z.object({
  details: z.string().optional(),
  country_id: z.number().optional(),
  city_id: z.number().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
});

export type RequestFormData = z.infer<ReturnType<typeof getRequestSchema>>;
export type RequestFilterData = z.infer<typeof requestFilterSchema>;
