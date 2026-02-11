import { api } from "@/lib/api-client";
import { AboutData } from "../types/about.types";

const BASE_PATH = "/about";

/**
 * About service - functions for about page API operations
 */
export const aboutService = {
  /**
   * Get about page data
   */
  async getAboutData(): Promise<AboutData> {
    return api.get<AboutData>(BASE_PATH);
  },
};
