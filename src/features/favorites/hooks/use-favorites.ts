"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "../services/favorites.service";
import { toast } from "sonner"; // Kept for onSuccess toast

// Query keys
export const favoritesKeys = {
  all: ["favorites"] as const,
  list: () => [...favoritesKeys.all, "list"] as const,
  check: (propertyId: number | string) =>
    [...favoritesKeys.all, "check", propertyId] as const,
};

/**
 * Hook to fetch user's favorites
 * Only fetches if user is authenticated
 */
export function useFavorites() {
  // Check if user is authenticated by checking localStorage
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("user");

  return useQuery({
    queryKey: favoritesKeys.list(),
    queryFn: () => favoritesService.getFavorites(),
    enabled: isAuthenticated, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to toggle favorite (add/remove)
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      isFavorited,
    }: {
      propertyId: number | string;
      isFavorited: boolean;
    }) => {
      if (isFavorited) {
        return favoritesService.removeFavorite(propertyId);
      } else {
        return favoritesService.addFavorite(propertyId);
      }
    },
    onSuccess: (response, variables) => {
      // Invalidate favorites list to refetch
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list() });

      // Show success toast
      if (response.message) {
        toast.success(response.message);
      }
    },
  });
}

/**
 * Hook to check if a property is favorited
 * Only fetches if user is authenticated
 */
export function useCheckFavorite(propertyId: number | string) {
  // Check if user is authenticated by checking localStorage
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("user");

  return useQuery({
    queryKey: favoritesKeys.check(propertyId),
    queryFn: () => favoritesService.checkFavorite(propertyId),
    enabled: !!propertyId && isAuthenticated, // Only fetch if user is logged in and propertyId exists
    staleTime: 5 * 60 * 1000,
  });
}
