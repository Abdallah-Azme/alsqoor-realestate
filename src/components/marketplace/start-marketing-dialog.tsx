"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FiCheck } from "react-icons/fi";

interface StartMarketingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: {
    id: string;
    title: string;
    commissionPercentage: number;
  };
  onConfirm: () => void;
}

const StartMarketingDialog = ({
  open,
  onOpenChange,
  property,
  onConfirm,
}: StartMarketingDialogProps) => {
  const t = useTranslations("marketplace.marketing_dialog");
  const [step, setStep] = useState(1);
  const [acceptCommission, setAcceptCommission] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && acceptCommission && acceptTerms) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        onConfirm();
        onOpenChange(false);
        // Reset state
        setStep(1);
        setAcceptCommission(false);
        setAcceptTerms(false);
      }, 1000);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setStep(1);
      setAcceptCommission(false);
      setAcceptTerms(false);
    }, 300);
  };

  const serviceSteps = [
    t("step_1"),
    t("step_2"),
    t("step_3"),
    t("step_4"),
    t("step_5"),
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {step === 1 ? t("title") : t("confirm_title")}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Service explanation */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                {serviceSteps.map((stepText, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-blue-800"
                  >
                    <FiCheck className="shrink-0 mt-0.5 text-blue-600" />
                    <span>{stepText}</span>
                  </div>
                ))}
              </div>

              {/* Commission info */}
              <div className="bg-main-green/5 border border-main-green/20 rounded-lg p-3 text-center">
                <p className="text-sm text-main-green">
                  {t("commission_note", {
                    percentage: property.commissionPercentage,
                  })}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Agreement checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="accept-commission"
                    checked={acceptCommission}
                    onCheckedChange={(checked) =>
                      setAcceptCommission(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="accept-commission"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {t("accept_commission", {
                      percentage: property.commissionPercentage,
                    })}
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="accept-terms"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {t("accept_terms")}
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          {step === 2 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              {t("back")}
            </Button>
          )}
          <Button
            className="flex-1 bg-main-green hover:bg-main-green/90 text-white"
            onClick={handleNext}
            disabled={step === 2 && (!acceptCommission || !acceptTerms)}
          >
            {isSubmitting
              ? t("submitting")
              : step === 1
                ? t("next")
                : t("confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartMarketingDialog;
