// Advertisement feature types

export type PropertyType =
  | "villa"
  | "residential_land"
  | "commercial_land"
  | "apartment"
  | "floor"
  | "shop"
  | "building"
  | "warehouse"
  | "rest_house"
  | "farm";

export type AdType = "sale" | "rent";

export type RentPeriod = "daily" | "monthly" | "yearly";

export type HousingType = "families" | "singles" | "both";

export type StreetFacing =
  | "north"
  | "south"
  | "east"
  | "west"
  | "northeast"
  | "northwest"
  | "southeast"
  | "southwest";

export type PropertyUsage =
  | "residential"
  | "commercial"
  | "industrial"
  | "agricultural";

export type PropertyAmenity =
  | "parking"
  | "elevator"
  | "security"
  | "pool"
  | "gym"
  | "garden"
  | "central_ac"
  | "furnished"
  | "kitchen"
  | "maid_room"
  | "driver_room"
  | "basement";

export type ContactMethod = "phone" | "whatsapp" | "chat";

export type AdStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "expired";

export interface Advertisement {
  id: number;

  // License info
  hasLicense: boolean;
  licenseNumber?: string;
  advertiserId?: string;
  advertiserIdType?: string;

  // Property details
  propertyType: PropertyType;
  adType: AdType;
  rentPeriod?: RentPeriod;
  housingType?: HousingType;

  // Location
  city: string;
  neighborhood: string;

  // Measurements & Pricing
  area: number;
  totalPrice: number;
  pricePerMeter?: number;

  // Property attributes
  usage: PropertyUsage[];
  amenities: PropertyAmenity[];
  streetWidth?: string;
  streetFacing?: StreetFacing;

  // Additional info
  obligations?: string;
  description: string;
  images: string[];
  videos?: string[];

  // Contact
  contactMethods: ContactMethod[];

  // Broker contract option
  wantsBrokerContract: boolean;

  // Status
  status: AdStatus;
  createdAt: string;
  updatedAt?: string;

  // User info
  userId: number;
}

// Form data for creating advertisement (multi-step)
export interface CreateAdvertisementData {
  // Step 1: License check
  hasLicense: boolean;

  // Step 2: Property type & ad type
  propertyType: PropertyType;
  adType: AdType;
  rentPeriod?: RentPeriod;
  housingType?: HousingType;

  // Step 3: Location
  city: string;
  neighborhood: string;

  // Step 4: Details
  area: string;
  totalPrice: string;
  pricePerMeter?: string;
  usage: PropertyUsage[];
  amenities: PropertyAmenity[];
  streetWidth?: string;
  streetFacing?: StreetFacing;
  obligations?: string;
  description: string;

  // Step 5: Media
  images: File[];
  videos?: File[];

  // Step 6: Contact
  contactMethods: ContactMethod[];

  // Step 7: License registration (if no license)
  licenseNumber?: string;
  advertiserId?: string;
  advertiserIdType?: string;

  // Broker contract option
  wantsBrokerContract: boolean;
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
  propertyType?: PropertyType;
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
