"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesService } from "../services/properties.service";
import {
  Property,
  PropertyFilters,
  PropertyFormInput,
  ConvertToAdvertisementInput,
} from "../types/property.types";

/**
 * Hook to fetch paginated properties with filters
 */
export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertiesService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch a single property by ID
 */
export function useProperty(id: string | number) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => propertiesService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a property by slug
 */
export function usePropertyBySlug(slug: string) {
  return useQuery({
    queryKey: ["property", "slug", slug],
    queryFn: () => propertiesService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch featured properties
 */
export function useFeaturedProperties() {
  return useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => propertiesService.getFeaturedProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch similar properties
 */
export function useSimilarProperties(slug: string) {
  return useQuery({
    queryKey: ["properties", "similar", slug],
    queryFn: () => propertiesService.getSimilar(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch owner's property
 * Only fetches if user is authenticated
 */
export function useOwnerProperty() {
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("user");

  return useQuery({
    queryKey: ["property", "owner"],
    queryFn: () => propertiesService.getOwnerProperty(),
    enabled: isAuthenticated, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all amenities
 */
export function useAmenities() {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: () => propertiesService.getAmenities(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch user's properties
 * Only fetches if user is authenticated
 */
export function useUserProperties(params?: {
  page?: number;
  per_page?: number;
}) {
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("user");

  return useQuery({
    queryKey: ["properties", "user", params],
    queryFn: () => propertiesService.getUserProperties(params),
    enabled: isAuthenticated, // Only fetch if user is logged in
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PropertyFormInput>) =>
      propertiesService.addProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "user"] });
    },
  });
}

/**
 * Hook to update a property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PropertyFormInput>;
    }) => propertiesService.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "user"] });
    },
  });
}

/**
 * Hook to convert property to advertisement
 */
export function useConvertToAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      data,
    }: {
      propertyId: number;
      data: Partial<ConvertToAdvertisementInput>;
    }) => propertiesService.convertToAdvertisement(propertyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["property", variables.propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "user"] });
    },
  });
}

/**
 * Hook to reactivate a property
 */
export function useReactivateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) =>
      propertiesService.reactivateProperty(propertyId),
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "user"] });
    },
  });
}

/**
 * Hook to delete a property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) =>
      propertiesService.deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "user"] });
    },
  });
}
