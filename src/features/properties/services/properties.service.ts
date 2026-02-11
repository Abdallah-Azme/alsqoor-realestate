import { api } from "@/lib/api-client";
import {
  Property,
  PropertyStatus,
  BrokerProperty,
  Amenity,
  PropertyFormInput,
  ConvertToAdvertisementInput,
} from "../types/property.types";

const BASE_PATH = "/properties";

/**
 * Helper function to convert PropertyFormInput to FormData
 */
function propertyToFormData(data: Partial<PropertyFormInput>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Handle arrays
    if (Array.isArray(value)) {
      if (key === "images" || key === "videos") {
        // File arrays
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append(`${key}[]`, file);
          }
        });
      } else if (key === "amenity_ids" || key === "services") {
        // Regular arrays
        value.forEach((item) => {
          formData.append(`${key}[]`, String(item));
        });
      }
    }
    // Handle single file
    else if (value instanceof File) {
      formData.append(key, value);
    }
    // Handle booleans
    else if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
    }
    // Handle everything else
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Properties service - functions for properties API operations
 */
export const propertiesService = {
  /**
   * Get all properties with optional pagination and filters
   */
  async getAll(params?: Record<string, any>) {
    return api.get<Property[]>(BASE_PATH, params);
  },

  /**
   * Get a single property by ID
   */
  async getById(id: string | number) {
    return api.get<Property>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get featured properties
   */
  async getFeaturedProperties() {
    return api.get<Property[]>(`${BASE_PATH}/featured`);
  },

  /**
   * Get similar properties for a given property slug
   */
  async getSimilar(slug: string) {
    return api.get<Property[]>(`${BASE_PATH}/${slug}/similar`);
  },

  /**
   * Get property by slug
   */
  async getBySlug(slug: string) {
    return api.get<Property>(`${BASE_PATH}/${slug}`);
  },

  /**
   * Get owner's single property (authenticated)
   */
  async getOwnerProperty() {
    return api.get<Property>(`${BASE_PATH}/owner-property`);
  },

  /**
   * Get all amenities
   */
  async getAmenities() {
    return api.get<Amenity[]>("/amenities");
  },

  /**
   * Get user's properties (authenticated)
   */
  async getUserProperties(params?: { page?: number; per_page?: number }) {
    return api.get<Property[]>("/user/properties", params);
  },

  /**
   * Add a new property (requires authentication)
   */
  async addProperty(data: Partial<PropertyFormInput>) {
    const formData = propertyToFormData(data);
    return api.post<Property>(`${BASE_PATH}/add`, formData);
  },

  /**
   * Update an existing property (requires authentication)
   */
  async updateProperty(id: number, data: Partial<PropertyFormInput>) {
    const formData = propertyToFormData(data);
    return api.post<Property>(`${BASE_PATH}/update/${id}`, formData);
  },

  /**
   * Convert property to advertisement (requires authentication)
   */
  async convertToAdvertisement(
    propertyId: number,
    data: Partial<ConvertToAdvertisementInput>,
  ) {
    const formData = propertyToFormData(data as any);
    return api.post<Property>(`${BASE_PATH}/${propertyId}/convert`, formData);
  },

  /**
   * Reactivate a property (requires authentication)
   */
  async reactivateProperty(propertyId: number) {
    return api.post<Property>(`${BASE_PATH}/${propertyId}/reactivate`, {});
  },

  /**
   * Delete a property (requires authentication)
   */
  async deleteProperty(propertyId: number) {
    return api.del(`${BASE_PATH}/${propertyId}`);
  },

  // ============= Broker Properties Methods =============

  /**
   * Get broker properties by status
   */
  async getByStatus(
    status: PropertyStatus,
    params?: { page?: number; per_page?: number },
  ) {
    return api.get<BrokerProperty[]>(`${BASE_PATH}/broker`, {
      ...params,
      status,
    });
  },

  /**
   * Get all broker properties grouped by status (counts)
   */
  async getBrokerPropertiesCounts() {
    return api.get<{
      new: number;
      marketing: number;
      sold: number;
      deleted: number;
      total: number;
    }>(`${BASE_PATH}/broker/counts`);
  },

  /**
   * Start marketing a property (broker only)
   */
  async startMarketing(propertyId: number) {
    return api.post<BrokerProperty>(
      `${BASE_PATH}/${propertyId}/start-marketing`,
      {},
    );
  },

  /**
   * Update property status
   */
  async updateStatus(propertyId: number, status: PropertyStatus) {
    return api.put<BrokerProperty>(`${BASE_PATH}/${propertyId}/status`, {
      status,
    });
  },

  /**
   * Mark property as sold (close deal)
   */
  async markAsSold(
    propertyId: number,
    dealDetails?: { commission?: number; notes?: string },
  ) {
    return api.post<BrokerProperty>(
      `${BASE_PATH}/${propertyId}/close-deal`,
      dealDetails || {},
    );
  },
};
