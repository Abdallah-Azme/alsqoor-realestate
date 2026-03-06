import { z } from "zod";

export interface DirectDeal {
  id: number;
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  district: string;
  planNumber: string;
  plotNumber: string;
  minArea: number;
  maxArea: number;
  minTotalPrice: number;
  maxTotalPrice: number;
  minPricePerMeter: number;
  maxPricePerMeter: number;
  transactionType:
    | "ownership_transfer"
    | "mortgage"
    | "mortgage_release"
    | "division_merge"
    | "all"
    | "update_modification"
    | string;
  isActive: boolean;
  propertyType?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Raw IDs for editing (might not be present in all API responses)
  countryId?: number;
  cityId?: number;
  propertyTypeId?: number;
  identityNumber?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export const directDealSchema = z.object({
  start_date: z.string().min(1, "required"),
  end_date: z.string().min(1, "required"),
  city_id: z.string().min(1, "required"),
  district: z.string().min(1, "required"),
  country_id: z.string().min(1, "required"),
  plan_number: z.string().min(1, "required"),
  plot_number: z.string().min(1, "required"),
  min_area: z.string().min(1, "required"),
  max_area: z.string().min(1, "required"),
  min_total_price: z.string().min(1, "required"),
  max_total_price: z.string().min(1, "required"),
  min_price_per_meter: z.string().min(1, "required"),
  max_price_per_meter: z.string().min(1, "required"),
  property_type_id: z.string().min(1, "required"),
  transaction_type: z.string().min(1, "required"),
  identity_number: z.string().min(1, "required"),
});

export type DirectDealFormValues = z.infer<typeof directDealSchema>;
