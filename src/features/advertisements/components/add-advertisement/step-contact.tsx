"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FiPhone, FiMessageSquare, FiMessageCircle } from "react-icons/fi";
import { ContactMethod } from "../../types/advertisement.types";
import { cn } from "@/lib/utils";

interface StepContactProps {
  values: {
    contactMethods?: ContactMethod[];
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONTACT_OPTIONS: {
  value: ContactMethod;
  icon: React.ElementType;
  color: string;
}[] = [
  { value: "phone", icon: FiPhone, color: "bg-blue-100 text-blue-600" },
  {
    value: "whatsapp",
    icon: FiMessageSquare,
    color: "bg-green-100 text-green-600",
  },
  {
    value: "chat",
    icon: FiMessageCircle,
    color: "bg-purple-100 text-purple-600",
  },
];

const StepContact = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepContactProps) => {
  const t = useTranslations("advertisements.wizard");
  const tContact = useTranslations("advertisements.contact_methods");

  const toggleMethod = (method: ContactMethod) => {
    const current = values.contactMethods || [];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    onChange("contactMethods", updated);
  };

  const isValid = values.contactMethods && values.contactMethods.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="py-6 px-4"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-main-navy mb-2">
          {t("contact.title")}
        </h2>
        <p className="text-gray-500 text-sm">{t("contact.description")}</p>
      </div>

      {/* Contact Methods */}
      <div className="space-y-4 mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("contact.methods_label")}
        </Label>

        {CONTACT_OPTIONS.map((option) => {
          const isSelected = (values.contactMethods || []).includes(
            option.value,
          );
          const Icon = option.icon;

          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleMethod(option.value)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-main-green bg-main-green/5"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  option.color,
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {tContact(`${option.value}.title`)}
                </h3>
                <p className="text-sm text-gray-500">
                  {tContact(`${option.value}.description`)}
                </p>
              </div>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleMethod(option.value)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 py-6">
          {t("common.back")}
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 disabled:opacity-50"
        >
          {t("common.next")}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepContact;
