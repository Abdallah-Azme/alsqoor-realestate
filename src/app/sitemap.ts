import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://api.alsqoor-realestate.sa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define all static routes
const staticRoutes = [
  "",
  "/about-us",
  "/blogs",
  "/complaints",
  "/deals",
  "/estats",
  "/featuredusers",
  "/marketplace",
  "/offers",
  "/packages",
  "/partners",
  "/requests",
  "/user-manual",
];

// Define supported locales
const locales = ["ar", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Generate sitemap entries for all static routes in all locales
  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      staticEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Fetch dynamic content for blogs
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(
      `${API_URL}/blogs?per_page=100`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );
    const result = await response.json();
    const blogs = result?.data?.data || [];

    blogEntries = blogs.flatMap((blog: { slug: string; updatedAt?: string }) =>
      locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  // Fetch dynamic content for properties
  let propertyEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(
      `${API_URL}/properties?per_page=100`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );
    const result = await response.json();
    const properties = result?.data?.data || [];

    propertyEntries = properties.flatMap(
      (property: { slug: string; updatedAt?: string }) =>
        locales.map((locale) => ({
          url: `${BASE_URL}/${locale}/estats/${property.slug}`,
          lastModified: property.updatedAt
            ? new Date(property.updatedAt)
            : currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
    );
  } catch (error) {
    console.error("Error fetching properties for sitemap:", error);
  }

  // Fetch dynamic content for partners/featured users
  let partnerEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(
      `${API_URL}/featured-users?per_page=100`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );
    const result = await response.json();
    const partners = result?.data?.data || [];

    partnerEntries = partners.flatMap(
      (partner: { id: number; updatedAt?: string }) =>
        locales.map((locale) => ({
          url: `${BASE_URL}/${locale}/partners/${partner.id}`,
          lastModified: partner.updatedAt
            ? new Date(partner.updatedAt)
            : currentDate,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
    );
  } catch (error) {
    console.error("Error fetching partners for sitemap:", error);
  }

  return [
    ...staticEntries,
    ...blogEntries,
    ...propertyEntries,
    ...partnerEntries,
  ];
}
