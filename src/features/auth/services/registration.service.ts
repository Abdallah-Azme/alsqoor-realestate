import { api, toFormData } from "@/lib/api-client";
import {
  OwnerRegistrationRequest,
  AgentRegistrationRequest,
  DeveloperRegistrationRequest,
  SeekerRegistrationRequest,
} from "../types/auth.types";

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
    return api.post("/register", toFormData(data as Record<string, any>));
  },

  /**
   * Register agent user
   */
  async registerAgent(data: AgentRegistrationRequest) {
    return api.post("/register", toFormData(data as Record<string, any>));
  },

  /**
   * Register developer user
   */
  async registerDeveloper(data: DeveloperRegistrationRequest) {
    return api.post("/register", toFormData(data as Record<string, any>));
  },

  /**
   * Register seeker user
   */
  async registerSeeker(data: SeekerRegistrationRequest) {
    return api.post("/register", toFormData(data as Record<string, any>));
  },
};
