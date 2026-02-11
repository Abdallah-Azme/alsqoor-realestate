// Featured User types

export interface FeaturedUser {
  id: number;
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
  // Single user additional fields
  verificationCode?: string;
  providerId?: string | null;
  providerName?: string | null;
  mobileVerified?: boolean;
}
