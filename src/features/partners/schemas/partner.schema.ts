import { z } from "zod";

// Partners are read-only from API
// This schema is for any admin forms if needed

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().url("Invalid logo URL").optional(),
  website: z.string().url("Invalid website URL").optional(),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;
