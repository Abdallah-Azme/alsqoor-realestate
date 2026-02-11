import { api } from "@/lib/api-client";
import { Favorite } from "../types/favorite.types";

const BASE_PATH = "/favorites";

/**
 * Favorites service - functions for favorite API operations
 */
export const favoritesService = {
  /**
   * Get all user favorites
   */
  async getFavorites(): Promise<Favorite[]> {
    return api.get<Favorite[]>(`${BASE_PATH}/`);
  },

  /**
   * Add property to favorites
   */
  async addFavorite(propertyId: number | string) {
    return api.post(`${BASE_PATH}/${propertyId}`, {});
  },

  /**
   * Remove property from favorites
   */
  async removeFavorite(propertyId: number | string) {
    return api.del(`${BASE_PATH}/${propertyId}`);
  },

  /**
   * Check if property is in favorites
   */
  async checkFavorite(propertyId: number | string): Promise<boolean> {
    try {
      await api.get(`${BASE_PATH}/${propertyId}`);
      return true;
    } catch {
      return false;
    }
  },
};
