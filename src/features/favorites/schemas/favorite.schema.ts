import { z } from "zod";

// Favorites are managed via toggle, no form validation needed
// This schema is for any filter/search functionality

export const favoritesFilterSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  category: z.string().optional(),
});

export type FavoritesFilterData = z.infer<typeof favoritesFilterSchema>;
