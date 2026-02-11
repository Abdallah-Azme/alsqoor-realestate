export interface FeaturedUser {
  id: number | string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  avatarUrl: string;
  pointsBalance: number;
  totalPointsEarned: number;
  totalPointsUsed: number;
  properties: any[];
  createdAt: string;
  updatedAt: string;
  // Additional fields returned by single user endpoint
  verificationCode?: string;
  providerId?: string | null;
  providerName?: string | null;
  mobileVerified?: boolean;
}

export interface FeaturedUsersResponse {
  data: FeaturedUser[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
