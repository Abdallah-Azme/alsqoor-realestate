import { Calendar, Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/features/settings/hooks/use-settings";

const DealsTable = ({ deals = [], isLoading = false, onEdit }) => {
  const t = useTranslations("deals_page");
  const { data: settings } = useSettings();
  const siteLogo = settings?.siteInfo?.siteLogo || "/images/logo.svg";

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 border rounded px-4 py-6 animate-pulse"
          >
            <div className="flex items-center gap-1">
              <div className="size-12 bg-gray-200 rounded" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="mt-8 text-center py-12 border rounded">
        <p className="text-gray-500">
          {t("no_deals") || "لا توجد صفقات متاحة حالياً"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="grid grid-cols-6 border rounded px-4 py-6 hover:shadow-md transition-shadow max-md:grid-cols-1 max-md:gap-4"
        >
          {/* Property Info */}
          <div className="flex items-center gap-1">
            <Image
              src={siteLogo}
              alt={deal.propertyType}
              width={50}
              height={50}
              className="size-12"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">{deal.propertyType}</h3>
              <p className="text-xs text-gray-500">
                {deal.city} - {deal.district}
              </p>
            </div>
          </div>

          {/* Area Range */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">{t("area")}</p>
            <p className="text-sm font-semibold">
              {deal.minArea} - {deal.maxArea} {t("sqm")}
            </p>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">{t("total_price")}</p>
            <p className="text-sm font-semibold">
              {deal.minTotalPrice.toLocaleString()} -{" "}
              {deal.maxTotalPrice.toLocaleString()} {t("sar")}
            </p>
          </div>

          {/* Price per Meter */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">{t("price_per_meter")}</p>
            <p className="text-sm font-semibold">
              {deal.minPricePerMeter.toLocaleString()} -{" "}
              {deal.maxPricePerMeter.toLocaleString()} {t("sar")}
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">{t("created_at")}</p>
            <p className="text-sm font-semibold flex items-center gap-1">
              <Calendar size={14} />
              {new Date(deal.createdAt).toLocaleDateString("ar-SA")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit && onEdit(deal);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={t("edit") || "تعديل الصفقة"}
            >
              <Pencil size={18} className="text-main-green" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DealsTable;
