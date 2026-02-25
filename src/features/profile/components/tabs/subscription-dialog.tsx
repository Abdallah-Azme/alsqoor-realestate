"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { usePaymentMethods } from "@/features/packages/hooks/use-payment";
import { useSubscribeToPackage } from "@/features/packages/hooks/use-packages";

interface SubscriptionDialogProps {
  packageId: string | number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDialog({
  packageId,
  open,
  onOpenChange,
}: SubscriptionDialogProps) {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: paymentMethods, isLoading: isLoadingMethods } =
    usePaymentMethods();
  const { mutate: subscribe, isPending } = useSubscribeToPackage();

  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);

  const handleSubscribe = () => {
    if (!packageId || !paymentMethodId) return;

    subscribe({
      packageId,
      paymentMethodId,
      period,
    });
  };

  // Reset state when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setPeriod("yearly");
      setPaymentMethodId(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("subscribe_to_package") || "Subscribe to Package"}
          </DialogTitle>
          <DialogDescription>
            {t("choose_payment_method") ||
              "Choose your preferred payment method and subscription period."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subscription Period */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              {t("subscription_period") || "Subscription Period"}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                  period === "monthly"
                    ? "border-main-green bg-green-50/50 text-main-green"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="period"
                  value="monthly"
                  className="sr-only"
                  checked={period === "monthly"}
                  onChange={() => setPeriod("monthly")}
                />
                {t("monthly") || "Monthly"}
              </label>

              <label
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                  period === "yearly"
                    ? "border-main-green bg-green-50/50 text-main-green"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="period"
                  value="yearly"
                  className="sr-only"
                  checked={period === "yearly"}
                  onChange={() => setPeriod("yearly")}
                />
                {t("yearly") || "Yearly"}
              </label>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              {t("payment_method") || "Payment Method"}
            </h4>

            {isLoadingMethods ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-main-green" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                {paymentMethods?.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      paymentMethodId === Number(method.paymentMethodId)
                        ? "border-main-green bg-green-50/50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.paymentMethodId}
                      className="text-main-green focus:ring-main-green mt-0.5"
                      checked={
                        paymentMethodId === Number(method.paymentMethodId)
                      }
                      onChange={() =>
                        setPaymentMethodId(Number(method.paymentMethodId))
                      }
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {isAr ? method.paymentMethodAr : method.paymentMethodEn}
                      </span>
                      {method.imageUrl && (
                        <div className="relative h-6 w-10 overflow-hidden rounded bg-transparent">
                          <Image
                            src={method.imageUrl}
                            alt={
                              isAr
                                ? method.paymentMethodAr
                                : method.paymentMethodEn
                            }
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={isPending || !paymentMethodId}
            className="bg-main-green hover:bg-green-700 text-white min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("confirm_subscription") || "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
