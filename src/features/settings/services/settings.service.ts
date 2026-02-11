import { get } from "@/shared/utils/api";
import { Settings } from "../types/settings.types";

const BASE_PATH = "/settings";

/**
 * Settings service - functions for settings API operations
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const settingsService = {
  /**
   * Get site settings
   */
  async getSettings() {
    return get<Settings>(BASE_PATH);
  },

  /**
   * Get settings for metadata generation (with caching)
   * Uses Next.js revalidate for 1-hour caching
   */
  async getSettingsForMetadata(): Promise<Settings | null> {
    try {
      const response = await fetch(`${API_URL}${BASE_PATH}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        console.error(
          `Error fetching settings for metadata: Server returned ${response.status}`,
        );
        return null;
      }

      const result = await response.json();
      if (result?.code === 200) {
        return result.data as Settings;
      }
      return null;
    } catch (error) {
      console.error("Error fetching settings for metadata:", error);
      return null;
    }
  },

  /**
   * Get topnav color
   * @returns Color string or default
   */
  async getTopnavColor(): Promise<string> {
    const response = await get<any>("/topnav-color");
    // The API response structure is: { success, data: { success, data: { topnavColor: "#xxx" } } }
    return response?.success && response?.data?.data?.topnavColor
      ? response.data.data.topnavColor
      : "#1a1a1a";
  },
};
