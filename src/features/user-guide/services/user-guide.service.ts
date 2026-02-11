import { api } from "@/lib/api-client";
import { UserGuideSection } from "../types/user-guide.types";

const BASE_PATH = "/user-guide";

/**
 * User guide service - functions for user guide API operations
 */
export const userGuideService = {
  /**
   * Get user guide sections
   */
  async getUserGuide(): Promise<UserGuideSection[]> {
    return api.get<UserGuideSection[]>(BASE_PATH);
  },
};
