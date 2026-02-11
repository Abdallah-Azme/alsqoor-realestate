import { api } from "@/lib/api-client";
import { PropertyOffer, SubmitOfferInput } from "../types/offer.types";

export const propertyOffersService = {
  /**
   * Get all user property offers (both sent and received)
   */
  getUserOffers: async (): Promise<PropertyOffer[]> => {
    return api.get<PropertyOffer[]>("/property-offers");
  },

  /**
   * Submit a new offer on a property
   */
  submitOffer: async (data: SubmitOfferInput): Promise<PropertyOffer> => {
    const formData = new FormData();
    formData.append("property_new_id", data.property_new_id.toString());
    formData.append("offer_details", data.offer_details);
    return api.post<PropertyOffer>("/property-offers", formData);
  },

  /**
   * Accept an offer (for property owners)
   */
  acceptOffer: async (offerId: number): Promise<PropertyOffer> => {
    return api.post<PropertyOffer>(`/property-offers/${offerId}/accept`);
  },

  /**
   * Reject an offer (for property owners)
   */
  rejectOffer: async (offerId: number): Promise<PropertyOffer> => {
    return api.post<PropertyOffer>(`/property-offers/${offerId}/reject`);
  },
};
