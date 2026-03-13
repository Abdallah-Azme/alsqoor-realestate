import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyOffersService } from "../services/property-offers.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { SubmitOfferInput } from "@/features/properties/types/property.types";

export const propertyOffersKeys = {
  all: ["propertyOffers"] as const,
  user: ["propertyOffers", "user"] as const,
};

/**
 * Hook to submit a property offer (Start Marketing)
 */
export const useSubmitOfferMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("offers.messages");

  return useMutation({
    mutationFn: (data: SubmitOfferInput) => propertyOffersService.submitOffer(data),
    onSuccess: () => {
      toast.success(t("submit_success") || "Offer submitted successfully");
      queryClient.invalidateQueries({ queryKey: propertyOffersKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("submit_error") ||
          "Failed to submit offer",
      );
    },
  });
};

/**
 * Hook to fetch user's property offers
 */
export const useUserOffers = () => {
  return useQuery({
    queryKey: propertyOffersKeys.user,
    queryFn: () => propertyOffersService.getUserOffers(),
  });
};

/**
 * Hook to accept a property offer
 */
export const useAcceptOfferMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("offers.messages");

  return useMutation({
    mutationFn: (offerId: number | string) =>
      propertyOffersService.acceptOffer(offerId),
    onSuccess: () => {
      toast.success(t("accept_success") || "Offer accepted successfully");
      queryClient.invalidateQueries({ queryKey: propertyOffersKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("accept_error") ||
          "Failed to accept offer",
      );
    },
  });
};

/**
 * Hook to reject a property offer
 */
export const useRejectOfferMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("offers.messages");

  return useMutation({
    mutationFn: (offerId: number | string) =>
      propertyOffersService.rejectOffer(offerId),
    onSuccess: () => {
      toast.success(t("reject_success") || "Offer rejected successfully");
      queryClient.invalidateQueries({ queryKey: propertyOffersKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("reject_error") ||
          "Failed to reject offer",
      );
    },
  });
};
