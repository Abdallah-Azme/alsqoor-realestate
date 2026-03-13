// Property Offer Types
export interface PropertyOffer {
  id: number;
  offerDetails: string;
  status: "pending" | "accepted" | "rejected";
  statusLabel?: string;
  isMyOffer: boolean;
  createdAt: string;
  humanTime?: string;

  // Relations
  property?: {
    id: number;
    title: string;
    slug: string;
    price?: string;
    currency?: string;
    images?: string[];
    transactionType?: string;
    propertyType?: string | null;
    area?: string;
    rooms?: string;
  };

  agent?: {
    id: number;
    name: string;
    phone: string;
    avatarUrl: string | null;
    role: string;
  };

  // Legacy fields (keeping for compatibility if needed elsewhere, but transitioning to what user provided)
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
  price: number;
  validity_days: number;
  is_active: boolean;
  is_approved: boolean;
  whatsapp_number?: string;
  sort_order?: number;
  features: {
    id: number;
    feature: string;
  }[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateSiteOfferInput {
  name: string;
  description: string;
  price: number | string;
  validity_days: number | string;
  is_active?: boolean | number;
  whatsapp_number?: string;
  features?: { feature: string }[];
}
