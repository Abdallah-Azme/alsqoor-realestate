import { getData } from "./fetch-methods";

export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQPaginatedData {
  current_page: number;
  data: FAQ[];
  last_page: number;
  total: number;
}

export interface FAQApiResponse {
  status: boolean;
  message: string;
  data: FAQPaginatedData;
}

/**
 * Fetch FAQs from the API
 * @returns FAQs data
 */
export async function getFaqs(): Promise<FAQ[]> {
  try {
    const response = await getData<FAQApiResponse>({
      url: "/faqs",
    });

    console.log("FAQ API Response:", JSON.stringify(response, null, 2));

    // getData returns { code, success, data } where data is the FAQApiResponse
    if (response?.success && response?.data?.status) {
      return response.data.data?.data || [];
    }

    return [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}
