import { api } from "@/lib/api-client";
import { Deal } from "../types/deal.types";

const BASE_PATH = "/direct-deals";

/**
 * Deals service - functions for deals API operations
 */
export const dealsService = {
  /**
   * Get all deals with optional pagination
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Deal[]>(BASE_PATH, params);
  },

  /**
   * Get a single deal by ID
   */
  async getById(id: string | number) {
    return api.get<Deal>(`${BASE_PATH}/${id}`);
  },

  /**
   * Add a new deal (FormData for images)
   */
  async addDeal(formData: FormData) {
    return api.post(`${BASE_PATH}/add`, formData);
  },

  /**
   * Update an existing deal
   */
  async updateDeal(dealId: string | number, formData: FormData) {
    return api.put(`${BASE_PATH}/${dealId}`, formData);
  },
};
