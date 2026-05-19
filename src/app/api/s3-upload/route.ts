import { NextRequest, NextResponse } from "next/server";
import type { S3UploadPurpose } from "@/lib/s3-client-upload";
import { fetchS3TempCredentials, putFileToS3 } from "@/lib/s3-server-upload";

export const runtime = "nodejs";

const VALID_PURPOSES: S3UploadPurpose[] = [
  "property-images",
  "property-videos",
  "propertynew-images",
  "propertynew-videos",
  "qr-codes",
];

function getAuthToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const cookieToken = request.cookies.get("token")?.value;
  return cookieToken ? decodeURIComponent(cookieToken) : null;
}

function isValidPurpose(value: string): value is S3UploadPurpose {
  return VALID_PURPOSES.includes(value as S3UploadPurpose);
}

/**
 * Same-origin proxy for S3 uploads (avoids browser CORS on the bucket).
 * POST multipart: purpose, file
 */
export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const purpose = formData.get("purpose");
  const file = formData.get("file");

  if (typeof purpose !== "string" || !isValidPurpose(purpose)) {
    return NextResponse.json({ message: "Invalid purpose" }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  const locale =
    request.headers.get("accept-language")?.split(",")[0]?.trim() || "ar";

  try {
    const credentials = await fetchS3TempCredentials(purpose, token, locale);
    const buffer = await file.arrayBuffer();
    const result = await putFileToS3(
      buffer,
      file.name,
      file.type,
      purpose,
      credentials,
    );

    console.log("[S3 API] Upload complete:", {
      purpose,
      key: result.key,
      location: result.location,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[S3 API] Upload failed:", error);
    const message =
      error instanceof Error ? error.message : "S3 upload failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
