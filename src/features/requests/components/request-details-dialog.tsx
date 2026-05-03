"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyRequest } from "../types/request.types";
import { Badge } from "@/components/ui/badge";
import {
  FiClock,
  FiMapPin,
  FiPhone,
  FiSend,
  FiFileText,
  FiTag,
  FiDollarSign,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

interface RequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PropertyRequest | null;
}

export const RequestDetailsDialog = ({
  open,
  onOpenChange,
  request,
}: RequestDetailsDialogProps) => {
  const t = useTranslations("propertyRequestsPage");
  const tProps = useTranslations("properties");
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (!request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader className={cn(isRtl ? "text-right" : "text-left")}>
          <div className={cn("flex items-center justify-between mb-2", )}>
            <Badge variant="outline" className={getStatusColor(request.status)}>
              {request.statusLabel}
            </Badge>
            <span className="text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold">
            {request.requestNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div className={cn("space-y-1", isRtl ? "text-right" : "text-left")}>
              <p className="text-xs text-gray-400">
                {t("fields.request_type")}
              </p>
              <div className={cn("flex items-center gap-2", )}>
                <FiSend className="text-main-green h-4 w-4" />
                <span className="font-semibold">
                  {request.requestTypeLabel}
                </span>
              </div>
            </div>
            <div className={cn("space-y-1", isRtl ? "text-right" : "text-left")}>
              <p className="text-xs text-gray-400">
                {t("fields.payment_method")}
              </p>
              <div className={cn("flex items-center gap-2", )}>
                <FiDollarSign className="text-main-green h-4 w-4" />
                <span className="font-semibold">
                  {request.paymentMethodLabel}
                </span>
              </div>
            </div>
            <div className={cn("space-y-1", isRtl ? "text-right" : "text-left")}>
              <p className="text-xs text-gray-400">{t("fields.area")}</p>
              <div className={cn("flex items-center gap-2", )}>
                <FiTag className="text-main-green h-4 w-4" />
                <span className="font-semibold">{Number(request.area).toLocaleString(locale)} {tProps("sqm")}</span>
              </div>
            </div>
            <div className={cn("space-y-1", isRtl ? "text-right" : "text-left")}>
              <p className="text-xs text-gray-400">
                {t("fields.property_age")}
              </p>
              <div className={cn("flex items-center gap-2", )}>
                <FiTag className="text-main-green h-4 w-4" />
                <span className="font-semibold">
                  {Number(request.propertyAge).toLocaleString(locale)} {tProps("years")}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className={cn("font-bold flex items-center gap-2", )}>
                <FiMapPin className="text-main-green" />
                {tProps("location")}
              </h4>
              <p className={cn("text-sm text-gray-600", isRtl ? "pe-6 text-right" : "ps-6 text-left")}>
                {request.country.name} - {request.city.name}
              </p>
              <p className={cn("text-sm text-gray-600", isRtl ? "pe-6 text-right" : "ps-6 text-left")}>{request.district}</p>
            </div>
            <div className="space-y-3">
              <h4 className={cn("font-bold flex items-center gap-2", )}>
                <FiPhone className="text-main-green" />
                {t("contact_info")}
              </h4>
              <p className={cn("text-sm text-gray-600", isRtl ? "pe-6 text-right" : "ps-6 text-left")}>
                {t("fields.whatsapp")}: {request.whatsapp}
              </p>
              <p className={cn("text-sm text-gray-600", isRtl ? "pe-6 text-right" : "ps-6 text-left")}>
                {t("fields.telegram")}: {request.telegram}
              </p>
            </div>
          </div>

          {/* Details & Offer */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className={cn("font-bold flex items-center gap-2", )}>
                <FiFileText className="text-main-green" />
                {t("fields.details")}
              </h4>
              <p className={cn("text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg", isRtl ? "text-right" : "text-left")}>
                {request.details}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className={cn("font-bold flex items-center gap-2", )}>
                <FiFileText className="text-main-green" />
                {t("fields.offer")}
              </h4>
              <p className={cn("text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg", isRtl ? "text-right" : "text-left")}>
                {request.offer}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
