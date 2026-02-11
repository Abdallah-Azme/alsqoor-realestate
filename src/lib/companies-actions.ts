"use server";

import { getLocale } from "next-intl/server";
import { ApiResponse, Property } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCompanyProperties(
  companyId: string | number,
  page: number = 1,
): Promise<ApiResponse<Property[]>> {
  try {
    const locale = await getLocale();

    const response = await fetch(
      `${API_URL}/properties/search?company_id=${companyId}&page=${page}`,
      {
        headers: {
          "Accept-Language": locale,
          Accept: "application/json",
        },
        cache: "no-store", // Disable Next.js caching - React Query handles caching
      },
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        code: response.status,
        success: false,
        data: [],
        message: "Invalid response format",
      };
    }

    const result = await response.json();

    if (result.code === 200) {
      const properties = Array.isArray(result.data)
        ? result.data
        : result.data?.data || [];
      return {
        code: 200,
        success: true,
        data: properties,
      };
    }

    return {
      code: result.code || 400,
      success: false,
      data: [],
      message: result.message,
    };
  } catch (error: any) {
    console.error("Error fetching company properties:", error);
    return {
      code: 500,
      success: false,
      data: [],
      message: error.message,
    };
  }
}
