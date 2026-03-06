import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { directDealsService } from "../services/direct-deals.service";
import { DirectDealFormValues } from "../types";

export const directDealsKeys = {
  all: ["direct-deals"] as const,
  lists: (params?: any) => [...directDealsKeys.all, "list", params] as const,
};

export function useDirectDeals(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: directDealsKeys.lists(params),
    queryFn: () => directDealsService.getAll(params),
  });
}

export function useCreateDirectDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DirectDealFormValues) => directDealsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: directDealsKeys.all });
    },
  });
}

export function useUpdateDirectDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: DirectDealFormValues;
    }) => directDealsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: directDealsKeys.all });
    },
  });
}
