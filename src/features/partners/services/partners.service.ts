import { api } from "@/lib/api-client";
import {
  Agent,
  Company,
  Partner,
  UserDataProperty,
  UserDataRequest,
  UserDataResponse,
} from "../types/partner.types";

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
   * Get active agents
   */
  async getActiveAgents() {
    return api.get<Agent[]>("/active-agents");
  },

  /**
   * Get a single partner by ID
   */
  async getById(id: string | number, options?: { locale?: string }) {
    return api.get<Company>(`${BASE_PATH}/${id}`, undefined, options);
  },

  /**
   * Get user marketed properties
   */
  async getUserMarketedProperties(userId: string | number, page: number = 1) {
    return api.get<UserDataProperty[]>(
      `/userdata/${userId}/marketed-properties`,
      { page }
    );
  },

  /**
   * Get user properties
   */
  async getUserProperties(userId: string | number, page: number = 1) {
    return api.get<UserDataProperty[]>(
      `/userdata/${userId}/properties`,
      { page }
    );
  },

  /**
   * Get user requests
   */
  async getUserRequests(userId: string | number, page: number = 1) {
    return api.get<UserDataRequest[]>(
      `/userdata/${userId}/requests`,
      { page }
    );
  },
};
