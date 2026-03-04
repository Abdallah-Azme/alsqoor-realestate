"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService } from "../services/settings.service";

/**
 * Hook to fetch site settings
 * Settings are cached for 1 hour
 */
export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const result = await settingsService.getSettings();

      // Handle the nested response structure from the API
      if (result?.code === 200 || result?.success) {
        // Some endpoints wrap data in another 'data' object
        return result.data?.data || result.data;
      }

      return null;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch the topnav color
 */
export function useTopnavColor() {
  return useQuery({
    queryKey: ["topnav-color"],
    queryFn: () => settingsService.getTopnavColor(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
