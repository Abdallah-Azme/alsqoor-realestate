"use server";

import { getToken } from "@/services";
import { getLocale } from "next-intl/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DealResponse {
  success: boolean;
  message?: string;
  data?: any;
  meta?: any;
}

export async function createDirectDeal(
  formData: Record<string, any>,
): Promise<DealResponse> {
  try {
    // Get token from cookies
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        message: "غير مصرح. يرجى تسجيل الدخول.",
      };
    }

    // Get locale
    const locale = await getLocale();

    // Prepare form data
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Make API request
    const response = await fetch(`${API_URL}/direct-deals/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale,
        Accept: "application/json",
      },
      body: data,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse.substring(0, 500));
      return {
        success: false,
        message: `خطأ في الخادم: تم إرجاع ${response.status}`,
      };
    }

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || "تم إضافة الصفقة بنجاح",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "فشل في إضافة الصفقة",
      };
    }
  } catch (error) {
    console.error("Error creating deal:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء إضافة الصفقة",
    };
  }
}

export async function getDirectDeals(page = 1): Promise<DealResponse> {
  try {
    // Get token from cookies (optional - endpoint doesn't require auth)
    const token = await getToken();

    // Get locale
    const locale = await getLocale();

    // Build headers - token is optional
    const headers: Record<string, string> = {
      "Accept-Language": locale,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Make API request
    const response = await fetch(`${API_URL}/direct-deals/?page=${page}`, {
      method: "GET",
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse.substring(0, 500));
      return {
        success: false,
        message: `خطأ في الخادم: تم إرجاع ${response.status}`,
      };
    }

    const result = await response.json();
    console.log("API Response:", JSON.stringify(result));

    // Check if response is successful (either result.success is true OR response.ok with data)
    if (response.ok && (result.success || result.data)) {
      return {
        success: true,
        data: result.data || [],
        meta: result.meta,
      };
    } else {
      return {
        success: false,
        message: result.message || "فشل في جلب الصفقات",
      };
    }
  } catch (error) {
    console.error("Error fetching deals:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء جلب الصفقات",
    };
  }
}

export async function updateDirectDeal(
  dealId: number | string,
  formData: Record<string, any>,
): Promise<DealResponse> {
  try {
    // Get token from cookies
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        message: "غير مصرح. يرجى تسجيل الدخول.",
      };
    }

    // Get locale
    const locale = await getLocale();

    // Prepare form data
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Make API request
    const response = await fetch(`${API_URL}/direct-deals/${dealId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale,
        Accept: "application/json",
      },
      body: data,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse.substring(0, 500));
      return {
        success: false,
        message: `خطأ في الخادم: تم إرجاع ${response.status}`,
      };
    }

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || "تم تحديث الصفقة بنجاح",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "فشل في تحديث الصفقة",
      };
    }
  } catch (error) {
    console.error("Error updating deal:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء تحديث الصفقة",
    };
  }
}
