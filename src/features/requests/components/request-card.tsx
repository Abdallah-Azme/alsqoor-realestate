"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  FiClock,
  FiMapPin,
  FiPhone,
  FiSend,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyRequest } from "../types/request.types";
import { useDeleteRequest } from "../hooks/use-requests";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: PropertyRequest;
  onEdit?: (request: PropertyRequest) => void;
  onView?: (request: PropertyRequest) => void;
  onAction?: (request: PropertyRequest) => void;
}

export const RequestCard = ({
  request,
  onEdit,
  onView,
  onAction,
}: RequestCardProps) => {
  const t = useTranslations("propertyRequestsPage");
  const tProfile = useTranslations("Profile");
  const tOffers = useTranslations("offers");
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const deleteMutation = useDeleteRequest();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(request.id);
    setDeleteConfirmOpen(false);
  };

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
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader className={cn("pb-3 flex flex-row items-center justify-between space-y-0", isRtl ? "flex-row-reverse" : "flex-row")}>
        <div className={cn(isRtl ? "text-right" : "text-left")}>
          <Badge variant="outline" className={getStatusColor(request.status)}>
            {request.statusLabel}
          </Badge>
          <CardTitle className="mt-2 text-lg font-bold">
            {request.requestNumber}
          </CardTitle>
        </div>
        <div className="flex gap-1">
          {request.status !== "pending" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <div className={cn("flex items-center gap-2 text-sm text-gray-600", isRtl ? "flex-row-reverse" : "flex-row")}>
            <FiSend className="h-4 w-4 text-main-green" />
            <span>{request.requestTypeLabel}</span>
          </div>
          <div className={cn("flex items-center gap-2 text-sm text-gray-600", isRtl ? "flex-row-reverse" : "flex-row")}>
            <FiMapPin className="h-4 w-4 text-main-green" />
            <span className="truncate">
              {request.city.name}, {request.district}
            </span>
          </div>
          <div className={cn("flex items-center gap-2 text-sm text-gray-600", isRtl ? "flex-row-reverse" : "flex-row")}>
            <FiClock className="h-4 w-4 text-main-green" />
            <span>
              {new Date(request.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
            </span>
          </div>
          <div className={cn("flex items-center gap-2 text-sm text-gray-600", isRtl ? "flex-row-reverse" : "flex-row")}>
            <span className="font-semibold text-main-navy">
              {request.budgetAmount
                ? `${Number(request.budgetAmount).toLocaleString(locale)} ${tOffers("sar")}`
                : request.budgetTypeLabel}
            </span>
          </div>
        </div>

        {request.details && (
          <p className={cn("mt-3 text-sm text-gray-500 line-clamp-2", isRtl ? "text-right" : "text-left")}>
            {request.details}
          </p>
        )}
      </CardContent>

      <CardFooter className={cn("bg-gray-50/50 pt-4 flex flex-wrap gap-2", isRtl ? "flex-row-reverse" : "flex-row")}>
        <Button
          variant="outline"
          className="flex-1 min-w-[110px] text-sm h-9"
          onClick={() => onView?.(request)}
        >
          <FiInfo className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
          {t("actions.view")}
        </Button>

        {request.status !== "closed" && request.status !== "pending" && (
          <>
            <Button
              variant="outline"
              className="flex-1 min-w-[110px] text-sm h-9 text-main-green border-main-green hover:bg-main-green/5"
              onClick={() => onEdit?.(request)}
            >
              {t("actions.edit")}
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[110px] text-sm h-9 text-orange-600 border-orange-200 hover:bg-orange-50"
              onClick={() => onAction?.(request)}
            >
              {t("actions.close")}
            </Button>
          </>
        )}

        {request.status === "pending" && (
          <div className={cn("flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50/50 rounded-lg text-xs text-blue-600 border border-blue-100 italic", isRtl ? "flex-row-reverse" : "flex-row")}>
            <FiInfo className="h-3 w-3" />
            <span>
              {t("messages.pending_no_actions")}
            </span>
          </div>
        )}
      </CardFooter>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md" dir={isRtl ? "rtl" : "ltr"}>
          <DialogHeader className={cn(isRtl ? "text-right" : "text-left")}>
            <DialogTitle>
              {t("messages.delete_confirm_title")}
            </DialogTitle>
            <DialogDescription>
              {t("messages.delete_confirm_desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={cn("flex gap-2 justify-end", isRtl ? "flex-row-reverse" : "flex-row")}>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              {tProfile("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "mr-2")} />
              )}
              {tProfile("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
