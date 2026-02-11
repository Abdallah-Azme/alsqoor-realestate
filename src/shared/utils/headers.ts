"use server";

import { getToken } from "@/services";
import { getLocale } from "next-intl/server";

/**
 * Get authentication headers with Bearer token
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Get locale headers for i18n
 */
export async function getLocaleHeaders(
  locale?: string,
): Promise<Record<string, string>> {
  const currentLocale = locale || (await getLocale());
  return { "Accept-Language": currentLocale };
}

/**
 * Get all default headers for API requests
 */
export async function getDefaultHeaders(
  isFormData = false,
  locale?: string,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  // Content type (skip for FormData)
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Add locale headers
  const localeHeaders = await getLocaleHeaders(locale);
  Object.assign(headers, localeHeaders);

  // Add auth headers
  const authHeaders = await getAuthHeaders();
  Object.assign(headers, authHeaders);

  return headers;
}
