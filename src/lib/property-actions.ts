"use server";

import { getToken } from "@/services";
import { getLocale } from "next-intl/server";
import { ApiResponse, Property } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function addProperty(formData: FormData): Promise<ApiResponse> {
  try {
    const token = await getToken();
    const locale = await getLocale();

    if (!token) {
      return {
        code: 401,
        success: false,
        message: "يجب تسجيل الدخول أولاً",
      };
    }

    const response = await fetch(`${API_URL}/properties/add`, {
      method: "POST",
      headers: {
        "Accept-Language": locale,
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error(
        "Non-JSON response received:",
        textResponse.substring(0, 500),
      );
      return {
        code: response.status,
        success: false,
        message: `Server returned ${response.status}: Expected JSON but got ${
          contentType || "unknown type"
        }`,
        rawResponse: textResponse.substring(0, 200),
      };
    }

    const result = await response.json();
    return { code: response.status, success: true, data: result };
  } catch (err: any) {
    console.error("Error adding property:", err);
    return {
      code: 500,
      success: false,
      message: err?.message || "حدث خطأ غير متوقع",
    };
  }
}

export async function getPropertyBySlug(
  slug: string,
): Promise<ApiResponse<Property>> {
  try {
    const locale = await getLocale();

    // Don't encode the slug - Next.js already provides it in the correct format
    const response = await fetch(`${API_URL}/properties/${slug}`, {
      headers: {
        "Accept-Language": locale,
        Accept: "application/json",
      },
      cache: "no-store", // Disable Next.js caching - React Query handles caching
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error(
        "Non-JSON response received:",
        textResponse.substring(0, 500),
      );
      return {
        code: response.status,
        success: false,
        message: `Server returned ${response.status}`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return { code: response.status, success: true, data: result.data };
    } else {
      return {
        code: response.status,
        success: false,
        message: result.message || "فشل في جلب بيانات العقار",
      };
    }
  } catch (err: any) {
    console.error("Error fetching property:", err);
    return {
      code: 500,
      success: false,
      message: err?.message || "حدث خطأ غير متوقع",
    };
  }
}

export async function getSimilarProperties(
  propertyId: number | string,
): Promise<ApiResponse<Property[]>> {
  try {
    const locale = await getLocale();

    const response = await fetch(
      `${API_URL}/properties/${propertyId}/similar`,
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
      };
    }

    const result = await response.json();

    if (result.success) {
      return { code: response.status, success: true, data: result.data || [] };
    } else {
      return {
        code: response.status,
        success: false,
        data: [],
      };
    }
  } catch (err: any) {
    console.error("Error fetching similar properties:", err);
    return {
      code: 500,
      success: false,
      data: [],
    };
  }
}
