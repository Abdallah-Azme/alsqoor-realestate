import { getData } from "./fetch-methods";
import { ApiResponse, Settings } from "@/types";

/**
 * Fetch site settings from the API
 * @returns Settings data
 */
export async function getSettings(): Promise<Settings | null> {
  try {
    const response = await getData<Settings>({
      url: "/settings",
    });

    // getData returns { code, success, data }
    // The actual API response is in response.data
    if (response?.success && response?.data?.code === 200) {
      return response.data.data; // Return the nested data object
    }

    return null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
