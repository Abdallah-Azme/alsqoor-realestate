"use client";

import { useTranslations } from "next-intl";
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className={getStatusColor(request.status)}>
              {request.statusLabel}
            </Badge>
            <span className="text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleDateString("ar-SA", {
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
            <div className="space-y-1">
              <p className="text-xs text-gray-400">
                {t("fields.request_type")}
              </p>
              <div className="flex items-center gap-2">
                <FiSend className="text-main-green h-4 w-4" />
                <span className="font-semibold">
                  {request.requestTypeLabel}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">
                {t("fields.payment_method")}
              </p>
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-main-green h-4 w-4" />
                <span className="font-semibold">
                  {request.paymentMethodLabel}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">{t("fields.area")}</p>
              <div className="flex items-center gap-2">
                <FiTag className="text-main-green h-4 w-4" />
                <span className="font-semibold">{request.area} م²</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">
                {t("fields.property_age")}
              </p>
              <div className="flex items-center gap-2">
                <FiTag className="text-main-green h-4 w-4" />
                <span className="font-semibold">
                  {request.propertyAge} سنوات
                </span>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <FiMapPin className="text-main-green" />
                {t("add_dialog.location") || "الموقع"}
              </h4>
              <p className="text-sm text-gray-600 ps-6">
                {request.country.name} - {request.city.name}
              </p>
              <p className="text-sm text-gray-600 ps-6">{request.district}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <FiPhone className="text-main-green" />
                {t("contact_info") || "معلومات التواصل"}
              </h4>
              <p className="text-sm text-gray-600 ps-6">
                واتساب: {request.whatsapp}
              </p>
              <p className="text-sm text-gray-600 ps-6">
                تيليجرام: {request.telegram}
              </p>
            </div>
          </div>

          {/* Details & Offer */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2">
                <FiFileText className="text-main-green" />
                {t("fields.details")}
              </h4>
              <p className="text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg">
                {request.details}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2">
                <FiFileText className="text-main-green" />
                {t("fields.offer")}
              </h4>
              <p className="text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg">
                {request.offer}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
