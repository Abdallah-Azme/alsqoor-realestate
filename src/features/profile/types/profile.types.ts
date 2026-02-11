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

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: File;
}
