"use client";

import { useState } from "react";
import {
  usePropertyBySlug,
  useSimilarProperties,
} from "../../hooks/use-properties";
import { PropertyGallery } from "./property-gallery";
import { PropertyInfo } from "./property-info";
import { PropertyCard } from "../property-list/property-card";
import { SubmitOfferDialog } from "@/features/offers/property-offers-index";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface PropertyDetailsProps {
  slug: string;
}

export function PropertyDetails({ slug }: PropertyDetailsProps) {
  const t = useTranslations("properties");
  const tOffers = useTranslations("offers");
  const { data: property, isLoading, error } = usePropertyBySlug(slug);
  const { data: similarProperties } = useSimilarProperties(slug);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">{t("not_found")}</h1>
          <p className="text-muted-foreground">{t("not_found_description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">
              <PropertyGallery
                images={property.images || []}
                title={property.title}
              />
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <PropertyInfo property={property} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Submit Offer Button */}
              <div className="rounded-3xl border border-primary/10 bg-white p-8 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {tOffers("submit_offer")}
                  </h3>
                </div>
                <p className="mb-8 text-sm text-gray-500 leading-relaxed">
                  {tOffers("submit_offer_description")}
                </p>
                <Button
                  onClick={() => setIsOfferDialogOpen(true)}
                  className="w-full h-14 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95 bg-primary text-white rounded-2xl"
                  size="lg"
                >
                  {tOffers("submit_offer")}
                </Button>
              </div>

              {/* Extra Widget Example (Optional, helps fill space) */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2 italic">
                  <span>✨</span> {t("featured") || "مميز"}
                </h4>
                <p className="text-xs text-primary/80 leading-relaxed">
                  {t("featured_description") ||
                    "تم اختيار هذا العقار ليكون مميزاً بناءً على جودته وسعره المنافس."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties && similarProperties.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {t("similar_properties")}
              </h2>
              <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-gray-200 to-transparent rounded-full hidden md:block"></div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarProperties.slice(0, 3).map((prop) => (
                <div
                  key={prop.id}
                  className="transition-transform duration-300 hover:-translate-y-2"
                >
                  <PropertyCard property={prop} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Offer Dialog */}
        <SubmitOfferDialog
          open={isOfferDialogOpen}
          onOpenChange={setIsOfferDialogOpen}
          propertyId={property.id}
          propertyTitle={property.title}
        />
      </div>
    </div>
  );
}
