"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packagesService } from "../services/packages.service";
import { subscriptionsService } from "../services/subscriptions.service";
import { Package, UserActiveSubscriptionData } from "../types/packages.types";
import { toast } from "sonner";

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

/**
 * Hook to subscribe to a package
 */
export function useSubscribeToPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      packageId: string | number;
      paymentMethodId: number;
      period: "monthly" | "yearly";
    }) =>
      subscriptionsService.subscribe(args.packageId, {
        payment_method_id: args.paymentMethodId,
        subscription_period: args.period,
      }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        // Save the internal transactionId so the success page can use it
        // to call /payment/status/:transactionId (not the gateway's paymentId)
        if (data.transactionId) {
          localStorage.setItem(
            "pending_transaction_id",
            String(data.transactionId),
          );
        }
        window.location.href = data.paymentUrl;
      } else {
        // No payment URL means the subscription was successful immediately (e.g., free package)
        if (data.message) {
          toast.success(data.message);
        }
        queryClient.invalidateQueries({ queryKey: ["activeSubscription"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
}

/**
 * Hook to fetch active subscription
 */
export function useActiveSubscription() {
  // Only query if user is logged in
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  return useQuery({
    queryKey: ["activeSubscription"],
    queryFn: () => subscriptionsService.getActiveSubscription(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
}
