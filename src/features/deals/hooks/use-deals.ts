"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsService } from "../services/deals.service";

/**
 * Hook to fetch paginated deals
 */
export function useDeals(page = 1) {
  return useQuery({
    queryKey: ["deals", page],
    queryFn: () => dealsService.getAll({ page }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => dealsService.addDeal(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

/**
 * Hook to update an existing deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dealId,
      formData,
    }: {
      dealId: string | number;
      formData: FormData;
    }) => dealsService.updateDeal(dealId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}
