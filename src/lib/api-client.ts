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
 * Clear all auth data — called only when refresh fails or user is truly logged out
 */
function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    // Expire the client-readable cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

// ─── Refresh Token Queue ───────────────────────────────────────────

/**
 * Whether a token refresh is currently in progress.
 * Used to deduplicate simultaneous refresh attempts.
 */
let isRefreshing = false;

/**
 * Queue of requests that failed with 401 while a refresh was in progress.
 * Each entry holds resolve/reject callbacks to retry the request once the
 * new token is available.
 */
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

/**
 * Resolve or reject all queued requests.
 * Called after a refresh attempt succeeds or fails.
 */
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

/**
 * Attempt to get a new access token using the stored refresh token.
 * Makes a raw fetch call (not through apiClient) to avoid infinite loops.
 *
 * @returns new accessToken on success, null on failure
 */
async function tryRefreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = await response.json();
    // The API returns { data: { accessToken, refreshToken, user } }
    const data = json?.data ?? json;
    const newAccessToken = data?.accessToken;
    const newRefreshToken = data?.refreshToken;

    if (!newAccessToken) return null;

    // ── Update stored access token ──────────────────────────────
    localStorage.setItem("token", newAccessToken);
    // Update the client-readable cookie so subsequent buildHeaders() picks it up
    document.cookie = `token=${encodeURIComponent(newAccessToken)}; path=/; max-age=7200; samesite=lax`;

    // ── Rotate refresh token (API issues a new one each time) ───
    if (newRefreshToken) {
      localStorage.setItem("refresh_token", newRefreshToken);
    }

    // ── Update user data if returned ────────────────────────────
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return newAccessToken;
  } catch {
    return null;
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

  // Build fetch options (hoisted so the 401 retry logic can reuse them)
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

  try {
    response = await fetch(fullUrl, fetchOptions);
  } catch (error) {
    // If it's a fetch error, log cause if available
    console.error(`API Fetch Error: ${fullUrl}`, error);
    if ((error as any)?.cause) {
      console.error("Cause:", (error as any).cause);
    }
    throw error;
  }

  // Handle 401 — attempt token refresh before giving up
  if (response.status === 401) {
    // If another refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: async (newToken: string) => {
            try {
              // Retry the original request with the refreshed token
              const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              };
              const retryRes = await fetch(fullUrl, {
                ...fetchOptions,
                headers: retryHeaders,
              });
              const retryJson = await retryRes.json().catch(() => null);
              const retryData =
                retryJson?.data !== undefined ? retryJson.data : retryJson;
              resolve(retryData as T);
            } catch (e) {
              reject(e);
            }
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await tryRefreshToken();

      if (!newToken) {
        // Refresh failed — session is genuinely expired, clear everything
        clearAuthData();
        const sessionError = new ApiError(
          "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",
          401,
        );
        processQueue(sessionError);
        isRefreshing = false;
        throw sessionError;
      }

      // Refresh succeeded — flush the queue with the new token
      processQueue(null, newToken);
      isRefreshing = false;

      // Retry the original failed request with the new token
      const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      const retryResponse = await fetch(fullUrl, {
        ...fetchOptions,
        headers: retryHeaders,
      });

      if (!retryResponse.ok) {
        const retryJson = await retryResponse.json().catch(() => ({}));
        throw new ApiError(
          retryJson?.message ||
            `Request failed with status ${retryResponse.status}`,
          retryResponse.status,
          retryJson?.errors,
        );
      }

      const retryJson = await retryResponse.json().catch(() => null);
      if (retryJson?.data !== undefined) return retryJson.data as T;
      return retryJson as T;
    } catch (err) {
      isRefreshing = false;
      if (err instanceof ApiError) throw err;
      clearAuthData();
      throw new ApiError(
        "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",
        401,
      );
    }
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
