import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { S3FileUploadResult, S3TempCredentials, S3UploadPurpose } from "./s3-client-upload";
import { buildObjectKey, buildObjectUrl } from "./s3-shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export { buildObjectKey, buildObjectUrl } from "./s3-shared";

export async function fetchS3TempCredentials(
  purpose: S3UploadPurpose,
  authToken: string,
  locale = "ar",
): Promise<S3TempCredentials> {
  const formData = new FormData();
  formData.append("purpose", purpose);

  const response = await fetch(`${API_URL}/s3/temp-credentials`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: formData,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Failed to get S3 credentials (${response.status})`;
    throw new Error(message);
  }

  return (payload?.data ?? payload) as S3TempCredentials;
}

export async function putFileToS3(
  fileBuffer: ArrayBuffer,
  fileName: string,
  contentType: string,
  purpose: S3UploadPurpose,
  credentials: S3TempCredentials,
): Promise<S3FileUploadResult> {
  const key = buildObjectKey(credentials.folder, fileName);
  const url = buildObjectUrl(credentials.bucket, credentials.region, key);
  const mimeType = contentType || "application/octet-stream";
  const body = new Uint8Array(fileBuffer);

  const s3 = new S3Client({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.access_key,
      secretAccessKey: credentials.secret_key,
      sessionToken: credentials.session_token,
    },
  });

  const putObjectResponse = await s3.send(
    new PutObjectCommand({
      Bucket: credentials.bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
      ContentLength: body.byteLength,
    }),
  );

  return {
    purpose,
    fileName,
    mimeType,
    size: body.byteLength,
    key,
    bucket: credentials.bucket,
    region: credentials.region,
    folder: credentials.folder,
    etag: putObjectResponse.ETag?.replace(/"/g, ""),
    location: url,
    status: 200,
  };
}
