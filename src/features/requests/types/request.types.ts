export type PropertyRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "closed";

export interface PropertyRequest {
  id: number;
  requestNumber: string;
  requestType: "buy" | "rent";
  requestTypeLabel: string;
  area: string;
  propertyAge: string;
  paymentMethod: "cash" | "finance";
  paymentMethodLabel: string;
  details: string;
  offer: string;
  budgetType: "market_price" | "specific_budget";
  budgetTypeLabel: string;
  budgetAmount: string | null;
  whatsapp: string;
  telegram: string;
  status: PropertyRequestStatus;
  statusLabel: string;
  isUrgent: "0" | "1";
  urgentExpiresAt: string | null;
  district: string;
  user: RequestUser;
  country: RequestLocation;
  city: RequestLocation;
  createdAt: string;
  updatedAt: string;
}

export interface RequestUser {
  id: number;
  name: string;
  email: string;
}

export interface RequestLocation {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
  links: {
    self: string;
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PropertyRequestsResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<PropertyRequest>;
}

export interface SinglePropertyRequestResponse {
  success: boolean;
  message: string;
  data: PropertyRequest;
}

// Create/Update request data
export interface CreatePropertyRequestData {
  request_type: "buy" | "rent";
  area: string;
  property_age: string;
  payment_method: "cash" | "finance";
  details: string;
  offer: string;
  budget_type: "market_price" | "specific_budget";
  budget_amount?: string;
  whatsapp: string;
  telegram: string;
  country_id: number;
  city_id: number;
  district: string;
  is_urgent?: "0" | "1";
}

export interface RequestActionData {
  action: "update" | "close";
  cancel_reason_id?: string;
  cancel_reason_text?: string;
}

// Filter parameters
export interface PropertyRequestFilters {
  search?: string;
  details?: string;
  request_type?: "buy" | "rent" | "all";
  country_id?: number;
  city_id?: number;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

// Legacy types for backward compatibility
export interface CreateRequestData extends CreatePropertyRequestData {}
export interface RequestFilters extends PropertyRequestFilters {}
export interface RequestsResponse extends PropertyRequestsResponse {}
