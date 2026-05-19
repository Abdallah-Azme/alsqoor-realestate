import { api } from "@/lib/api-client";

/** Purpose values accepted by POST /s3/temp-credentials */
export type S3UploadPurpose =
  | "property-images"
  | "property-videos"
  | "propertynew-images"
  | "propertynew-videos"
  | "qr-codes";

export interface S3TempCredentials {
  access_key: string;
  secret_key: string;
  session_token: string;
  bucket: string;
  region: string;
  folder: string;
  expires_at: string;
}

export interface S3FileUploadResult {
  purpose: S3UploadPurpose;
  fileName: string;
  mimeType: string;
  size: number;
  key: string;
  bucket: string;
  region: string;
  folder: string;
  etag?: string;
  /** Public HTTPS URL for the uploaded object */
  location: string;
  status: number;
}

function getClientLocale(): string {
  if (typeof window === "undefined") return "ar";
  const segments = window.location.pathname.split("/");
  const locale = segments.find((s) => s.length > 0);
  return locale === "en" || locale === "ar" ? locale : "ar";
}

function getClientToken(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }

  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
}

/**
 * Request short-lived STS credentials (used for logging/debug; upload goes via proxy).
 */
export async function getS3TempCredentials(
  purpose: S3UploadPurpose,
): Promise<S3TempCredentials> {
  const formData = new FormData();
  formData.append("purpose", purpose);

  const credentials = await api.post<S3TempCredentials>(
    "/s3/temp-credentials",
    formData,
  );

  console.log("[S3] Temp credentials received:", {
    purpose,
    bucket: credentials.bucket,
    region: credentials.region,
    folder: credentials.folder,
    expires_at: credentials.expires_at,
  });

  return credentials;
}

/**
 * Upload via same-origin API route (server PUTs to S3 — no bucket CORS needed).
 */
export async function uploadFileToS3WithCredentials(
  file: File,
  purpose: S3UploadPurpose,
): Promise<S3FileUploadResult> {
  const formData = new FormData();
  formData.append("purpose", purpose);
  formData.append("file", file);

  const headers: Record<string, string> = {
    "Accept-Language": getClientLocale(),
  };

  const token = getClientToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch("/api/s3-upload", {
    method: "POST",
    body: formData,
    headers,
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("[S3] Proxy upload failed:", payload);
    throw new Error(
      payload?.message || `Upload failed (${response.status})`,
    );
  }

  const result = (payload?.data ?? payload) as S3FileUploadResult;
  console.log("[S3] Upload complete (send this key to backend):", result.key, result);
  return result;
}

/**
 * Upload multiple files (one proxy request per file).
 */
export async function uploadFilesToS3(
  files: File[],
  purpose: S3UploadPurpose,
): Promise<S3FileUploadResult[]> {
  if (files.length === 0) return [];

  const results: S3FileUploadResult[] = [];
  for (const file of files) {
    results.push(await uploadFileToS3WithCredentials(file, purpose));
  }

  console.log("[S3] Batch upload summary:", {
    purpose,
    count: results.length,
    keys: results.map((r) => r.key),
  });

  return results;
}

/** Property-new marketplace media purposes */
export const PROPERTY_NEW_S3_PURPOSES = {
  images: "propertynew-images" as const,
  videos: "propertynew-videos" as const,
};

/** Classic property / advertisement media purposes */
export const PROPERTY_AD_S3_PURPOSES = {
  images: "property-images" as const,
  videos: "property-videos" as const,
  qr: "qr-codes" as const,
};

export function getMediaFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

const DEFAULT_S3_PUBLIC_BASE =
  "https://amzn-s3-alsqoor-bucket.s3.eu-north-1.amazonaws.com";

/**
 * Backend expects the S3 object key (e.g. propertynew-images/foo.png), not the full URL.
 */
export function toS3ObjectKey(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (!/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  try {
    const pathname = new URL(trimmed).pathname.replace(/^\/+/, "");
    return decodeURIComponent(pathname);
  } catch {
    return trimmed;
  }
}

/** Build a public URL for previews when state holds an object key. */
export function getS3PublicUrl(keyOrUrl: string): string {
  const trimmed = keyOrUrl.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const objectKey = toS3ObjectKey(trimmed);
  const base =
    process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    DEFAULT_S3_PUBLIC_BASE;
  const encodedKey = objectKey.split("/").map(encodeURIComponent).join("/");
  return `${base}/${encodedKey}`;
}
