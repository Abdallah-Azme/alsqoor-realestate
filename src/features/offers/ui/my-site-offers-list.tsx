"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useUserOffers } from "../hooks/use-site-offers";
import { SiteOfferCard } from "./site-offer-card";
import { SiteOffer } from "../types/offer.types";
import { useState } from "react";
import { FiAlertCircle, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { CreateSiteOfferDialog } from "./create-site-offer-dialog";
import { useRouter } from "@/i18n/navigation";
import { getToken } from "@/services";

export function MySiteOffersList() {
  const t = useTranslations("offers_page");
  const { data, isLoading, error } = useUserOffers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const router = useRouter();

  const handleOpenAddDialog = async () => {
    const token = await getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsAddDialogOpen(true);
  };

  // Handle the response which is already unwrapped by api-client
  const offersList: SiteOffer[] = Array.isArray(data)
    ? data
    : (data as any)?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-main-green animate-spin mb-4" />
        <p className="text-gray-500">{t("loading") || "جاري تحميل عروضي..."}</p>
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
        <p>{t("error_fetch") || "حدث خطأ أثناء تحميل عروضك"}</p>
      </div>
    );
  }

  if (offersList.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t("no_offers") || "لا توجد عروض بعد"}
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          {t("no_my_offers_desc") || "لم تقم بإضافة أي عروض بعد."}
        </p>
        <Button
          onClick={handleOpenAddDialog}
          className="bg-main-green hover:bg-main-green/90 text-white gap-2"
        >
          <FiPlus />
          {t("add_offer") || "إضافة عرض"}
        </Button>

        <CreateSiteOfferDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-main-navy">
            {t("my_offers_title") || "عروضي الخاصة"}
          </h2>
          <span className="text-gray-500 text-sm">
            {offersList.length} {t("offers_count") || "عروض"}
          </span>
        </div>
        <Button
          onClick={handleOpenAddDialog}
          className="flex items-center gap-2 bg-main-green hover:bg-main-green/90 text-white"
        >
          <FiPlus />
          {t("add_offer") || "إضافة عرض"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
        {offersList.map((offer, idx) => (
          <SiteOfferCard key={offer.id} offer={offer} index={idx} />
        ))}
      </div>

      <CreateSiteOfferDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
