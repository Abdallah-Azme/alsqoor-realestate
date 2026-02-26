import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyOffersService } from "../services/property-offers.service";
import { SubmitOfferInput } from "../types/offer.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Query keys
export const propertyOfferKeys = {
  all: ["property-offers"] as const,
  user: () => [...propertyOfferKeys.all, "user"] as const,
};

// Get user property offers (both sent and received)
// Only fetches if user is authenticated
export const useUserPropertyOffers = () => {
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("user");

  return useQuery({
    queryKey: propertyOfferKeys.user(),
    queryFn: propertyOffersService.getUserOffers,
    enabled: isAuthenticated, // Only fetch if user is logged in
  });
};

// Submit offer mutation
export const useSubmitOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyOffersService.submitOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyOfferKeys.user() });
    },
  });
};

// Accept offer mutation
export const useAcceptOffer = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("offers.messages");

  return useMutation({
    mutationFn: propertyOffersService.acceptOffer,
    onSuccess: () => {
      toast.success(t("accept_success"));
      queryClient.invalidateQueries({ queryKey: propertyOfferKeys.user() });
    },
    onError: () => {
      toast.error(t("accept_error"));
    },
  });
};

// Reject offer mutation
export const useRejectOffer = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("offers.messages");

  return useMutation({
    mutationFn: propertyOffersService.rejectOffer,
    onSuccess: () => {
      toast.success(t("reject_success"));
      queryClient.invalidateQueries({ queryKey: propertyOfferKeys.user() });
    },
    onError: () => {
      toast.error(t("reject_error"));
    },
  });
};
