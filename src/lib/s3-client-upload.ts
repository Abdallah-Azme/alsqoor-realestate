import { api } from "@/lib/api-client";
import { buildObjectKey, buildObjectUrl } from "@/lib/s3-shared";

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
 * `direct` (default): browser → S3 with STS creds (no Next.js body limit).
 * `proxy`: browser → /api/s3-upload → S3 (needs no bucket CORS; hits server limits).
 */
function useS3UploadProxy(): boolean {
  return process.env.NEXT_PUBLIC_S3_UPLOAD_MODE === "proxy";
}

/**
 * Short-lived STS credentials from your Laravel API.
 */
export async function getS3TempCredentials(
  purpose: S3UploadPurpose,
): Promise<S3TempCredentials> {
  const formData = new FormData();
  formData.append("purpose", purpose);

  return api.post<S3TempCredentials>("/s3/temp-credentials", formData);
}

/**
 * Browser uploads directly to S3 (file bytes never pass through Next.js).
 * Requires bucket CORS + IAM policy on the STS role for the purpose prefix.
 */
export async function uploadFileDirectToS3(
  file: File,
  purpose: S3UploadPurpose,
  credentials?: S3TempCredentials,
): Promise<S3FileUploadResult> {
  const creds = credentials ?? (await getS3TempCredentials(purpose));
  const key = buildObjectKey(creds.folder, file.name);
  const mimeType = file.type || "application/octet-stream";
  const body = new Uint8Array(await file.arrayBuffer());

  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: creds.region,
    credentials: {
      accessKeyId: creds.access_key,
      secretAccessKey: creds.secret_key,
      sessionToken: creds.session_token,
    },
  });

  let putResponse;
  try {
    putResponse = await client.send(
      new PutObjectCommand({
        Bucket: creds.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
        ContentLength: body.byteLength,
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "S3 upload failed";
    if (
      typeof window !== "undefined" &&
      (message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("CORS"))
    ) {
      throw new Error(
        "S3 CORS blocked this upload. Add https://alsqoor-realestate.sa (and http://localhost:3000 for dev) to the bucket CORS AllowedOrigins — see docs/s3-bucket-cors.json.",
      );
    }
    throw error;
  }

  return {
    purpose,
    fileName: file.name,
    mimeType,
    size: body.byteLength,
    key,
    bucket: creds.bucket,
    region: creds.region,
    folder: creds.folder,
    etag: putResponse.ETag?.replace(/"/g, ""),
    location: buildObjectUrl(creds.bucket, creds.region, key),
    status: 200,
  };
}

/** Fallback: same-origin proxy when CORS cannot be configured yet. */
async function uploadFileViaProxy(
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
    throw new Error(
      payload?.message || `Upload failed (${response.status})`,
    );
  }

  return (payload?.data ?? payload) as S3FileUploadResult;
}

export async function uploadFileToS3WithCredentials(
  file: File,
  purpose: S3UploadPurpose,
): Promise<S3FileUploadResult> {
  if (useS3UploadProxy()) {
    return uploadFileViaProxy(file, purpose);
  }
  return uploadFileDirectToS3(file, purpose);
}

export async function uploadFilesToS3(
  files: File[],
  purpose: S3UploadPurpose,
): Promise<S3FileUploadResult[]> {
  if (files.length === 0) return [];

  if (useS3UploadProxy()) {
    const results: S3FileUploadResult[] = [];
    for (const file of files) {
      results.push(await uploadFileViaProxy(file, purpose));
    }
    return results;
  }

  const credentials = await getS3TempCredentials(purpose);
  const results: S3FileUploadResult[] = [];
  for (const file of files) {
    results.push(
      await uploadFileDirectToS3(file, purpose, credentials),
    );
  }
  return results;
}

export const PROPERTY_NEW_S3_PURPOSES = {
  images: "propertynew-images" as const,
  videos: "propertynew-videos" as const,
};

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
