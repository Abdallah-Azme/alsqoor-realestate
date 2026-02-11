"use client";

import { PropertyOffersList } from "@/features/offers/property-offers-index";

export default function OffersTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <PropertyOffersList />
    </div>
  );
}
