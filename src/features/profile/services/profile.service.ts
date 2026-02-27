import { api } from "@/lib/api-client";
import {
  ProfileData,
  UpdateProfileRequest,
  TransactionsResponse,
  StatisticsResponse,
  ChangeRoleRequest,
} from "../types/profile.types";

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
      avatar: data.avatarUrl || data.avatar,
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

  /**
   * Get user transactions
   */
  async getTransactions(page: number = 1): Promise<TransactionsResponse> {
    return api.get<TransactionsResponse>("/user/transactions", { page });
  },

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<StatisticsResponse> {
    return api.get<StatisticsResponse>("/user/statistics");
  },

  /**
   * Change user role
   */
  async changeRole(data: ChangeRoleRequest) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });
    return api.post("/users/change-role", formData);
  },
};
