import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyOffersService } from "../services/property-offers.service";
import { SubmitOfferInput } from "../types/offer.types";

// Query keys
export const propertyOfferKeys = {
  all: ["property-offers"] as const,
  user: () => [...propertyOfferKeys.all, "user"] as const,
};

// Get user property offers (both sent and received)
export const useUserPropertyOffers = () => {
  return useQuery({
    queryKey: propertyOfferKeys.user(),
    queryFn: propertyOffersService.getUserOffers,
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

  return useMutation({
    mutationFn: propertyOffersService.acceptOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyOfferKeys.user() });
    },
  });
};

// Reject offer mutation
export const useRejectOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyOffersService.rejectOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyOfferKeys.user() });
    },
  });
};
