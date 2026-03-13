"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useSubmitOfferMutation } from "../hooks/use-property-offers";

interface StartMarketingDialogProps {
  propertyId: number | string;
  commissionPercentage?: string | number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StartMarketingDialog = ({
  propertyId,
  commissionPercentage,
  open,
  onOpenChange,
}: StartMarketingDialogProps) => {
  const t = useTranslations("marketplace.marketing_dialog");
  const [step, setStep] = useState(1);
  const [offerDetails, setOfferDetails] = useState(
    t("default_offer_details") || "أرغب ببدء تسويق هذا العقار والتعاون معكم لإتمام الصفقة."
  );
  const [acceptedCommission, setAcceptedCommission] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: submitOffer, isPending } = useSubmitOfferMutation();

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (offerDetails.trim().length < 10) {
      setValidationError(t("offer_details_min") || "Offer details must be at least 10 characters");
      return;
    }

    setValidationError(null);

    if (!acceptedCommission || !acceptedTerms) {
      return;
    }

    submitOffer(
      {
        property_new_id: propertyId,
        offer_details: offerDetails,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          // Wait for animation to finish before resetting
          setTimeout(() => {
            setStep(1);
            setAcceptedCommission(false);
            setAcceptedTerms(false);
            setValidationError(null);
          }, 300);
        },
      }
    );
  };

  const steps = [
    t("step_1"),
    t("step_2"),
    t("step_3"),
    t("step_4"),
    t("step_5"),
  ].filter((s) => typeof s === "string" && s.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main-navy">
            {step === 1 ? t("title") : t("confirm_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {steps.map((text, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-main-green/10 text-main-green text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              
              {commissionPercentage && (
                <div className="bg-main-green/5 p-3 rounded-lg border border-main-green/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-main-green shrink-0" />
                  <p className="text-sm font-medium text-main-navy">
                    {t("commission_note", { percentage: commissionPercentage })}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offer_details" className="text-main-navy font-bold">
                  {t("offer_details") || "تفاصيل العرض"}
                </Label>
                <Textarea
                  id="offer_details"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  placeholder={t("offer_details_placeholder")}
                  className="min-h-[100px] border-gray-200 focus:border-main-green focus:ring-main-green"
                />
                {validationError && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {validationError}
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="accept_commission"
                    checked={acceptedCommission}
                    onCheckedChange={(checked) => setAcceptedCommission(!!checked)}
                    className="mt-1 data-[state=checked]:bg-main-green data-[state=checked]:border-main-green"
                  />
                  <Label
                    htmlFor="accept_commission"
                    className="text-xs text-gray-500 leading-relaxed cursor-pointer font-medium"
                  >
                    {t("accept_commission", { percentage: commissionPercentage || "2.5" })}
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="accept_terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                    className="mt-1 data-[state=checked]:bg-main-green data-[state=checked]:border-main-green"
                  />
                  <Label
                    htmlFor="accept_terms"
                    className="text-xs text-gray-500 leading-relaxed cursor-pointer font-medium"
                  >
                    {t("accept_terms")}
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step === 2 && (
              <Button
                variant="outline"
                className="flex-1 h-11 font-bold border-gray-200"
                onClick={() => setStep(1)}
                disabled={isPending}
              >
                {t("back")}
              </Button>
            )}
            <Button
              className="flex-1 h-11 font-bold bg-main-green hover:bg-main-green/90"
              onClick={handleConfirm}
              disabled={isPending || (step === 2 && (!acceptedCommission || !acceptedTerms))}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 1 ? t("next") : t("confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
