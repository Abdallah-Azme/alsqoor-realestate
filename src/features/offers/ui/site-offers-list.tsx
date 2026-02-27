"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useSiteOffers } from "../hooks/use-site-offers";
import { SiteOfferCard } from "./site-offer-card";
import { SiteOffer } from "../types/offer.types";

export function SiteOffersList() {
  const t = useTranslations("packages_page");
  const { data, isLoading, error } = useSiteOffers();

  // Handle the response which wraps data inside { data: SiteOffer[] }
  const responseData: any = data;
  const offersList: SiteOffer[] = responseData?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-main-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-red-50 p-4 mb-4">
          <Loader2 className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-main-navy mb-2">{t("error")}</h3>
        <p className="max-w-md text-gray-500">
          We encountered an error while trying to fetch the latest offers.
        </p>
      </div>
    );
  }

  if (offersList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {t("no_packages") || "No offers available."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {offersList.map((offer, idx) => (
        <SiteOfferCard key={offer.id} offer={offer} index={idx} />
      ))}
    </div>
  );
}
