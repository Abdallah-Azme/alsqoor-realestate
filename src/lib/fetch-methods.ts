"use server";

import { getToken, removeToken } from "@/services";
import { getLocale } from "next-intl/server";
import { ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions {
  url: string;
  locale?: string;
}

interface PostOptions extends FetchOptions {
  data?: Record<string, any>;
  isFormData?: boolean;
}

interface DeleteOptions extends FetchOptions {
  data?: Record<string, any> | null;
}

// تجهيز الهيدر
async function getHeaders(
  isFormData = false,
  locale?: string,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  // content type
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // اللغة
  const currentLocale = locale || (await getLocale());
  headers["Accept-Language"] = currentLocale;

  // token من الكوكي
  const token = await getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Handle 401 Unauthorized - remove token and clear user data
async function handle401(): Promise<void> {
  await removeToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Optionally redirect to login
    // window.location.href = '/auth/login';
  }
}

// جلب البيانات (GET)
export async function getData<T = any>({
  url,
  locale,
}: FetchOptions): Promise<ApiResponse<T>> {
  try {
    const headers = await getHeaders(false, locale);
    const response = await fetch(`${API_URL}${url}`, {
      headers,
      cache: "no-store", // Disable Next.js caching - React Query handles caching
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      await handle401();
      return {
        code: 401,
        success: false,
        message: "Unauthorized. Please login again.",
        unauthorized: true,
      };
    }

    // التحقق من نوع المحتوى المُرجع
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      return {
        code: response.status,
        success: false,
        message: `Server returned ${response.status}: Expected JSON but got ${
          contentType || "unknown type"
        }`,
        rawResponse: textResponse.substring(0, 200),
      } as ApiResponse<T>;
    }

    const data = await response.json();
    return { code: response.status, success: true, data };
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

// إرسال البيانات (POST)
export async function postData<T = any>({
  url,
  data,
  isFormData,
  locale,
}: PostOptions): Promise<ApiResponse<T>> {
  try {
    const headers = await getHeaders(isFormData, locale);
    const body = isFormData
      ? getFormData(data || {})
      : JSON.stringify(data || {});

    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers,
      body,
      cache: "no-store", // Disable Next.js caching
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      await handle401();
      return {
        code: 401,
        success: false,
        message: "Unauthorized. Please login again.",
        unauthorized: true,
      };
    }

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
      } as ApiResponse<T>;
    }

    const resData = await response.json();
    return { code: response.status, success: true, data: resData };
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

// تحديث البيانات (PUT)
export async function putData<T = any>({
  url,
  data,
  isFormData,
  locale,
}: PostOptions): Promise<ApiResponse<T>> {
  try {
    const headers = await getHeaders(isFormData, locale);
    const body = isFormData
      ? getFormData(data || {})
      : JSON.stringify(data || {});

    const response = await fetch(`${API_URL}${url}`, {
      method: "PUT",
      headers,
      body,
      cache: "no-store", // Disable Next.js caching
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      await handle401();
      return {
        code: 401,
        success: false,
        message: "Unauthorized. Please login again.",
        unauthorized: true,
      };
    }

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
      } as ApiResponse<T>;
    }

    const resData = await response.json();
    return { code: response.status, success: true, data: resData };
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

// helper لتحويل object لـ FormData
function getFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

// حذف البيانات (DELETE)
export async function deleteData<T = any>({
  url,
  data = null,
  locale,
}: DeleteOptions): Promise<ApiResponse<T>> {
  try {
    const headers = await getHeaders(false, locale);

    const options: RequestInit = {
      method: "DELETE",
      headers,
    };

    // لو فيه بيانات محتاج تبعتها في body
    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${url}`, options);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      await handle401();
      return {
        code: 401,
        success: false,
        message: "Unauthorized. Please login again.",
        unauthorized: true,
      };
    }

    const resData = await response.json();

    return { code: response.status, success: true, data: resData };
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}
