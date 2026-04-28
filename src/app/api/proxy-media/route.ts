import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

/**
 * Server-side media proxy.
 * Usage: GET /api/proxy-media?url=https://api.example.com/storage/image.jpg
 *
 * The browser calls this Next.js endpoint (same origin → no CORS).
 * Next.js fetches the file server-to-server (no CORS restriction), then
 * streams the bytes back to the client.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing 'url' query parameter", { status: 400 });
  }

  // Validate that the URL points to our own API domain to prevent open-proxy abuse
  const allowedOrigins = [
    "https://api.alsqoor-realestate.sa",
    "http://api.alsqoor-realestate.sa",
  ];

  const isAllowed = allowedOrigins.some((origin) => url.startsWith(origin));
  if (!isAllowed) {
    return new NextResponse("URL not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      // Pass along no cookies / credentials — public media only
      cache: "no-store",
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";
    const body = await upstream.arrayBuffer();
    const normalizedContentType = contentType.toLowerCase();

    // Backend does not accept WEBP/AVIF uploads. Convert them to JPEG here.
    if (
      normalizedContentType.startsWith("image/webp") ||
      normalizedContentType.startsWith("image/avif")
    ) {
      const converted = await sharp(Buffer.from(body)).jpeg({ quality: 90 }).toBuffer();
      return new NextResponse(converted, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Allow the browser to cache the proxied media
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[proxy-media] fetch failed:", err);
    return new NextResponse("Failed to fetch media", { status: 502 });
  }
}
