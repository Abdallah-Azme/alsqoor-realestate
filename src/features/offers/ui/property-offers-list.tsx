"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserPropertyOffers } from "../hooks/use-property-offers";
import { PropertyOfferCard } from "./property-offer-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PropertyOffer, OfferStatus } from "../types/offer.types";

export function PropertyOffersList() {
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

  // Separate sent and received offers
  const sentOffers = offers?.filter((offer) => offer.sender) || [];
  const receivedOffers = offers?.filter((offer) => offer.receiver) || [];

  // Filter by status
  const filterOffers = (offersList: PropertyOffer[]) => {
    if (statusFilter === "all") return offersList;
    return offersList.filter((offer) => offer.status === statusFilter);
  };

  const filteredSentOffers = filterOffers(sentOffers);
  const filteredReceivedOffers = filterOffers(receivedOffers);

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("my_offers")}</h2>
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

      {/* Tabs for Sent/Received */}
      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent">
            {t("sent_offers")} ({filteredSentOffers.length})
          </TabsTrigger>
          <TabsTrigger value="received">
            {t("received_offers")} ({filteredReceivedOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-6">
          {filteredSentOffers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("no_sent_offers")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSentOffers.map((offer) => (
                <PropertyOfferCard key={offer.id} offer={offer} type="sent" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="received" className="mt-6">
          {filteredReceivedOffers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("no_received_offers")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReceivedOffers.map((offer) => (
                <PropertyOfferCard
                  key={offer.id}
                  offer={offer}
                  type="received"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
