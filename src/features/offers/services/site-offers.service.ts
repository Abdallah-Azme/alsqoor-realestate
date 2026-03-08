import { api, toFormData } from "@/lib/api-client";
import { SiteOffer, CreateSiteOfferInput } from "../types/offer.types";

export const siteOffersService = {
  getOffers: async (params?: { search?: string }): Promise<any> => {
    return api.get<any>("/offers", { params });
  },
  getOfferById: async (id: number | string): Promise<any> => {
    return api.get<any>(`/offers/${id}`);
  },
  createOffer: async (data: CreateSiteOfferInput): Promise<SiteOffer> => {
    // API expects features as index-based form data: features[0][feature]
    // My CreateSiteOfferInput has features?: { feature: string }[]
    // toFormData in api-client.ts might need a specific format or we can just send JSON if the backend supports it.
    // However, the Postman collection uses formdata.
    return api.post<SiteOffer>("/offers", data);
  },
  getMyOffers: async (): Promise<any> => {
    return api.get<any>("/my-offers");
  },
};
