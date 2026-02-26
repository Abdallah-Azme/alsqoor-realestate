import { api } from "@/lib/api-client";
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from "../types/auth.types";

const BASE_PATH = "/auth";

/**
 * Auth service - functions for authentication API operations
 *
 * All methods return clean data directly and throw ApiError on failure.
 * The hooks no longer need to check `response.success`.
 */
export const authService = {
  /**
   * Login user — returns { token, user }
   */
  async login(credentials: LoginRequest) {
    return api.post<{ token: string; user: any }>(
      `${BASE_PATH}/login`,
      credentials,
    );
  },

  /**
   * Register new user — returns { token, user }
   */
  async register(userData: RegisterRequest) {
    return api.post<{ token: string; user: any }>(
      `${BASE_PATH}/register`,
      userData,
    );
  },

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest) {
    return api.post(`${BASE_PATH}/forgot-password`, data);
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest) {
    return api.post(`${BASE_PATH}/verify-otp`, data);
  },

  /**
   * Reset password with code
   */
  async resetPassword(data: ResetPasswordRequest) {
    return api.post(`${BASE_PATH}/reset-password`, data);
  },

  /**
   * Logout user
   */
  async logout() {
    return api.post("/logout", {});
  },

  /**
   * Update FCM token for notifications
   */
  async updateFcmToken(data: { fcm_token: string }) {
    return api.post("/fcm-token", data);
  },
};
