"use client";

import { useQuery } from "@tanstack/react-query";
import { serviceDescriptionsService } from "../services/service-descriptions.service";
import { ServiceType } from "../types";

export function useServiceDescriptions() {
  return useQuery({
    queryKey: ["service-descriptions"],
    queryFn: () => serviceDescriptionsService.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useServiceDescription(type: ServiceType) {
  const { data, ...rest } = useServiceDescriptions();
  return {
    description: data ? data[type] : undefined,
    ...rest
  };
}
