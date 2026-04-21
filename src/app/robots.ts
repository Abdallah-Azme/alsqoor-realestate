import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-origin";

const BASE_URL = getSiteOrigin();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/profile/",
          "/notifications/",
          "/wishlist/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
