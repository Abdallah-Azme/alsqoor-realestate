"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useSiteOffers } from "../hooks/use-site-offers";
import { SiteOfferCard } from "./site-offer-card";
import { SiteOffer } from "../types/offer.types";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiAlertCircle, FiPlus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateSiteOfferDialog } from "./create-site-offer-dialog";

export function SiteOffersList() {
  const t = useTranslations("offers_page");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useSiteOffers({
    search: debouncedSearch || undefined,
  });

  // Handle the response which is already unwrapped by api-client if it's in { data: [...] }
  // or if the backend returns { data: { data: [...] } } handled by the list component.
  // Based on the api-client.ts logic: if responseData.data exists, it returns it.
  const offersList: SiteOffer[] = Array.isArray(data)
    ? data
    : (data as any)?.data || [];

  if (isLoading && !debouncedSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-main-green animate-spin mb-4" />
        <p className="text-gray-500">
          {t("loading") || "جاري تحميل العروض..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center">
        <FiAlertCircle className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">
          {t("error_title") || "حدث خطأ ما"}
        </h3>
        <p>{t("error_fetch") || "حدث خطأ أثناء تحميل العروض"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-main-navy">
            {t("title") || "العروض"}
          </h2>
          <p className="text-sm text-gray-500">
            {t("subtitle", { count: offersList.length }) ||
              `يوجد لدينا ${offersList.length} عرض متاح`}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("search_placeholder") || "بحث في العروض..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 bg-main-green hover:bg-main-green/90 text-white"
          >
            <FiPlus />
            {t("add_offer") || "إضافة عرض"}
          </Button>
        </div>
      </div>

      {offersList.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("no_offers") || "لا توجد عروض بعد"}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            {t("no_offers_desc") || "قريبا سيتم إضافة عروض جديدة مميزة."}
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-main-green hover:bg-main-green/90 text-white gap-2"
          >
            <FiPlus />
            {t("add_offer") || "إضافة عرض"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {offersList.map((offer, idx) => (
            <SiteOfferCard key={offer.id} offer={offer} index={idx} />
          ))}
        </div>
      )}

      <CreateSiteOfferDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
