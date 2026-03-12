import { api } from "@/lib/api-client";
import { ServiceDescriptionsData } from "../types";

const BASE_PATH = "/service-descriptions";

export const serviceDescriptionsService = {
  /**
   * Get all service descriptions
   */
  async getAll(): Promise<ServiceDescriptionsData> {
    return api.get<ServiceDescriptionsData>(BASE_PATH);
  },
};
