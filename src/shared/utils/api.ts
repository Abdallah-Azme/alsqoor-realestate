"use server";

import { removeToken } from "@/services";
import { getDefaultHeaders } from "./headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API Response type
 */
export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message?: string;
  data?: T;
  unauthorized?: boolean;
}

/**
 * Request options
 */
export interface RequestOptions {
  locale?: string;
  params?: Record<string, any>;
}

export interface MutationOptions extends RequestOptions {
  isFormData?: boolean;
}

/**
 * Handle 401 Unauthorized - remove token and clear user data
 */
async function handle401(): Promise<void> {
  await removeToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

/**
 * Build URL with query parameters (internal helper)
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return `${API_URL}${path}`;
  }

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return queryString ? `${API_URL}${path}?${queryString}` : `${API_URL}${path}`;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
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
    return {
      code: response.status,
      success: false,
      message: `Server returned ${response.status}: Expected JSON but got ${contentType || "unknown type"}`,
    };
  }

  const data = await response.json();
  return { code: response.status, success: true, data };
}

/**
 * GET request
 */
export async function get<T = any>(
  path: string,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  try {
    const headers = await getDefaultHeaders(false, options?.locale);
    const url = buildUrl(path, options?.params);

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    return handleResponse<T>(response);
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

/**
 * POST request
 */
export async function post<T = any>(
  path: string,
  data?: Record<string, any>,
  options?: MutationOptions,
): Promise<ApiResponse<T>> {
  try {
    let body: string | FormData;
    let isFormData = options?.isFormData || false;

    if (data instanceof FormData) {
      body = data;
      isFormData = true;
    } else if (isFormData && data) {
      body = toFormData(data);
    } else {
      body = JSON.stringify(data || {});
    }

    const headers = await getDefaultHeaders(isFormData, options?.locale);
    const url = buildUrl(path, options?.params);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });

    return handleResponse<T>(response);
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

/**
 * PUT request
 */
export async function put<T = any>(
  path: string,
  data?: Record<string, any>,
  options?: MutationOptions,
): Promise<ApiResponse<T>> {
  try {
    let body: string | FormData;
    let isFormData = options?.isFormData || false;

    if (data instanceof FormData) {
      body = data;
      isFormData = true;
    } else if (isFormData && data) {
      body = toFormData(data);
    } else {
      body = JSON.stringify(data || {});
    }

    const headers = await getDefaultHeaders(isFormData, options?.locale);
    const url = buildUrl(path, options?.params);

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
      cache: "no-store",
    });

    return handleResponse<T>(response);
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

/**
 * DELETE request
 */
export async function del<T = any>(
  path: string,
  data?: Record<string, any> | null,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  try {
    const headers = await getDefaultHeaders(false, options?.locale);
    const url = buildUrl(path, options?.params);

    const fetchOptions: RequestInit = {
      method: "DELETE",
      headers,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    return handleResponse<T>(response);
  } catch (err: any) {
    return {
      code: 500,
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}

/**
 * Convert object to FormData
 */
function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}
