// Property/Estate feature types

// ============= Enums =============

// Property status for broker classification
export type PropertyStatus = "new" | "marketing" | "sold" | "deleted";

// Operation type: sale or rent
export type OperationType = "sale" | "rent";

// Finishing type
export type FinishingType =
  | "none"
  | "basic"
  | "good"
  | "luxury"
  | "super_luxury";

// Property use/type
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

// Facade direction
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

// Marketing option
export type MarketingOption = "none" | "advertising" | "agent";

// Obligations
export type Obligations = "yes" | "no";

// ============= Interfaces =============

// Amenity
export interface Amenity {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  icon?: string;
}

// Country
export interface Country {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  code?: string;
}

// City
export interface City {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  country_id: number;
}

// Category
export interface PropertyCategory {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
}

// Main Property interface
export interface Property {
  // Basic info
  id: number;
  title: string;
  description?: string;
  slug?: string;

  // Location
  country_id?: number;
  city_id?: number;
  district?: string;
  latitude?: number;
  longitude?: number;
  location?: string; // Formatted location string

  // Category & operation
  category_id?: number;
  operation_type?: OperationType;

  // Pricing
  price?: number; // For backward compatibility
  price_min?: number;
  price_max?: number;
  price_hidden?: boolean;
  price_per_meter?: number;

  // Dimensions
  area?: number;
  usable_area?: number;
  rooms?: number;
  bedrooms?: number; // Alias for rooms
  bathrooms?: number;
  balconies?: number;
  garages?: number;

  // Property details
  finishing_type?: FinishingType;
  property_use?: PropertyUse;
  facade?: Facade;
  property_age?: number;

  // Services & amenities
  services?: string[];
  amenities?: Amenity[];
  amenity_ids?: number[];

  // Legal & documentation
  obligations?: Obligations;
  license_number?: string;
  license_expiry_date?: string;
  plan_number?: string;
  plot_number?: string;
  area_name?: string;

  // Financial
  has_mortgage?: boolean;
  has_restriction?: boolean;
  guarantees?: string;

  // Media
  images?: string[];
  videos?: string[];
  qr_code?: string;

  // Marketing
  is_featured?: boolean;
  marketing_option?: MarketingOption;

  // Broker properties
  status?: PropertyStatus;
  owner_id?: number;
  broker_id?: number;
  is_marketing_enabled?: boolean;

  // Relations
  country?: Country;
  city?: City;
  category?: PropertyCategory;
  owner?: any; // User type
  broker?: any; // User type

  // Timestamps
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  // Allow additional fields
  [key: string]: any;
}

// Broker property with additional fields
export interface BrokerProperty extends Property {
  status: PropertyStatus;
  broker_id: number;
  marketing_start_date?: string;
  marketing_end_date?: string;
  deal_closed_date?: string;
  commission?: number;
}

// Property filters for API queries
export interface PropertyFilters {
  page?: number;
  per_page?: number;

  // Search
  search?: string;

  // Location
  country_id?: number;
  city_id?: number;
  district?: string;

  // Category & operation
  category_id?: number;
  operation_type?: OperationType;

  // Pricing
  min_price?: number;
  max_price?: number;

  // Dimensions
  min_area?: number;
  max_area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;

  // Property details
  finishing_type?: FinishingType;
  property_use?: PropertyUse;
  facade?: Facade;

  // Features
  has_mortgage?: boolean;
  has_restriction?: boolean;
  is_featured?: boolean;

  // Broker filters
  status?: PropertyStatus;

  // Allow additional filters
  [key: string]: any;
}

// Property form data for add/update operations
export interface PropertyFormInput {
  // Basic info
  title: string;
  description?: string;

  // Location
  country_id: number;
  city_id: number;
  district: string;
  latitude?: number;
  longitude?: number;

  // Category & operation
  category_id: number;
  operation_type: OperationType;

  // Pricing
  price_min: number;
  price_max: number;
  price_hidden?: boolean;
  price_per_meter?: number;

  // Dimensions
  area: number;
  usable_area?: number;
  rooms: number;
  bathrooms: number;
  balconies?: number;
  garages?: number;

  // Property details
  finishing_type: FinishingType;
  property_use: PropertyUse;
  facade?: Facade;
  property_age?: number;

  // Services & amenities
  services?: string[];
  amenity_ids?: number[];

  // Legal & documentation
  obligations?: Obligations;
  license_number?: string;
  license_expiry_date?: string;
  plan_number?: string;
  plot_number?: string;
  area_name?: string;

  // Financial
  has_mortgage?: boolean;
  has_restriction?: boolean;
  guarantees?: string;

  // Media (File objects for upload)
  images?: File[];
  videos?: File[];
  qr_code?: File;

  // Marketing
  is_featured?: boolean;
  marketing_option?: MarketingOption;
}

// Convert to advertisement input
export interface ConvertToAdvertisementInput {
  license_number: string;
  license_expiry_date: string;
  qr_code: File;
  category_id: number;
  operation_type: OperationType;
  usable_area?: number;
  bathrooms?: number;
  balconies?: number;
  garages?: number;
  finishing_type?: FinishingType;
  property_use?: PropertyUse;
  facade?: Facade;
  property_age?: number;
  services?: string[];
  plan_number?: string;
  plot_number?: string;
  area_name?: string;
  has_mortgage?: boolean;
  has_restriction?: boolean;
  guarantees?: string;
  price_per_meter?: number;
  images?: File[];
  videos?: File[];
  amenity_ids?: number[];
  is_featured?: boolean;
  marketing_option?: MarketingOption;
}

// ============= Marketplace Types =============

export interface MarketplaceProperty {
  id: number;
  title: string;
  slug: string;
  description: string;
  propertyType: string | null;
  area: string;
  rooms: number | null;
  price: number | null;
  currency: string;
  status: string;
  transactionType: string | null;
  commissionPercentage: string | null;
  commissionFrom: string | null;
  isVerified: boolean;
  offersCount: number;
  startingPrice: string | null;
  totalUnits: number | null;
  isApproved: boolean;
  views: number;
  image: string | null;
  createdAt: string;
  isConverted: boolean;
  // Additional fields that might be useful or present in other contexts
  developerName?: string;
  developerLogo?: string;
  availableUnits?: number;
  brokerCommission?: number;
  isBrokerOpportunity?: boolean;
  location?: string;
  city?: string;
  timePosted?: string;
}

export interface MarketplaceData {
  data: MarketplaceProperty[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface MarketplaceResponse {
  success: boolean;
  message: string;
  data: MarketplaceData;
}

// ============= User Properties Response =============

export interface UserPropertiesData {
  data: Property[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface UserPropertiesResponse {
  success: boolean;
  message: string;
  data: UserPropertiesData;
}
