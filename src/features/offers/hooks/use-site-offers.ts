import { useQuery } from "@tanstack/react-query";
import { siteOffersService } from "../services/site-offers.service";

export const siteOfferKeys = {
  all: ["site-offers"] as const,
  single: (id: string | number) => ["site-offers", id] as const,
};

export const useSiteOffers = () => {
  return useQuery({
    queryKey: siteOfferKeys.all,
    queryFn: siteOffersService.getOffers,
  });
};

export const useSiteOffer = (id: string | number) => {
  return useQuery({
    queryKey: siteOfferKeys.single(id),
    queryFn: () => siteOffersService.getOfferById(id),
    enabled: !!id,
  });
};
