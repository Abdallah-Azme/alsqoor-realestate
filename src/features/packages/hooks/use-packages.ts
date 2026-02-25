"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
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
        window.location.href = data.paymentUrl;
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
