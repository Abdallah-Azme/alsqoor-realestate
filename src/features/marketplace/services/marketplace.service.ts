import { api } from "@/lib/api-client";
import {
  MarketplaceProperty,
  BrokerProperty,
  DeveloperProject,
  MarketplaceFilters,
} from "../types/marketplace.types";

const BASE_PATH = "/marketplace";

/**
 * Marketplace service - functions for marketplace API operations
 */
export const marketplaceService = {
  /**
   * Get all marketplace properties
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<MarketplaceProperty[]>(BASE_PATH, params);
  },

  /**
   * Get a single property by ID
   */
  async getById(id: string | number) {
    return api.get<MarketplaceProperty>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get owner properties with filters
   */
  async getOwnerProperties(
    filters?: Partial<MarketplaceFilters>,
  ): Promise<MarketplaceProperty[]> {
    return api.get<MarketplaceProperty[]>(
      `${BASE_PATH}/owners`,
      filters as Record<string, any>,
    );
  },

  /**
   * Get broker properties with filters
   */
  async getBrokerProperties(
    filters?: Partial<MarketplaceFilters>,
  ): Promise<BrokerProperty[]> {
    return api.get<BrokerProperty[]>(
      `${BASE_PATH}/brokers`,
      filters as Record<string, any>,
    );
  },

  /**
   * Get developer projects with filters
   */
  async getDeveloperProjects(
    filters?: Partial<MarketplaceFilters>,
  ): Promise<DeveloperProject[]> {
    return api.get<DeveloperProject[]>(
      `${BASE_PATH}/developers`,
      filters as Record<string, any>,
    );
  },

  /**
   * Start marketing a property
   */
  async startMarketing(
    propertyId: string,
    data: { duration: number; package?: string },
  ) {
    return api.post(`${BASE_PATH}/${propertyId}/marketing`, data);
  },
};
