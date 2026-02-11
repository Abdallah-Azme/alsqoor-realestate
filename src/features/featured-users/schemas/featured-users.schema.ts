import { z } from "zod";

// Featured users are read-only from API, no form schemas needed
// This file contains validation schemas for any filter/search forms

export const featuredUsersFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export type FeaturedUsersFilterData = z.infer<typeof featuredUsersFilterSchema>;
