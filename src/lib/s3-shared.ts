/** Shared S3 key/URL helpers (safe for client and server). */

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function buildObjectKey(folder: string, fileName: string): string {
  const prefix = folder.replace(/\/$/, "");
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${sanitizeFileName(fileName)}`;
  return `${prefix}/${unique}`;
}

function encodeS3ObjectKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

export function buildObjectUrl(
  bucket: string,
  region: string,
  key: string,
): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeS3ObjectKey(key)}`;
}
