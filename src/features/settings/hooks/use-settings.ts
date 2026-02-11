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
      const response = await settingsService.getSettings();

      // Handle the nested response structure from the API
      if (response?.success && response?.data?.code === 200) {
        return response.data.data;
      }

      return null;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour (formerly cacheTime)
  });
}
