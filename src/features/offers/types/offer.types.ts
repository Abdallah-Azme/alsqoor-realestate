// Property Offer Types
export interface PropertyOffer {
  id: number;
  property_new_id: number;
  offer_details: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;

  // Relations
  property?: {
    id: number;
    title: string;
    slug: string;
    price_min: number;
    price_max: number;
    images?: string[];
    operation_type?: string;
    property_use?: string;
  };

  sender?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };

  receiver?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SubmitOfferInput {
  property_new_id: number;
  offer_details: string;
}

export type OfferStatus = "pending" | "accepted" | "rejected";

export type OfferType = "sent" | "received";

// Legacy offer type (for platform packages/services)
export interface Offer {
  id: number;
  title: string;
  description?: string;
  image?: string;
  discount?: string;
  validUntil?: string;
  [key: string]: any;
}

export interface SiteOffer {
  id: number;
  name: string;
  description: string;
  price: string;
  validityDays: number;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}
