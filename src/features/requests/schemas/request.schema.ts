import { z } from "zod";

export const requestSchema = z.object({
  request_type: z.enum(["buy", "rent"]),
  area: z.string().min(1, "Area is required"),
  property_age: z.string().min(1, "Property age is required"),
  payment_method: z.enum(["cash", "finance"]),
  details: z.string().min(10, "Details must be at least 10 characters"),
  offer: z.string().min(10, "Offer must be at least 10 characters"),
  budget_type: z.enum(["market_price", "specific_budget"]),
  budget_amount: z.string().optional(),
  whatsapp: z.string().min(10, "WhatsApp number is required"),
  telegram: z.string().min(3, "Telegram username is required"),
  country_id: z.number().min(1, "Country is required"),
  city_id: z.number().min(1, "City is required"),
  district: z.string().min(2, "District is required"),
});

export const requestFilterSchema = z.object({
  details: z.string().optional(),
  country_id: z.number().optional(),
  city_id: z.number().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
});

export type RequestFormData = z.infer<typeof requestSchema>;
export type RequestFilterData = z.infer<typeof requestFilterSchema>;
