"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { DirectDeal } from "../types";
import { DirectDealForm } from "./direct-deal-form";

interface DirectDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: DirectDeal | null;
}

export function DirectDealDialog({
  open,
  onOpenChange,
  deal,
}: DirectDealDialogProps) {
  const t = useTranslations("deals_page");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {deal ? t("edit_deal") : t("new_deal")}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-6">
              <DirectDealForm
                deal={deal}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
