import { Property } from "@/features/properties/types/property.types";

export interface Favorite {
  id: number;
  createdAt: string;
  updatedAt: string;
  property: FavoriteProperty;
}

export interface FavoriteProperty extends Property {
  first_image: string;
  images: string[];
  videos: string[];
  status: string;
  isFeatured: boolean;
  viewsCount: number;
  postedAt: string;
  sold_at: string | null;
  isDeal: boolean;
  category: string;
  amenities: string[];
  averageRating: string;
  totalReviews: number;
  isSold: boolean;
}

export interface FavoritesResponse {
  success: boolean;
  message: string;
  data: Favorite[];
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  data?: any;
}
