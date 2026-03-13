"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useSiteOffers } from "../hooks/use-site-offers";
import { SiteOfferCard } from "./site-offer-card";
import { SiteOffer } from "../types/offer.types";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiAlertCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";

export function SiteOffersList() {
  const t = useTranslations("offers_page");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

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

  console.log({ offersList });

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-main-navy">
            {t("all_offers") || "جميع العروض"}
          </h3>
          <p className="text-sm text-gray-500">
            {t("subtitle", { count: offersList.length }) ||
              `يوجد لدينا ${offersList.length} عرض متاح حالياً`}
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-main-green transition-colors duration-300" />
          <Input
            placeholder={t("search_placeholder") || "بحث في العروض..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pr-12 pl-12 bg-gray-50 border-transparent focus:bg-white focus:border-main-green/20 rounded-xl transition-all duration-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-main-navy transition-colors duration-300"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {offersList.length === 0 ? (
        <div className="bg-white border text-center border-gray-100 rounded-3xl p-16 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-main-navy mb-2">
            {t("no_offers") || "لا توجد عروض بعد"}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {t("no_offers_desc") || "سيتم إضافة عروض جديدة ومميزة قريباً في هذه الصفحة."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {offersList.map((offer, idx) => (
            <SiteOfferCard key={offer.id} offer={offer} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
