export interface ProfileData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  phone?: string; // Kept for backward compatibility if needed, map mobile to this
  role?: string;
  avatar?: string;
  pointsBalance?: number;
  verificationCode?: string | null;
  mobileVerified?: boolean;
  totalPointsEarned?: number;
  totalPointsUsed?: number;
  createdAt?: string;
  updatedAt?: string;
  // Computed/Mapped fields for UI
  rating?: number;
  reviews_count?: number;
  joinDate?: string;
}

export type UserRole = "developer" | "owner" | "agent" | "seeker";

export type AgentType = "individual" | "office";

export interface ChangeRoleRequest {
  role: UserRole;
  // Required if role is 'agent' or 'developer'
  fal_number?: string;
  fal_expiry_date?: string; // format: DD-MM-YYYY
  has_ad_license?: "0" | "1";
  // Required if role is 'agent'
  agent_type?: AgentType;
  // Required if role is 'developer'
  commercial_register?: string;
  has_fal_license?: "0" | "1";
  // Optional for all
  company_name?: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: File;
}

export interface TransactionPackage {
  id: number;
  name: string;
  price: string;
}

export interface TransactionPaymentMethod {
  id: number;
  paymentMethodAr: string;
  paymentMethodEn: string;
}

export interface Transaction {
  id: number;
  operation: string;
  status: string;
  description: string;
  paymentGateway: string | null;
  gatewayStatus: string | null;
  transactionDate: string | null;
  createdAt: string;
  package?: TransactionPackage;
  paymentMethod?: TransactionPaymentMethod;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  links: any;
}

export interface StatisticsResponse {
  viewsCount: number;
  adsCount: number;
  transactionsCount: number;
  propertyNewsCount: number;
  propertyRequestsCount: number;
}
