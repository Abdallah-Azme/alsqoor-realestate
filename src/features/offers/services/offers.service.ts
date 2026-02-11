import { api } from "@/lib/api-client";
import { Offer } from "../types/offer.types";

const BASE_PATH = "/offers";

/**
 * Offers service - functions for offers API operations
 */
export const offersService = {
  /**
   * Get all offers with optional pagination
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Offer[]>(BASE_PATH, params);
  },

  /**
   * Get a single offer by ID
   */
  async getById(id: string | number) {
    return api.get<Offer>(`${BASE_PATH}/${id}`);
  },
};
