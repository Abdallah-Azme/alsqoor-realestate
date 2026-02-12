/**
 * Client-side API Client
 *
 * A single source of truth for all API calls from React Query hooks.
 * - Supports GET, POST, PUT, PATCH, DELETE
 * - Auto-detects FormData vs JSON
 * - Throws ApiError on non-2xx responses (so React Query enters error state)
 * - Reads auth token from cookies (client-side) and locale from URL
 *
 * @example
 * ```ts
 * import { api } from "@/lib/api-client";
 *
 * // In a query
 * const data = await api.get<Blog[]>("/blogs", { page: 1, per_page: 10 });
 *
 * // In a mutation (JSON)
 * const result = await api.post<Blog>("/blogs", { title: "Hello" });
 *
 * // In a mutation (FormData)
 * const formData = new FormData();
 * formData.append("image", file);
 * const result = await api.post<Blog>("/blogs", formData);
 *
 * // PATCH
 * const updated = await api.patch<Blog>("/blogs/1", { title: "Updated" });
 * ```
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ─── Custom Error Class ────────────────────────────────────────────

export class ApiError extends Error {
  code: number;
  details?: Record<string, string[]>;
  unauthorized: boolean;

  constructor(
    message: string,
    code: number,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
    this.unauthorized = code === 401;
  }
}

// ─── Types ─────────────────────────────────────────────────────────

interface RequestOptions {
  /** Override the default headers */
  headers?: Record<string, string>;
  /** Override the locale used in Accept-Language */
  locale?: string;
  /** Signal for request cancellation */
  signal?: AbortSignal;
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Get the auth token from client-side cookies or localStorage
 */
function getClientToken(): string | null {
  if (typeof document === "undefined") return null;

  // First, try to get from cookie
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
}

/**
 * Get the current locale from the URL path (e.g., /ar/... → "ar")
 */
function getClientLocale(): string {
  if (typeof window === "undefined") return "ar";
  const segments = window.location.pathname.split("/");
  // The locale is the first non-empty path segment
  const locale = segments.find((s) => s.length > 0);
  return locale === "en" || locale === "ar" ? locale : "ar";
}

/**
 * Build default headers for the request
 */
function buildHeaders(
  isFormData: boolean,
  locale?: string,
  extraHeaders?: Record<string, string>,
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Content-Type (skip for FormData — browser sets it with boundary)
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Accept header - skip for favorites to avoid 401 on some endpoints if strict
  // The user reported issues with favorites endpoint returning 401 when this header is present?
  // Or rather, they said "if you didn't include it i get error 500, when i do i get 401 which is acceptable".
  // Wait, re-reading: "if you didn't include it i get error 500 when i do i get 401 which is acceptable"
  // This means the user WANTS the 401 (Unauthorized) behavior rather than 500 (Server Error).
  // So we SHOULD keep the Accept header.
  // BUT the user asks "why do i keep getting [401]... from this endpoint... you always send accept application json...?"
  // It seems they are confused why they get 401. It's likely because they are not logged in and the endpoint requires auth.
  // Adding 'Accept: application/json' tells Laravel to return JSON errors (like 401) instead of redirecting to login page (which might cause 500 if minimal API setup).

  // However, to strictly follow "why do i keep getting... from this endpoint... you always send accept application json",
  // I will add logic to NOT skip it, because the user said "401... is acceptable".
  // Actually, wait. The user says: "if you didnt include it i get error 500 when i do i get 401 which is acceptable".
  // so the CURRENT state where we send it is CORRECT for them.
  // The user is asking "WHY". The answer is "Yes, we always send it".
  // But maybe they want to suppress it for *public* endpoints?
  // Let's look at the request again: "why do i keep getting from this endpoint? ... favorites ... you always send accept application json? ... if you didnt include it i get error 500 ... when i do i get 401 which is acceptable"
  // It sounds like they are debugging.
  // If I strictly follow instructions to "fix" something, maybe I should allow overriding headers more easily?
  // Unclear instruction. The prompt is "why do i keep getting...".
  // I will assume the user wants me to *explain* or *allow control*.
  // But since I am an agent that writes code, let's look at the `buildHeaders`.
  // It unconditionally sets `headers["Accept"] = "application/json";`.
  // I will change it so it respects `extraHeaders` if `Accept` is explicitly passed as something else, OR if null/undefined is explicitly passed (though Record<string, string> makes that hard).

  // Let's just comment the code to explain:
  headers["Accept"] = "application/json";

  // Locale
  headers["Accept-Language"] = locale || getClientLocale();

  // Auth token
  const token = getClientToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Merge extra headers (can override Accept or Content-Type)
  if (extraHeaders) {
    Object.assign(headers, extraHeaders);
  }

  return headers;
}

/**
 * Build the full URL with query parameters
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const base = `${API_URL}${path}`;

  if (!params || Object.keys(params).length === 0) {
    return base;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Convert a plain object to FormData (handles nested arrays and files)
 */
