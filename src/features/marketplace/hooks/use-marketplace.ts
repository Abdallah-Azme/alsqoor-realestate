"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketplaceService } from "../services/marketplace.service";
import {
  MarketplaceProperty,
  BrokerProperty,
  DeveloperProject,
  MarketplaceFilters,
} from "../types/marketplace.types";

/**
 * Hook to fetch owner properties
 */
export function useOwnerProperties(filters?: Partial<MarketplaceFilters>) {
  return useQuery({
    queryKey: ["marketplace", "owners", filters],
    queryFn: () => marketplaceService.getOwnerProperties(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch broker properties
 */
export function useBrokerProperties(filters?: Partial<MarketplaceFilters>) {
  return useQuery({
    queryKey: ["marketplace", "brokers", filters],
    queryFn: () => marketplaceService.getBrokerProperties(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch developer projects
 */
export function useDeveloperProjects(filters?: Partial<MarketplaceFilters>) {
  return useQuery({
    queryKey: ["marketplace", "developers", filters],
    queryFn: () => marketplaceService.getDeveloperProjects(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch a single marketplace property
 */
export function useMarketplaceProperty(id: string) {
  return useQuery({
    queryKey: ["marketplace", "property", id],
    queryFn: () => marketplaceService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to start marketing a property
 */
export function useStartMarketing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      data,
    }: {
      propertyId: string;
      data: { duration: number; package?: string };
    }) => marketplaceService.startMarketing(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}
