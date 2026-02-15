import { api } from "@/lib/api-client";
import { UserGuide } from "../types/user-guide.types";

const BASE_PATH = "/user-guide";

/**
 * User guide service - functions for user guide API operations
 */
export const userGuideService = {
  /**
   * Get user guide sections
   */
  async getUserGuide(): Promise<UserGuide> {
    return api.get<UserGuide>(BASE_PATH);
  },
};
