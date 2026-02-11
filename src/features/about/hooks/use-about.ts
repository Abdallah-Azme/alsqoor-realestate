"use client";

import { useQuery } from "@tanstack/react-query";
import { aboutService } from "../services/about.service";

/**
 * Hook to fetch about page data
 */
export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.getAboutData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
