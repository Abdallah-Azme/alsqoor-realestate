// Advertisement feature types
// Aligned with POST /properties/add API endpoint

// ============= API-aligned Enums =============

// Operation type: sale or rent (maps to API operation_type)
export type AdType = "sale" | "rent";

// Finishing type (maps to API finishing_type)
export type FinishingType =
  | "none"
  | "basic"
  | "good"
  | "luxury"
  | "super_luxury";

// Property use (maps to API property_use)
export type PropertyUse =
  | "apartment"
  | "villa"
  | "land_residential"
  | "land_commercial"
  | "commercial_shop"
  | "office"
  | "warehouse"
  | "building"
  | "farm"
  | "factory"
  | "other";

// Facade direction (maps to API facade)
export type Facade =
  | "north"
  | "south"
  | "east"
  | "west"
  | "north_east"
  | "north_west"
  | "south_east"
  | "south_west"
  | "multiple"
  | "unknown";

// Marketing option (maps to API marketing_option)
export type MarketingOption = "none" | "advertising" | "agent";

// ============= Legacy aliases (for backward compatibility) =============
export type PropertyType = PropertyUse;
export type RentPeriod = "daily" | "monthly" | "yearly";
export type HousingType = "families" | "singles" | "both";
export type StreetFacing = Facade;
export type PropertyUsage =
  | "residential"
  | "commercial"
  | "industrial"
  | "agricultural";
export type PropertyAmenity = string; // Now dynamic from API
export type ContactMethod = "phone" | "whatsapp" | "chat";

export type AdStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "expired"
  | "sold"
  | "hidden"
  | "unlicensed";

// ============= Interfaces =============

export interface Advertisement {
  id: number;
  title: string;
  slug: string;
  description: string;
  operationType: AdType;
  priceMin: string;
  priceMax: string;
  pricePerMeter: string;
  priceHidden: boolean;
  currency: string;
  area: string;
  usableArea: string;
  rooms: number | null;
  bathrooms: number;
  balconies: number;
  garages: number;
  finishingType: FinishingType;
  propertyUse: PropertyUse;
  facade: Facade;
  propertyAge: number;
  services: string[];
  obligations: string | null;
  country: string;
  city: string;
  district: string;
  latitude: string;
  longitude: string;
  images: string[];
  videos: string[];
  status: AdStatus;
  isFeatured: boolean;
  viewsCount: number;
  postedAt: string;
  soldAt: string | null;
  isDeal: boolean;
  createdAt: string;
  updatedAt: string;
  adNumber: string | null;
  licenseNumber: string | null;
  licenseExpiryDate: string | null;
  qrCode: string | null;
  planNumber: string;
  guarantees: string;
  plotNumber: string;
  areaName: string;
  hasMortgage: boolean;
  hasRestriction: boolean;
  marketingOption: MarketingOption;
  amenities: string[];
}

// Form data for creating advertisement (multi-step wizard)
// Maps to POST /properties/add FormData fields
export interface CreateAdvertisementData {
  // Step 1: License check (UI only)
  hasLicense: boolean;

  // Step 2: Property type & category
  category_id: number | string;
  operation_type: AdType;
  property_use: PropertyUse;

  // Step 3: Location
  country_id: number | string;
  city_id: number | string;
  district: string;
  latitude?: string;
  longitude?: string;

  // Step 4: Details
  title: string;
  description: string;
  area: string;
  usable_area?: string;
  rooms?: string;
  bathrooms?: string;
  balconies?: string;
  garages?: string;
  finishing_type: FinishingType;
  property_age?: string;
  facade?: Facade;
  price_min: string;
  price_max: string;
  price_per_meter?: string;
  price_hidden?: boolean;
  amenity_ids: number[];
  services: string[];
  obligations?: string;

  // Step 5: Media
  images: File[];
  videos?: File[];

  // Step 6: Contact (UI only — not sent to API)
  contactMethods: ContactMethod[];

  // Step 7: Authority / Legal
  license_number?: string;
  license_expiry_date?: string;
  qr_code?: File;
  plan_number?: string;
  plot_number?: string;
  area_name?: string;
  has_mortgage?: boolean;
  has_restriction?: boolean;
  guarantees?: string;
  marketing_option: MarketingOption;
  is_featured?: boolean;
}

// Step configuration
export type AdvertisementStep =
  | "intro"
  | "license"
  | "property_type"
  | "location"
  | "details"
  | "media"
  | "contact"
  | "authority"
  | "preview";

export interface AdvertisementFilters {
  page?: number;
  perPage?: number;
  status?: AdStatus;
  propertyType?: PropertyUse;
  adType?: AdType;
  city?: string;
}

export interface AdvertisementsResponse {
  success: boolean;
  data: Advertisement[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
