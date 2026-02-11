import { PropertyDetails } from "@/features/properties/ui";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/property-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const propertyResponse = await getPropertyBySlug(slug);
  const property = propertyResponse?.data;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: property?.title || t("estates.title"),
    description:
      property?.description?.substring(0, 160) || t("estates.description"),
    openGraph: {
      images: property?.images?.length > 0 ? [property.images[0]] : [],
    },
  };
}

export default async function AdSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Verify property exists
  const propertyResponse = await getPropertyBySlug(slug);
  if (!propertyResponse.success || !propertyResponse.data) {
    notFound();
  }

  return <PropertyDetails slug={slug} />;
}
