import { z } from "zod";

// User guide data is read-only from API
// This schema is for any search/filter functionality

export const userGuideFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
});

export type UserGuideFilterData = z.infer<typeof userGuideFilterSchema>;
