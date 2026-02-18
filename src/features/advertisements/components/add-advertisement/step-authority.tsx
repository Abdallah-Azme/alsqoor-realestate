"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MarketingOption } from "../../types/advertisement.types";
import { useRef } from "react";

interface StepAuthorityProps {
  values: {
    hasLicense?: boolean;
    license_number?: string;
    license_expiry_date?: string;
    qr_code?: File;
    plan_number?: string;
    plot_number?: string;
    area_name?: string;
    has_mortgage?: boolean;
    has_restriction?: boolean;
    guarantees?: string;
    marketing_option?: MarketingOption;
    is_featured?: boolean;
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
  const qrCodeInputRef = useRef<HTMLInputElement>(null);

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange("qr_code", file);
    }
  };

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
        <p className="text-sm text-gray-500">{t("authority.subtitle")}</p>
      </div>

      {/* License Number */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("authority.license_number_label")}
        </Label>
        <Input
          placeholder={t("authority.license_number_placeholder")}
          value={values.license_number || ""}
          onChange={(e) => onChange("license_number", e.target.value)}
        />
      </div>

      {/* License Expiry Date */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("authority.license_expiry_label")}
        </Label>
        <Input
          type="date"
          value={values.license_expiry_date || ""}
          onChange={(e) => onChange("license_expiry_date", e.target.value)}
        />
      </div>

      {/* QR Code Upload */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("authority.qr_code_label")}
        </Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            values.qr_code
              ? "border-main-green bg-main-green/5"
              : "border-gray-300 hover:border-gray-400",
          )}
          onClick={() => qrCodeInputRef.current?.click()}
        >
          {values.qr_code ? (
            <p className="text-sm text-main-green">{values.qr_code.name}</p>
          ) : (
            <p className="text-sm text-gray-500">
              {t("authority.qr_code_placeholder")}
            </p>
          )}
          <input
            ref={qrCodeInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleQrCodeUpload}
          />
        </div>
      </div>

      {/* Plan Number & Plot Number */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("authority.plan_number_label")}
          </Label>
          <Input
            placeholder={t("authority.plan_number_placeholder")}
            value={values.plan_number || ""}
            onChange={(e) => onChange("plan_number", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("authority.plot_number_label")}
          </Label>
          <Input
            placeholder={t("authority.plot_number_placeholder")}
            value={values.plot_number || ""}
            onChange={(e) => onChange("plot_number", e.target.value)}
          />
        </div>
      </div>

      {/* Area Name */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("authority.area_name_label")}
        </Label>
        <Input
          placeholder={t("authority.area_name_placeholder")}
          value={values.area_name || ""}
          onChange={(e) => onChange("area_name", e.target.value)}
        />
      </div>

      {/* Guarantees */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("authority.guarantees_label")}
        </Label>
        <Input
          placeholder={t("authority.guarantees_placeholder")}
          value={values.guarantees || ""}
          onChange={(e) => onChange("guarantees", e.target.value)}
        />
      </div>

      {/* Marketing Option */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("authority.marketing_option_label")}
        </Label>
        <Select
          value={values.marketing_option || "none"}
          onValueChange={(value) => onChange("marketing_option", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t("marketing_options.none")}</SelectItem>
            <SelectItem value="advertising">
              {t("marketing_options.advertising")}
            </SelectItem>
            <SelectItem value="agent">
              {t("marketing_options.agent")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <Checkbox
            id="has_mortgage"
            checked={values.has_mortgage || false}
            onCheckedChange={(checked) => onChange("has_mortgage", checked)}
          />
          <Label htmlFor="has_mortgage" className="text-sm text-gray-700">
            {t("authority.has_mortgage_label")}
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="has_restriction"
            checked={values.has_restriction || false}
            onCheckedChange={(checked) => onChange("has_restriction", checked)}
          />
          <Label htmlFor="has_restriction" className="text-sm text-gray-700">
            {t("authority.has_restriction_label")}
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="is_featured"
            checked={values.is_featured || false}
            onCheckedChange={(checked) => onChange("is_featured", checked)}
          />
          <Label htmlFor="is_featured" className="text-sm text-gray-700">
            {t("authority.is_featured_label")}
          </Label>
        </div>
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
