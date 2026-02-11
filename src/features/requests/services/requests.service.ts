import { api } from "@/lib/api-client";
import type {
  PropertyRequest,
  PropertyRequestsResponse,
  SinglePropertyRequestResponse,
  CreatePropertyRequestData,
  PropertyRequestFilters,
} from "../types/request.types";

const BASE_PATH = "/property-requests";

/**
 * Property requests service - functions for property requests API operations
 */
export const requestsService = {
  /**
   * Get all property requests with optional filters
   */
  async getAll(filters?: PropertyRequestFilters) {
    return api.get<PropertyRequestsResponse>(
      BASE_PATH,
      filters as Record<string, any>,
    );
  },

  /**
   * Get a single property request by ID
   */
  async getById(id: number) {
    return api.get<SinglePropertyRequestResponse>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get current user's property requests
   */
  async getMyRequests() {
    return api.get<PropertyRequestsResponse>(
      `${BASE_PATH}/my-property-requests`,
    );
  },

  /**
   * Create a new property request
   */
  async create(data: CreatePropertyRequestData) {
    return api.post<SinglePropertyRequestResponse>(BASE_PATH, data);
  },

  /**
   * Update an existing property request
   */
  async update(id: number, data: Partial<CreatePropertyRequestData>) {
    return api.post<SinglePropertyRequestResponse>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Delete a property request
   */
  async delete(id: number) {
    return api.del(`${BASE_PATH}/${id}`);
  },
};
