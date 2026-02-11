import { api } from "@/lib/api-client";
import { Complaint, ComplaintType } from "../types/complaint.types";

const BASE_PATH = "/complaints";

/**
 * Complaints service - functions for complaints API operations
 */
export const complaintsService = {
  /**
   * Get all complaints
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Complaint[]>(BASE_PATH, params);
  },

  /**
   * Get complaint types
   */
  async getComplaintTypes(): Promise<ComplaintType[]> {
    return api.get<ComplaintType[]>(`${BASE_PATH}/types`);
  },

  /**
   * Submit a complaint
   */
  async submitComplaint(data: Omit<Complaint, "id">) {
    return api.post(BASE_PATH, data);
  },
};
