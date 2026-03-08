import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteOffersService } from "../services/site-offers.service";
import { CreateSiteOfferInput } from "../types/offer.types";

export const siteOfferKeys = {
  all: (params?: { search?: string }) => ["site-offers", params] as const,
  single: (id: string | number) => ["site-offers", id] as const,
  mine: () => ["site-offers", "mine"] as const,
};

export const useSiteOffers = (params?: { search?: string }) => {
  return useQuery({
    queryKey: siteOfferKeys.all(params),
    queryFn: () => siteOffersService.getOffers(params),
  });
};

export const useSiteOffer = (id: string | number) => {
  return useQuery({
    queryKey: siteOfferKeys.single(id),
    queryFn: () => siteOffersService.getOfferById(id),
    enabled: !!id,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSiteOfferInput) =>
      siteOffersService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-offers"] });
    },
  });
};

export const useUserOffers = () => {
  return useQuery({
    queryKey: siteOfferKeys.mine(),
    queryFn: () => siteOffersService.getMyOffers(),
  });
};
