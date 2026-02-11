import { api } from "@/lib/api-client";
import { FeaturedUser } from "../types/featured-users.types";

const BASE_PATH = "/featured-users";

/**
 * Featured users service - functions for featured users API operations
 */
export const featuredUsersService = {
  /**
   * Get all featured users with optional pagination and search
   */
  async getAll(params?: { page?: number; per_page?: number; search?: string }) {
    return api.get<FeaturedUser[]>(BASE_PATH, params);
  },

  /**
   * Get a single featured user by ID
   */
  async getById(id: string | number) {
    return api.get<FeaturedUser>(`${BASE_PATH}/${id}`);
  },
};
