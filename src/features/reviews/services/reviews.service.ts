import { api } from "@/lib/api-client";
import { Review } from "../types/review.types";

const BASE_PATH = "/testimonials";

/**
 * Reviews service - functions for testimonials/reviews API operations
 */
export const reviewsService = {
  /**
   * Get all reviews with optional pagination
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Review[]>(BASE_PATH, params);
  },
};
