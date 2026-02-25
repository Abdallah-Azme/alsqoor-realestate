"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";

/**
 * Hook to fetch available payment methods
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => paymentService.getPaymentMethods(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
