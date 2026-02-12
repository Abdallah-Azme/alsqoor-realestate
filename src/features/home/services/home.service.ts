import { api } from "@/lib/api-client";
import { HomeData } from "../types/home.types";

const BASE_PATH = "/home";

/**
 * Home service - functions for home page API operations
 */
export const homeService = {
  /**
   * Get home page data
   */
  async getHomeData(): Promise<HomeData> {
    const res = await api.get<HomeData>(BASE_PATH);
    console.log(res);
    return res;
  },
};
