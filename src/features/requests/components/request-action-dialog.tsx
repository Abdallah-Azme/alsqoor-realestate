"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRequestAction } from "../hooks/use-requests";
import { PropertyRequest } from "../types/request.types";
import { Loader2 } from "lucide-react";

interface RequestActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PropertyRequest | null;
}

export const RequestActionDialog = ({
  open,
  onOpenChange,
  request,
}: RequestActionDialogProps) => {
  const t = useTranslations("propertyRequestsPage");
  const tProfile = useTranslations("Profile");
  const [reason, setReason] = useState("");
  const actionMutation = useRequestAction();

  const handleCloseRequest = async () => {
    if (!request) return;
    await actionMutation.mutateAsync({
      id: request.id,
      data: {
        action: "close",
        cancel_reason_text: reason,
      },
    });
    onOpenChange(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("actions.close_request") || "إغلاق الطلب"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-500">
            {t("messages.close_confirm_desc") ||
              "هل تريد إغلاق هذا الطلب؟ يرجى ذكر السبب (اختياري)."}
          </p>
          <Textarea
            placeholder={
              t("fields.cancel_reason_placeholder") || "سبب الإغلاق..."
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {tProfile("cancel")}
          </Button>
          <Button
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            onClick={handleCloseRequest}
            disabled={actionMutation.isPending}
          >
            {actionMutation.isPending && (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            )}
            {t("actions.confirm_close") || "تأكيد الإغلاق"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
