"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  UpdateFcmTokenRequest,
} from "../types/auth.types";
import {
  setToken,
  removeToken,
  saveRefreshToken,
  clearRefreshToken,
} from "@/services";

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data) => {
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;

      // Store access token in httpOnly cookie
      if (accessToken) {
        await setToken(accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
        }
      }

      // Store refresh token (30-day lifetime)
      if (refreshToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("refresh_token", refreshToken);
        }
        await saveRefreshToken(refreshToken);
      }

      // Store user in localStorage for quick access
      if (data?.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: async (data) => {
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;

      if (accessToken) {
        await setToken(accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
        }
      }

      if (refreshToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("refresh_token", refreshToken);
        }
        await saveRefreshToken(refreshToken);
      }

      // Store user in localStorage if provided
      if (data?.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

/**
 * Hook for forgot password request
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
}

/**
 * Hook for OTP verification
 */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
  });
}

/**
 * Hook for password reset
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // Remove both tokens from httpOnly cookies
      await removeToken();
      await clearRefreshToken();

      // Clear all cached data
      queryClient.clear();

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
    },
    onError: async () => {
      // Even on error, clear local state for security
      await removeToken();
      await clearRefreshToken();

      queryClient.clear();

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
    },
  });
}

/**
 * Hook for updating FCM token
 */
export function useUpdateFcmToken() {
  return useMutation({
    mutationFn: (data: UpdateFcmTokenRequest) =>
      authService.updateFcmToken(data),
  });
}