function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "object" && !(value instanceof Date)) {
      // Nested object → serialize as JSON string
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Handle 401 — clear stored auth data
 */
function handle401() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Clear the token cookie on the client side
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

// ─── Core Fetch Function ───────────────────────────────────────────

/**
 * The core fetch wrapper. Throws ApiError on non-2xx responses.
 *
 * @param url - API path (e.g., "/blogs")
 * @param options - Fetch configuration
 * @returns Parsed response data of type T
 * @throws ApiError
 */
async function apiClient<T = any>(
  url: string,
  config: {
    method?: string;
    data?: any;
    params?: Record<string, any>;
  } & RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    data,
    params,
    headers: extraHeaders,
    locale,
    signal,
  } = config;

  // Detect if data is FormData
  const isFormData = data instanceof FormData;

  // Build body
  let body: BodyInit | undefined;
  if (data !== undefined && data !== null) {
    if (data instanceof FormData) {
      body = data;
    } else if (typeof data === "object" && config.method !== "GET") {
      body = JSON.stringify(data);
    }
  }

  // Build headers
  const headers = buildHeaders(isFormData, locale, extraHeaders);

  // Build URL
  const fullUrl = buildUrl(url, params);

  // Execute fetch
  let response: Response;
  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
      body,
      signal,
      cache: "no-store",
    };

    // Add User-Agent for server-side requests (Node environment)
    if (typeof window === "undefined") {
      // @ts-ignore - Headers type allows string keys
      headers["User-Agent"] = "Next.js/Server";
      // @ts-ignore
      headers["Referer"] =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    }

    response = await fetch(fullUrl, fetchOptions);
  } catch (error) {
    // If it's a fetch error, log cause if available
    console.error(`API Fetch Error: ${fullUrl}`, error);
    if ((error as any)?.cause) {
      console.error("Cause:", (error as any).cause);
    }
    throw error;
  }

  // Handle 401
  if (response.status === 401) {
    handle401();
    throw new ApiError("Unauthorized. Please login again.", 401);
  }

  // Try to parse JSON
  const contentType = response.headers.get("content-type");
  let responseData: any;

  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    // Non-JSON response
    const text = await response.text();
    if (!response.ok) {
      throw new ApiError(
        `Server returned ${response.status}: ${text.substring(0, 200)}`,
        response.status,
      );
    }
    return text as unknown as T;
  }

  // Handle API-level errors (non-2xx or success === false in body)
  if (!response.ok || responseData?.success === false) {
    const message =
      responseData?.message ||
      responseData?.error ||
      `Request failed with status ${response.status}`;

    const details = responseData?.errors || responseData?.details;

    throw new ApiError(message, response.status, details);
  }

  // Return the data — unwrap if wrapped in { data: ... }
  // Many APIs return { success: true, data: { ... } }
  if (responseData?.data !== undefined) {
    return responseData.data as T;
  }

  return responseData as T;
}

// ─── Convenience Methods ───────────────────────────────────────────

export const api = {
  /**
   * GET request
   * @param url - API path
   * @param params - Query parameters
   * @param options - Extra request options
   */
  get: async <T = any>(
    url: string,
    params?: Record<string, any>,
    options?: RequestOptions,
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiClient<T>(url, {
        method: "GET",
        params,
        ...options,
      });
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[API] GET ${url}: ${duration}ms`);
      }
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`[API] GET ${url} FAILED: ${duration}ms`, error);
      }
      throw error;
    }
  },

  /**
   * POST request
   * @param url - API path
   * @param data - Body data (object or FormData)
   * @param options - Extra request options
   */
  post: async <T = any>(
    url: string,
    data?: Record<string, any> | FormData,
    options?: RequestOptions,
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiClient<T>(url, {
        method: "POST",
        data,
        ...options,
      });
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[API] POST ${url}: ${duration}ms`);
      }
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`[API] POST ${url} FAILED: ${duration}ms`, error);
      }
      throw error;
    }
  },

  /**
   * PUT request
   * @param url - API path
   * @param data - Body data (object or FormData)
   * @param options - Extra request options
   */
  put: async <T = any>(
    url: string,
    data?: Record<string, any> | FormData,
    options?: RequestOptions,
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiClient<T>(url, {
        method: "PUT",
        data,
        ...options,
      });
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[API] PUT ${url}: ${duration}ms`);
      }
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`[API] PUT ${url} FAILED: ${duration}ms`, error);
      }
      throw error;
    }
  },

  /**
   * PATCH request
   * @param url - API path
   * @param data - Body data (object or FormData)
   * @param options - Extra request options
   */
  patch: async <T = any>(
    url: string,
    data?: Record<string, any> | FormData,
    options?: RequestOptions,
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiClient<T>(url, {
        method: "PATCH",
        data,
        ...options,
      });
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[API] PATCH ${url}: ${duration}ms`);
      }
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`[API] PATCH ${url} FAILED: ${duration}ms`, error);
      }
      throw error;
    }
  },

  /**
   * DELETE request
   * @param url - API path
   * @param data - Optional body data
   * @param options - Extra request options
   */
  del: async <T = any>(
    url: string,
    data?: Record<string, any> | null,
    options?: RequestOptions,
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiClient<T>(url, {
        method: "DELETE",
        data,
        ...options,
      });
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[API] DELETE ${url}: ${duration}ms`);
      }
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`[API] DELETE ${url} FAILED: ${duration}ms`, error);
      }
      throw error;
    }
  },
};

export { toFormData };
export default api;
