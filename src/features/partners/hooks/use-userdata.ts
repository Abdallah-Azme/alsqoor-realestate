"use client";

import { useQuery } from "@tanstack/react-query";
import { partnersService } from "../services/partners.service";

/**
 * Hook to fetch user marketed properties
 */
export function useUserMarketedProperties(userId: string | number, page = 1) {
  return useQuery({
    queryKey: ["user-marketed-properties", userId, page],
    queryFn: () => partnersService.getUserMarketedProperties(userId, page),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user properties
 */
export function useUserProperties(userId: string | number, page = 1) {
  return useQuery({
    queryKey: ["user-properties", userId, page],
    queryFn: () => partnersService.getUserProperties(userId, page),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user requests
 */
export function useUserRequests(userId: string | number, page = 1) {
  return useQuery({
    queryKey: ["user-requests", userId, page],
    queryFn: () => partnersService.getUserRequests(userId, page),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
