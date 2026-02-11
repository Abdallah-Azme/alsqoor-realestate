"use client";

import { useQuery } from "@tanstack/react-query";
import { packagesService } from "../services/packages.service";
import { Package } from "../types/packages.types";

/**
 * Hook to fetch all packages
 */
export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: () => packagesService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single package by ID
 */
export function usePackage(id: number) {
  const { data: packages, ...rest } = usePackages();

  return {
    ...rest,
    data:
      (packages as Package[] | undefined)?.find((pkg) => pkg.id === id) || null,
  };
}
