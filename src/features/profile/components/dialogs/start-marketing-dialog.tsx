"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/navigation";
import { FiCheck, FiPackage, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

interface StartMarketingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: number | null;
}

type Step = "confirm" | "terms" | "package";

const StartMarketingDialog = ({
  open,
  onOpenChange,
  propertyId,
}: StartMarketingDialogProps) => {
  const t = useTranslations("broker_properties.marketing_dialog");
  const [currentStep, setCurrentStep] = useState<Step>("confirm");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCurrentStep("confirm");
      setTermsAccepted(false);
      setIsLoading(false);
    }
    onOpenChange(newOpen);
  };

  // Move to next step
  const handleNext = () => {
    if (currentStep === "confirm") {
      setCurrentStep("terms");
    } else if (currentStep === "terms" && termsAccepted) {
      // Check if user has active package subscription
      // For now, we'll simulate checking and show package step
      setCurrentStep("package");
    }
  };

  // Move to previous step
  const handleBack = () => {
    if (currentStep === "terms") {
      setCurrentStep("confirm");
    } else if (currentStep === "package") {
      setCurrentStep("terms");
    }
  };

  // Handle final confirmation (after subscription)
  const handleConfirmMarketing = async () => {
    if (!propertyId) return;
    setIsLoading(true);

    try {
      // TODO: Call API to start marketing
      // await propertiesService.startMarketing(propertyId);
      console.log("Starting marketing for property:", propertyId);

      // Success - close dialog
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to start marketing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "confirm":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-main-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-main-green" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("confirm_title")}
              </h3>
              <p className="text-gray-600">{t("confirm_description")}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">
                {t("benefits_title")}
              </h4>
              <ul className="space-y-2">
                {["benefit_1", "benefit_2", "benefit_3"].map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <FiCheck className="text-main-green flex-shrink-0" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );

      case "terms":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-gray-900 mb-3">
                {t("terms_title")}
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>{t("terms_content_1")}</p>
                <p>{t("terms_content_2")}</p>
                <p>{t("terms_content_3")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
                {t("accept_terms")}
              </label>
            </div>
          </motion.div>
        );

      case "package":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("package_required_title")}
              </h3>
              <p className="text-gray-600">
                {t("package_required_description")}
              </p>
            </div>

            <div className="bg-main-green/5 border border-main-green/20 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-4">
                {t("package_cta_text")}
              </p>
              <Link href="/packages">
                <Button className="w-full bg-main-green hover:bg-main-green/90 text-white">
                  {t("view_packages")}
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 text-center">
              {t("package_note")}
            </p>
          </motion.div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("step", {
              current:
                currentStep === "confirm" ? 1 : currentStep === "terms" ? 2 : 3,
              total: 3,
            })}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

        <DialogFooter className="flex gap-2 sm:justify-between">
          {currentStep !== "confirm" && (
            <Button variant="outline" onClick={handleBack} className="gap-1">
              <FiArrowRight className="rotate-180" />
              {t("back")}
            </Button>
          )}

          {currentStep === "confirm" && (
            <Button
              onClick={handleNext}
              className="w-full bg-main-green hover:bg-main-green/90 text-white gap-1"
            >
              {t("next")}
              <FiArrowLeft className="rotate-180" />
            </Button>
          )}

          {currentStep === "terms" && (
            <Button
              onClick={handleNext}
              disabled={!termsAccepted}
              className="bg-main-green hover:bg-main-green/90 text-white gap-1 disabled:opacity-50"
            >
              {t("agree_and_continue")}
              <FiArrowLeft className="rotate-180" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartMarketingDialog;
