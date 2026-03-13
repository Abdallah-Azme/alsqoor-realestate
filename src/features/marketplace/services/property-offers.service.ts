import { api } from "@/lib/api-client";
import { PropertyOffer, SubmitOfferInput } from "../../properties/types/property.types";

/**
 * Property Offers service - functions for property offers API operations
 */
export const propertyOffersService = {
  /**
   * Submit an offer for a property
   */
  async submitOffer(data: SubmitOfferInput) {
    return api.post<PropertyOffer>("/property-offers", data);
  },

  /**
   * Get current user's offers
   */
  async getUserOffers() {
    return api.get<PropertyOffer[]>("/property-offers");
  },

  /**
   * Accept an offer (by property owner)
   */
  async acceptOffer(offerId: number | string) {
    return api.post(`/property-offers/${offerId}/accept`, {});
  },

  /**
   * Reject an offer (by property owner)
   */
  async rejectOffer(offerId: number | string) {
    return api.post(`/property-offers/${offerId}/reject`, {});
  },
};
