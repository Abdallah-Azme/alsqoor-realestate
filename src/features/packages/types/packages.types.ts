export interface Package {
  id: number;
  name: string;
  description: string | null;
  price: string;
  pointsRequired: number;
  durationDays: number;
  adCount: number;
  features: string[];
  allowPointsPayment: boolean;
  pointsAwarded: number;
  paymentOptions: {
    cash: boolean;
    points: boolean;
  };
  awardPointsImmediately: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
