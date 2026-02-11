import { api } from "@/lib/api-client";
import { Package } from "../types/packages.types";

const BASE_PATH = "/packages";

/**
 * Packages service - functions for packages API operations
 */
export const packagesService = {
  /**
   * Get all packages with optional pagination
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Package[]>(BASE_PATH, params);
  },

  /**
   * Get a single package by ID
   */
  async getById(id: string | number) {
    return api.get<Package>(`${BASE_PATH}/${id}`);
  },
};
