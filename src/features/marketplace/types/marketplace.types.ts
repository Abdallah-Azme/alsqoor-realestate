export interface MarketplaceProperty {
  id: string;
  title: string;
  propertyType: string; // apartment, villa, land, building, shop, floor
  operationType: "sale" | "rent";
  price: number;
  formattedPrice: string;
  area: number;
  location: string;
  city: string;
  timePosted: string;
  offersCount: number;
  isVerified: boolean;
  isSubscribersOnly: boolean;
  isUnread: boolean;
}

export interface BrokerProperty extends MarketplaceProperty {
  broker: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    propertiesCount?: number;
  };
}

export interface DeveloperProject {
  id: string;
  name: string;
  developer: {
    id: string;
    name: string;
    logo?: string;
  };
  location: string;
  city: string;
  units: ProjectUnit[];
  totalUnits: number;
  availableUnits: number;
  priceRange: {
    min: number;
    max: number;
  };
  image?: string;
}

export interface ProjectUnit {
  id: string;
  type: string;
  area: number;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  isAvailable: boolean;
}

export type MarketplaceTab = "owners" | "brokers" | "developers";

export interface MarketplaceFilters {
  tab: MarketplaceTab;
  propertyType?: string;
  operationType?: "sale" | "rent";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
  perPage?: number;
}

export type OwnerFilterOption =
  | "all"
  | "unread"
  | "read"
  | "active"
  | "expired";
export type OwnerSortOption =
  | "default"
  | "newest"
  | "oldest"
  | "largest_area"
  | "smallest_area"
  | "highest_price"
  | "lowest_price";
