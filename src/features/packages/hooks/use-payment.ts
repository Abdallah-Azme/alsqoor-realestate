"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";

/**
 * Hook to fetch available payment methods
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      const methods = await paymentService.getPaymentMethods();
      return methods.filter((method) => method.isActive);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to verify payment status
 */
export function useVerifyPayment(paymentId: string | null) {
  return useQuery({
    queryKey: ["verifyPayment", paymentId],
    queryFn: () => paymentService.verifyPayment(paymentId!),
    enabled: !!paymentId,
    retry: 1,
  });
}
