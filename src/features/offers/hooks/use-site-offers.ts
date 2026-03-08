import { useQuery } from "@tanstack/react-query";
import { siteOffersService } from "../services/site-offers.service";

export const siteOfferKeys = {
  all: (params?: { search?: string }) => ["site-offers", params] as const,
  single: (id: string | number) => ["site-offers", id] as const,
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
