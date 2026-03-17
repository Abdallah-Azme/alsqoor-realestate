// Partner/Company feature types

export interface Partner {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  [key: string]: any;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  whatsapp: string | null;
  backupMobile: string | null;
  role: string;
  agentType: "individual" | "office";
  companyName: string | null;
  falNumber: string | null;
  falExpiryDate: string | null;
  falLicenseStatus: "valid" | "expired" | null;
  falLicenseDocument: string;
  commercialRegister: string | null;
  hasFALLicense: boolean;
  hasADLicense: boolean;
  mobileVerified: boolean;
  avatarUrl: string;
  companyLogoUrl: string;
  createdAt: string;
  updatedAt: string;
}
export interface UserDataProperty {
  id: number;
  title: string;
  slug: string;
  description: string;
  propertyType: string | null;
  area: string;
  buildingArea: string | null;
  rooms: string;
  price: string;
  currency: string;
  status: string;
  transactionType: string;
  commissionPercentage: string;
  commissionFrom: string | null;
  isVerified: boolean;
  offersCount: number;
  startingPrice: string | null;
  totalUnits: number | null;
  isApproved: boolean;
  isActive: boolean;
  views: number;
  images: any[];
  videos: any[];
  createdAt: string;
  isConverted: boolean;
  propertyUse: string | null;
  services: string | null;
  facade: string | null;
  streetWidth: string | null;
  hasObligations: boolean;
  latitude: string;
  longitude: string;
  country: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}

export interface UserDataRequest {
  id: number;
  requestNumber: string;
  requestType: string;
  requestTypeLabel: string;
  area: string;
  propertyAge: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  details: string;
  offer: string;
  budgetType: string;
  budgetTypeLabel: string;
  budgetAmount: string;
  status: string;
  statusLabel: string;
  urgentExpiresAt: string | null;
  district: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  country: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserDataResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
