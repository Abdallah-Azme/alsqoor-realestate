import { api } from "@/lib/api-client";
import {
  OwnerRegistrationRequest,
  AgentRegistrationRequest,
  DeveloperRegistrationRequest,
  SeekerRegistrationRequest,
} from "../types/auth.types";

/**
 * Convert a plain object to FormData
 */
function objectToFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
}

/**
 * Registration service - functions for role-specific registration API operations
 *
 * All methods send FormData and return clean data directly.
 * Throws ApiError on failure.
 */
export const registrationService = {
  /**
   * Register owner user
   */
  async registerOwner(data: OwnerRegistrationRequest) {
    return api.post("/register", objectToFormData(data as Record<string, any>));
  },

  /**
   * Register agent user
   */
  async registerAgent(data: AgentRegistrationRequest) {
    return api.post("/register", objectToFormData(data as Record<string, any>));
  },

  /**
   * Register developer user
   */
  async registerDeveloper(data: DeveloperRegistrationRequest) {
    return api.post("/register", objectToFormData(data as Record<string, any>));
  },

  /**
   * Register seeker user
   */
  async registerSeeker(data: SeekerRegistrationRequest) {
    return api.post("/register", objectToFormData(data as Record<string, any>));
  },
};
