import { api } from "@/lib/api-client";
import { SiteOffer } from "../types/offer.types";

export const siteOffersService = {
  getOffers: async (params?: { search?: string }): Promise<any> => {
    return api.get<any>("/offers", { params });
  },
  getOfferById: async (id: number | string): Promise<any> => {
    return api.get<any>(`/offers/${id}`);
  },
};
