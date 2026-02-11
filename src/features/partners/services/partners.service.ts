import { api } from "@/lib/api-client";
import { Partner } from "../types/partner.types";

const BASE_PATH = "/companies";

/**
 * Partners service - functions for partners (companies) API operations
 */
export const partnersService = {
  /**
   * Get all partners with optional pagination
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Partner[]>(BASE_PATH, params);
  },

  /**
   * Get a single partner by ID
   */
  async getById(id: string | number) {
    return api.get<Partner>(`${BASE_PATH}/${id}`);
  },
};
