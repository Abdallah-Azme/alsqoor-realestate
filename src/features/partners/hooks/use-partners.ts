"use client";

import { useQuery } from "@tanstack/react-query";
import { partnersService } from "../services/partners.service";

/**
 * Hook to fetch paginated partners/companies
 */
export function usePartners(page = 1, perPage = 10) {
  return useQuery({
    queryKey: ["partners", page, perPage],
    queryFn: () => partnersService.getAll({ page, per_page: perPage }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single partner/company by ID
 */
export function usePartner(id: string | number) {
  return useQuery({
    queryKey: ["partner", id],
    queryFn: () => partnersService.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
