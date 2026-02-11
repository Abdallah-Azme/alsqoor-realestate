import { z } from "zod";

/**
 * Helper to create translatable Zod error messages
 * Usage: z.string().min(5, t("errors.min_length", { min: 5 }))
 */

export const createTranslatableSchema = (
  t: (key: string, values?: Record<string, any>) => string,
) => {
  return {
    string: {
      min: (min: number) => t("validation.string_min", { min }),
      max: (max: number) => t("validation.string_max", { max }),
      required: () => t("validation.required"),
      email: () => t("validation.email"),
    },
    number: {
      positive: () => t("validation.number_positive"),
      min: (min: number) => t("validation.number_min", { min }),
      max: (max: number) => t("validation.number_max", { max }),
      required: () => t("validation.required"),
    },
  };
};
