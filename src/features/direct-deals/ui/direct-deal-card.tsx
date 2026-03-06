"use client";

import { DirectDeal } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ruler, Coins, Hash, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DirectDealCardProps {
  deal: DirectDeal;
  onEdit?: (deal: DirectDeal) => void;
}

export function DirectDealCard({ deal, onEdit }: DirectDealCardProps) {
  const t = useTranslations("deals_page");

  const getStatusBadge = () => {
    return (
      <Badge
        className={
          deal.isActive
            ? "bg-main-green/10 text-main-green"
            : "bg-gray-100 text-gray-800"
        }
      >
        {deal.isActive ? t("active") : t("inactive")}
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-gray-200 relative",
        !deal.isActive && "opacity-80",
      )}
    >
      {!deal.isActive && (
        <>
          <div className="absolute inset-0 bg-gray-200/40 z-10 pointer-events-none backdrop-grayscale-[0.5]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <Badge className="bg-red-500 text-white text-lg py-2 px-6 shadow-xl border-2 border-white">
              {t("inactive")}
            </Badge>
          </div>
        </>
      )}
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 relative z-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{deal.propertyType}</h3>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {new Date(deal.createdAt).toLocaleDateString("ar-SA")}
          </span>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-main-green"
              onClick={() => onEdit(deal)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
          <div className="text-sm">
            <span className="font-medium text-gray-700">
              {deal.city}, {deal.district}
            </span>
            <div className="text-gray-500">{deal.country}</div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="h-4 w-4 text-main-green" />
            <span>المخطط: {deal.planNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="h-4 w-4 text-main-green" />
            <span>القطعة: {deal.plotNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Ruler className="h-4 w-4 text-main-green" />
            <span>
              المساحة: {deal.minArea} - {deal.maxArea} م²
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Coins className="h-4 w-4 text-main-green" />
            <span>السعر: {deal.minTotalPrice.toLocaleString()} ريال</span>
          </div>
        </div>

        {/* Dates */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>البداية: {deal.startDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>النهاية: {deal.endDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
