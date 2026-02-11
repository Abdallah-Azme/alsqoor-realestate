import { api } from "@/lib/api-client";

const BASE_PATH = "/newsletter";

/**
 * Newsletter service - functions for newsletter API operations
 */
export const newsletterService = {
  /**
   * Subscribe to newsletter
   */
  async subscribe(email: string) {
    return api.post(BASE_PATH, { email });
  },
};
