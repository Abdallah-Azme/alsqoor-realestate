"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewsService } from "../services/reviews.service";

/**
 * Hook to fetch all reviews/testimonials
 */
export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewsService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
