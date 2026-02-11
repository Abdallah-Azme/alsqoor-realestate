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
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <PropertyGallery
            images={property.images || []}
            title={property.title}
          />
          <div className="mt-6">
            <PropertyInfo property={property} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Submit Offer Button */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {tOffers("submit_offer")}
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                {tOffers("submit_offer_description")}
              </p>
              <Button
                onClick={() => setIsOfferDialogOpen(true)}
                className="w-full"
                size="lg"
              >
                <MessageSquare className="ml-2 h-5 w-5" />
                {tOffers("submit_offer")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties && similarProperties.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">{t("similar_properties")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarProperties.slice(0, 3).map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
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
  );
}
