"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface StepLicenseProps {
  value: boolean | null;
  onChange: (hasLicense: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepLicense = ({ value, onChange, onNext, onBack }: StepLicenseProps) => {
  const t = useTranslations("advertisements.wizard");

  const options = [
    {
      value: true,
      label: t("license.has_license"),
      description: t("license.has_license_desc"),
    },
    {
      value: false,
      label: t("license.no_license"),
      description: t("license.no_license_desc"),
      highlighted: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="py-6 px-4"
    >
      {/* Header */}
      <div className="text-end mb-6">
        <span className="text-gray-500 text-sm">{t("license.step_label")}</span>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {options.map((option) => (
          <motion.button
            key={String(option.value)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(option.value)}
            className={cn(
              "w-full p-4 rounded-lg border-2 text-start transition-all duration-200",
              value === option.value
                ? "border-main-green bg-main-green/5"
                : option.highlighted
                  ? "border-main-green bg-main-light-green"
                  : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex items-start gap-4">
              {/* Radio indicator */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                  value === option.value
                    ? "border-main-green bg-main-green"
                    : "border-gray-300",
                )}
              >
                {value === option.value && (
                  <FiCheck className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 py-6">
          {t("common.back")}
        </Button>
        <Button
          onClick={onNext}
          disabled={value === null}
          className="flex-1 bg-main-green hover:bg-main-green/90 text-white font-semibold py-6 disabled:opacity-50"
        >
          {t("common.next")}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepLicense;
