"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiCheck, FiUsers } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface StepAuthorityProps {
  values: {
    hasLicense?: boolean;
    licenseNumber?: string;
    advertiserId?: string;
    advertiserIdType?: string;
    wantsBrokerContract?: boolean;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAuthority = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepAuthorityProps) => {
  const t = useTranslations("advertisements.wizard");

  // Skip this step if user has license
  const showLicenseFields = !values.hasLicense;

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
          {t("authority.title")}
        </h2>
      </div>

      {/* License Registration Fields (only if no license) */}
      {showLicenseFields && (
        <div className="space-y-4 mb-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("authority.license_number_label")}
            </Label>
            <Input
              placeholder={t("authority.license_number_placeholder")}
              value={values.licenseNumber || ""}
              onChange={(e) => onChange("licenseNumber", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("authority.advertiser_id_type_label")}
            </Label>
            <Select
              value={values.advertiserIdType}
              onValueChange={(value) => onChange("advertiserIdType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("authority.select_id_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national_id">
                  {t("authority.id_types.national_id")}
                </SelectItem>
                <SelectItem value="iqama">
                  {t("authority.id_types.iqama")}
                </SelectItem>
                <SelectItem value="commercial_register">
                  {t("authority.id_types.commercial_register")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("authority.advertiser_id_label")}
            </Label>
            <Input
              placeholder={t("authority.advertiser_id_placeholder")}
              value={values.advertiserId || ""}
              onChange={(e) => onChange("advertiserId", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Broker Contract Options */}
      <div className="space-y-4 mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("authority.broker_options_label")}
        </Label>

        {/* Option 1: Self Marketing */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onChange("wantsBrokerContract", false)}
          className={cn(
            "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
            !values.wantsBrokerContract
              ? "border-main-green bg-main-green/5"
              : "border-gray-200 hover:border-gray-300",
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              !values.wantsBrokerContract
                ? "border-main-green bg-main-green"
                : "border-gray-300",
            )}
          >
            {!values.wantsBrokerContract && (
              <FiCheck className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t("authority.self_marketing_title")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("authority.self_marketing_desc")}
            </p>
          </div>
        </motion.div>

        {/* Option 2: Broker Contract */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onChange("wantsBrokerContract", true)}
          className={cn(
            "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
            values.wantsBrokerContract
              ? "border-main-green bg-main-green/5"
              : "border-gray-200 hover:border-gray-300",
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              values.wantsBrokerContract
                ? "border-main-green bg-main-green"
                : "border-gray-300",
            )}
          >
            {values.wantsBrokerContract && (
              <FiCheck className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FiUsers className="text-main-green" />
              <h3 className="font-semibold text-gray-900">
                {t("authority.broker_contract_title")}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {t("authority.broker_contract_desc")}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 py-6">
          {t("common.back")}
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-main-green hover:bg-main-green/90 text-white font-semibold py-6"
        >
          {t("common.next")}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepAuthority;
