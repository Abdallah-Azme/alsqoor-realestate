"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserPropertyOffers } from "../hooks/use-property-offers";
import { PropertyOfferCard } from "./property-offer-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { OfferStatus } from "../types/offer.types";

export function AllPropertyOffers() {
  const t = useTranslations("offers");
  const { data: offers, isLoading, error } = useUserPropertyOffers();
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "all">("all");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{t("error_loading")}</p>
      </div>
    );
  }

  // Filter all offers by status
  const filteredOffers =
    statusFilter === "all"
      ? offers || []
      : (offers || []).filter((offer) => offer.status === statusFilter);

  // Determine offer type based on sender/receiver
  const getOfferType = (offer: any): "sent" | "received" => {
    return offer.sender ? "sent" : "received";
  };

  return (
    <div className="space-y-6">
      {/* Header with Status Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as OfferStatus | "all")
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="pending">{t("status.pending")}</SelectItem>
            <SelectItem value="accepted">{t("status.accepted")}</SelectItem>
            <SelectItem value="rejected">{t("status.rejected")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* All Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("no_offers")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <PropertyOfferCard
              key={offer.id}
              offer={offer}
              type={getOfferType(offer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
