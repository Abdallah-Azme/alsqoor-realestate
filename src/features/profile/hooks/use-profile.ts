"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { UpdateProfileRequest } from "../types/profile.types";

/**
 * Hook to fetch user profile
 * Only fetches if user is authenticated
 */
export function useProfile() {
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("user");

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
    enabled: isAuthenticated, // Only fetch if user is logged in
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
