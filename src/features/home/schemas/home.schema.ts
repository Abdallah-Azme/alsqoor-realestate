import { z } from "zod";

// Home page data is read-only
// This schema is for the property search/filter form on home

export const homeSearchSchema = z.object({
  governorate: z.string().optional(),
  type: z.string().optional(),
  purpose: z.enum(["sale", "rent"]).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
});

export type HomeSearchData = z.infer<typeof homeSearchSchema>;
