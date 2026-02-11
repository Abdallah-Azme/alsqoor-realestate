import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { requestsService } from "../services/requests.service";
import type {
  CreatePropertyRequestData,
  PropertyRequestFilters,
} from "../types/request.types";

// Query keys
const QUERY_KEYS = {
  all: ["property-requests"] as const,
  lists: () => [...QUERY_KEYS.all, "list"] as const,
  list: (filters?: PropertyRequestFilters) =>
    [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...QUERY_KEYS.details(), id] as const,
  myRequests: () => [...QUERY_KEYS.all, "my-requests"] as const,
};

/**
 * Hook to fetch all property requests with filters
 */
export function useRequests(filters?: PropertyRequestFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => requestsService.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single property request
 */
export function useRequest(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => requestsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch current user's requests
 */
export function useMyRequests() {
  return useQuery({
    queryKey: QUERY_KEYS.myRequests(),
    queryFn: () => requestsService.getMyRequests(),
  });
}

/**
 * Hook to create a new property request
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();
  const t = useTranslations("propertyRequestsPage");

  return useMutation({
    mutationFn: (data: CreatePropertyRequestData) =>
      requestsService.create(data),
    onSuccess: () => {
      toast.success(t("messages.create_success"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRequests() });
    },
  });
}

/**
 * Hook to update a property request
 */
export function useUpdateRequest() {
  const queryClient = useQueryClient();
  const t = useTranslations("propertyRequestsPage");

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreatePropertyRequestData>;
    }) => requestsService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success(t("messages.update_success"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRequests() });
    },
  });
}

/**
 * Hook to delete a property request
 */
export function useDeleteRequest() {
  const queryClient = useQueryClient();
  const t = useTranslations("propertyRequestsPage");

  return useMutation({
    mutationFn: (id: number) => requestsService.delete(id),
    onSuccess: () => {
      toast.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRequests() });
    },
  });
}
