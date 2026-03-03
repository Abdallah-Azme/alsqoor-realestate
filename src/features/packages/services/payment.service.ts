import { api } from "@/lib/api-client";
import { PaymentMethod } from "../types/payment.types";

export const paymentService = {
  /**
   * Get available payment methods
   */
  async getPaymentMethods() {
    return api.get<PaymentMethod[]>("/get-payment-methods");
  },

  /**
   * Verify payment status
   */
  async verifyPayment(paymentId: string) {
    return api.get<any>(`/confirm-payment`, { paymentId });
  },
};
