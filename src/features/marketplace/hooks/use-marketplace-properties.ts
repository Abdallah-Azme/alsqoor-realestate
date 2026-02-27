import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { propertiesService } from "@/features/properties/services/properties.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  MarketplaceData,
  Property,
} from "@/features/properties/types/property.types";

export const marketplaceKeys = {
  all: ["marketplaceProperties"] as const,
  single: (slug: string) => ["realEstateProperty", slug] as const,
  user: ["realEstateProperties", "user"] as const,
};

/**
 * Hook to fetch marketplace properties (new)
 */
export const useMarketplaceProperties = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...marketplaceKeys.all, params],
    queryFn: () => propertiesService.getMarketplaceProperties(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a real estate property by slug (new)
 */
export const useRealEstateBySlug = (slug: string) => {
  return useQuery({
    queryKey: marketplaceKeys.single(slug),
    queryFn: () => propertiesService.getRealEstateBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to add a new marketplace property (owner/agent)
 */
export const useAddMarketplacePropertyMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: (data: FormData) =>
      propertiesService.addMarketplaceProperty(data),
    onSuccess: () => {
      toast.success(t("success_add_property") || "Property added successfully");
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.user });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("error_add_property") ||
          "Failed to add property",
      );
    },
  });
};

/**
 * Hook to add a new developer property
 */
export const useAddDeveloperPropertyMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: (data: FormData) =>
      propertiesService.addDeveloperProperty(data),
    onSuccess: () => {
      toast.success(t("success_add_property") || "Property added successfully");
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.user });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("error_add_property") ||
          "Failed to add property",
      );
    },
  });
};
/**
 * Hook to update an existing real estate property
 */
export const useUpdateRealEstateProperty = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      propertiesService.updateRealEstateProperty(id, data),
    onSuccess: (_, variables) => {
      toast.success(
        t("success_update_property") || "Property updated successfully",
      );
      queryClient.invalidateQueries({
        queryKey: marketplaceKeys.single(variables.id.toString()),
      });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.user });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("error_update_property") ||
          "Failed to update property",
      );
    },
  });
};
