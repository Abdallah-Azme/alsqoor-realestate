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
    return api.get<Favorite[]>(BASE_PATH);
  },

  /**
   * Add property to favorites
   */
  async addFavorite(propertyId: number | string) {
    return api.post(`${BASE_PATH}/add`, {
      favoritable_id: propertyId,
      favoritable_type: "App\\Models\\Property",
    });
  },

  /**
   * Remove property from favorites
   */
  async removeFavorite(favoriteId: number | string) {
    return api.del(`${BASE_PATH}/${favoriteId}`);
  },

  /**
   * Check if property is in favorites
   */
  async checkFavorite(favoriteId: number | string): Promise<boolean> {
    try {
      await api.get(`${BASE_PATH}/${favoriteId}`);
      return true;
    } catch {
      return false;
    }
  },
};
