"use client";

import { useQuery } from "@tanstack/react-query";
import { featuredUsersService } from "../services/featured-users.service";

interface UseFeaturedUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
}

/**
 * Hook to fetch featured users with pagination and search
 */
export function useFeaturedUsers(params?: UseFeaturedUsersParams) {
  return useQuery({
    queryKey: ["featured-users", params],
    queryFn: () =>
      featuredUsersService.getAll({
        page: params?.page,
        per_page: params?.perPage,
        search: params?.search,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single featured user by ID
 */
export function useFeaturedUser(id: string | number) {
  return useQuery({
    queryKey: ["featured-user", id],
    queryFn: () => featuredUsersService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
