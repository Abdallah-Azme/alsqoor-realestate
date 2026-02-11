import { api } from "@/lib/api-client";
import {
  Advertisement,
  AdvertisementFilters,
  AdvertisementsResponse,
  AdStatus,
} from "../types/advertisement.types";

const BASE_PATH = "/advertisements";

/**
 * Advertisements service - functions for advertisements API operations
 */
export const advertisementsService = {
  /**
   * Get all advertisements with optional filters
   */
  async getAll(filters?: AdvertisementFilters) {
    return api.get<AdvertisementsResponse>(
      BASE_PATH,
      filters as Record<string, any>,
    );
  },

  /**
   * Get user's own advertisements
   */
  async getMyAds(filters?: AdvertisementFilters) {
    return api.get<AdvertisementsResponse>(
      `${BASE_PATH}/my-ads`,
      filters as Record<string, any>,
    );
  },

  /**
   * Get a single advertisement by ID
   */
  async getById(id: number) {
    return api.get<Advertisement>(`${BASE_PATH}/${id}`);
  },

  /**
   * Create a new advertisement
   */
  async create(data: FormData) {
    return api.post<Advertisement>(BASE_PATH, data);
  },

  /**
   * Update an advertisement
   */
  async update(id: number, data: FormData) {
    return api.put<Advertisement>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Delete an advertisement
   */
  async delete(id: number) {
    return api.del(`${BASE_PATH}/${id}`);
  },

  /**
   * Update advertisement status
   */
  async updateStatus(id: number, status: AdStatus) {
    return api.put<Advertisement>(`${BASE_PATH}/${id}/status`, { status });
  },

  /**
   * Upload advertisement images
   */
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    return api.post<string[]>(`${BASE_PATH}/upload-images`, formData);
  },

  /**
   * Get cities list
   */
  async getCities() {
    return api.get<{ id: number; name: string }[]>("/cities");
  },

  /**
   * Get neighborhoods by city
   */
  async getNeighborhoods(cityId: number) {
    return api.get<{ id: number; name: string }[]>(
      `/cities/${cityId}/neighborhoods`,
    );
  },

  /**
   * Request broker contract
   */
  async requestBrokerContract(advertisementId: number, brokerId?: number) {
    return api.post(`${BASE_PATH}/${advertisementId}/broker-contract`, {
      brokerId,
    });
  },
};
