"use client";

import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/home.service";

/**
 * Hook to fetch home page data
 */
export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: () => homeService.getHomeData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
