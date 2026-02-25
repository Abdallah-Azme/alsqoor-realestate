import { api } from "@/lib/api-client";

interface SubscriptionResponse {
  success: boolean;
  paymentUrl: string;
  transactionId: number;
  subscriptionId: number;
}

/**
 * Subscriptions service - functions for subscription API operations
 */
export const subscriptionsService = {
  /**
   * Subscribe to a package
   */
  async subscribe(
    packageId: string | number,
    data: {
      payment_method_id: number;
      subscription_period: "monthly" | "yearly";
    },
  ) {
    return api.post<SubscriptionResponse>(
      `/subscriptions/packages/${packageId}`,
      data,
    );
  },

  /**
   * Get user's active subscription
   */
  async getActiveSubscription() {
    return api.get<any>("/user/subscriptions/active");
  },
};
