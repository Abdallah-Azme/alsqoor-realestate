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
  async getSettings(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}${BASE_PATH}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(`Error fetching settings: ${response.status}`);
        return null;
      }

      const result = await response.json();
      return result; // Return the full result so hooks can check success/code
    } catch (error) {
      console.error("Error fetching settings:", error);
      return null;
    }
  },

  /**
   * Get settings for metadata generation (alias for getSettings)
   */
  async getSettingsForMetadata(): Promise<Settings | null> {
    const result = await this.getSettings();
    if (result?.code === 200 || result?.success) {
      return (result.data?.data || result.data) as Settings;
    }
    return null;
  },

  /**
   * Get topnav color
   */
  async getTopnavColor(): Promise<string> {
    try {
      // Using api client for consistency.
      // The api.get automatically unwraps the "data" field from the response.
      const data = await api.get<{ topnavColor: string }>("/topnav-color");
      return data?.topnavColor || "#1a1a1a";
    } catch (error) {
      console.error("Error fetching topnav color:", error);
      return "#1a1a1a";
    }
  },
};
