import { api } from "@/lib/api-client";
import { Settings } from "../types/settings.types";

const BASE_PATH = "/settings";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Settings service - functions for settings API operations
 */
export const settingsService = {
  /**
   * Get all settings (cached for 1 hour)
   */
  async getSettings(): Promise<Settings | null> {
    try {
      const response = await fetch(`${API_URL}${BASE_PATH}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add locale if needed, but settings usually global or contain language specific data within?
          // The response shows "language": "en".
          // If the API supports localized content via Accept-Language, we might need to pass it.
          // For now, let's assume default behavior.
        },
      });

      if (!response.ok) {
        console.error(`Error fetching settings: ${response.status}`);
        return null;
      }

      const result = await response.json();
      if (result?.code === 200) {
        return result.data as Settings;
      }
      return null;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return null;
    }
  },

  /**
   * Get settings for metadata generation (alias for getSettings)
   */
  async getSettingsForMetadata(): Promise<Settings | null> {
    return this.getSettings();
  },

  /**
   * Get topnav color
   */
  async getTopnavColor(): Promise<string> {
    try {
      // Using api client for consistency if possible, or keeping fetch
      // Let's use api client as it's the standard being pushed
      const response = await api.get<any>("/topnav-color");
      return response?.success && response?.data?.data?.topnavColor
        ? response.data.data.topnavColor
        : "#1a1a1a";
    } catch (error) {
      console.error("Error fetching topnav color:", error);
      return "#1a1a1a";
    }
  },
};
