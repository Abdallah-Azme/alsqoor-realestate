import { api } from "@/lib/api-client";
import type {
  PropertyRequest,
  PaginatedResponse,
  CreatePropertyRequestData,
  PropertyRequestFilters,
  RequestActionData,
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
    return api.get<PaginatedResponse<PropertyRequest>>(
      BASE_PATH,
      filters as Record<string, any>,
    );
  },

  /**
   * Get a single property request by ID
   */
  async getById(id: number) {
    return api.get<PropertyRequest>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get current user's property requests
   */
  async getMyRequests(filters?: PropertyRequestFilters) {
    return api.get<PaginatedResponse<PropertyRequest>>(
      `${BASE_PATH}/my-property-requests`,
      filters as Record<string, any>,
    );
  },

  /**
   * Create a new property request
   */
  async create(data: CreatePropertyRequestData) {
    return api.post<PropertyRequest>(BASE_PATH, data);
  },

  /**
   * Update an existing property request
   */
  async update(id: number, data: Partial<CreatePropertyRequestData>) {
    return api.post<PropertyRequest>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Delete a property request
   */
  async delete(id: number) {
    return api.del(`${BASE_PATH}/${id}`);
  },

  /**
   * Perform an action on a property request (update/close)
   */
  async performAction(id: number, data: RequestActionData) {
    return api.post<PropertyRequest>(`${BASE_PATH}/${id}/action`, data);
  },
};
