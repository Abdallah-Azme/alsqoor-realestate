"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from "../types/auth.types";
import { setToken, removeToken } from "@/services";

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data) => {
      // Store token in httpOnly cookie if provided
      if (data?.token) {
        await setToken(data.token);
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
      // Some APIs return token on registration, store it if provided
      if (data?.token) {
        await setToken(data.token);
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
      // Remove token from httpOnly cookie
      await removeToken();

      // Clear all cached data
      queryClient.clear();

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    onError: async () => {
      // Even on error, clear local state for security
      await removeToken();

      queryClient.clear();

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
  });
}
