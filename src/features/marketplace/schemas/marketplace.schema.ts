import { z } from "zod";

export const marketplaceFilterSchema = z.object({
  tab: z.enum(["owners", "brokers", "developers"]).optional(),
  propertyType: z.string().optional(),
  operationType: z.enum(["sale", "rent"]).optional(),
  city: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const startMarketingSchema = z.object({
  duration: z.number().min(1, "Duration is required"),
  package: z.string().optional(),
});

export const ownerFilterSchema = z.object({
  filter: z.enum(["all", "unread", "read", "active", "expired"]).optional(),
});

export const ownerSortSchema = z.object({
  sort: z
    .enum([
      "default",
      "newest",
      "oldest",
      "largest_area",
      "smallest_area",
      "highest_price",
      "lowest_price",
    ])
    .optional(),
});

export type MarketplaceFilterData = z.infer<typeof marketplaceFilterSchema>;
export type StartMarketingData = z.infer<typeof startMarketingSchema>;
export type OwnerFilterData = z.infer<typeof ownerFilterSchema>;
export type OwnerSortData = z.infer<typeof ownerSortSchema>;
