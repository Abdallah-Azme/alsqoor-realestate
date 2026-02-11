// Type definitions for the application

export interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  pointsBalance?: number;
  totalPointsEarned?: number;
  totalPointsUsed?: number;
  verificationCode?: string | null;
  mobileVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Computed/Mapped fields for UI
  rating?: number;
  reviews_count?: number;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
  status?: boolean;
  unauthorized?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  location?: string;
  images?: string[];
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  [key: string]: any;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  image?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  [key: string]: any;
}

export interface Deal {
  id: number;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  [key: string]: any;
}

export interface Settings {
  contactInfo?: {
    sitePhone?: string;
    email?: string;
    address?: string;
  };
  [key: string]: any;
}
