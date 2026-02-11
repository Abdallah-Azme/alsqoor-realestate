import { api } from "@/lib/api-client";
import { ProfileData, UpdateProfileRequest } from "../types/profile.types";

const BASE_PATH = "/profile";

/**
 * Profile service - functions for profile API operations
 */
export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileData> {
    const data = await api.get<any>(BASE_PATH);
    return {
      ...data,
      phone: data.mobile || data.phone,
      points: data.pointsBalance,
    };
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest) {
    // If avatar is a File, send as FormData; api-client auto-detects
    if (data.avatar instanceof File) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });
      return api.post(BASE_PATH, formData);
    }
    return api.post(BASE_PATH, data);
  },
};
