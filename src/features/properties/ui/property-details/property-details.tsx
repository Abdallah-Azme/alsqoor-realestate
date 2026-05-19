"use client";

import {
  usePropertyBySlug,
  useSimilarProperties,
} from "../../hooks/use-properties";
import { PropertyInfo } from "./property-info";
import { PropertyCard } from "../property-list/property-card";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import PropertyGallery from "@/components/estates/property-gallery";
import PropertyChat from "@/components/estates/property-chat";
import { Loader2, User, CheckCircle2, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsProps {
  slug: string;
}

export function PropertyDetails({ slug }: PropertyDetailsProps) {
  const t = useTranslations("properties");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const { data: property, isLoading, error } = usePropertyBySlug(slug);
  const { data: similarProperties } = useSimilarProperties(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-main-green" />
        <p className="font-medium text-gray-500">
          {t("loading") || "Loading property details..."}
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container space-y-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-main-navy">{t("not_found")}</h2>
        <p className="text-gray-600">{t("not_found_description")}</p>
      </div>
    );
  }

  const getName = (obj: unknown): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    if (typeof obj === "object" && obj !== null && "name" in obj) {
      return String((obj as { name?: string }).name || "");
    }
    return "";
  };

  const images = (property.images || []).filter(
    (img): img is string => typeof img === "string" && img.trim().length > 0,
  );
  const videos = (property.videos || []).filter(
    (vid): vid is string => typeof vid === "string" && vid.trim().length > 0,
  );

  return (
    <main className="container space-y-8 py-8">
      <CustomBreadcrumbs
        items={[
          { label: tBreadcrumbs("advertisements"), href: "/ads" },
          { label: property.title },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div className="space-y-8 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-4"
          >
            <motion.div className="relative group">
              <PropertyGallery images={images} videos={videos} />

              {property.isApproved && (
                <Badge className="absolute left-6 top-6 z-10 bg-main-green px-3 py-1 text-sm shadow-md">
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                  {t("verified") || "موثق"}
                </Badge>
              )}
              {property.status && (
                <Badge className="absolute right-6 top-6 z-10 bg-main-navy px-3 py-1 text-sm shadow-md">
                  {t(`status.${property.status}`)}
                </Badge>
              )}
            </motion.div>
          </motion.div>

          <PropertyInfo property={property} />
        </motion.div>

        <div className="sticky top-24 space-y-6">
          {property.user && (
            <div className="space-y-6 rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="border-b border-gray-100 pb-4 text-lg font-bold text-main-navy">
                {t("contact_info")}
              </h3>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-main-light-gray p-3">
                  <User className="h-8 w-8 text-main-navy" />
                </div>
                <div>
                  <p className="font-bold text-main-navy">{property.user.name}</p>
                  {property.user.role && (
                    <Badge variant="secondary" className="mt-1 text-[10px] uppercase">
                      {property.user.role}
                    </Badge>
                  )}
                </div>
              </div>

              {property.viewsCount !== undefined && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4 text-main-green" />
                  <span>
                    {property.viewsCount} {t("views")}
                  </span>
                </div>
              )}

              <PropertyChat
                propertyId={property.id}
                ownerId={property.user.id}
                owner={{
                  name: property.user.name || "Advertiser",
                  location: [
                    getName(property.city) || property.district,
                    getName(property.country),
                  ]
                    .filter(Boolean)
                    .join("، "),
                  image: property.user.image || "/images/logo.jpg",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {similarProperties && similarProperties.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-12">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900">
            {t("similar_properties")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarProperties.slice(0, 3).map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
