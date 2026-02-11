import { useQuery } from "@tanstack/react-query";
import { userGuideService } from "../services/user-guide.service";

export const userGuideKeys = {
  all: ["user-guide"] as const,
  guide: () => [...userGuideKeys.all, "guide"] as const,
};

/**
 * Hook to fetch user guide sections
 */
export function useUserGuide() {
  return useQuery({
    queryKey: userGuideKeys.guide(),
    queryFn: () => userGuideService.getUserGuide(),
    staleTime: 0, // No caching
  });
}
