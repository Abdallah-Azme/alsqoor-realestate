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
import { FiSearch, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { AdType, PropertyUse } from "../../types/advertisement.types";
import { useCategories } from "@/features/properties/hooks/use-properties";
import { useState } from "react";

interface StepPropertyTypeProps {
  values: {
    category_id?: number | string;
    operation_type?: AdType;
    property_use?: PropertyUse;
  };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
  onBack: () => void;
}

// Property use options with icons
const PROPERTY_USE_OPTIONS: { value: PropertyUse; icon: string }[] = [
  { value: "apartment", icon: "🏢" },
  { value: "villa", icon: "🏠" },
  { value: "land_residential", icon: "🏗️" },
  { value: "land_commercial", icon: "🏬" },
  { value: "commercial_shop", icon: "🏪" },
  { value: "office", icon: "🏛️" },
  { value: "warehouse", icon: "🏭" },
  { value: "building", icon: "🏗️" },
  { value: "farm", icon: "🌾" },
  { value: "factory", icon: "🏭" },
  { value: "other", icon: "🏘️" },
];

const StepPropertyType = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepPropertyTypeProps) => {
  const t = useTranslations("advertisements.wizard");
  const tTypes = useTranslations("advertisements.property_types");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories();

  // Extract categories array from response
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.data || [];

  const filteredUseOptions = PROPERTY_USE_OPTIONS.filter((type) => {
    try {
      return tTypes(type.value)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    } catch {
      return type.value.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  const isValid =
    values.category_id && values.operation_type && values.property_use;

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
          {t("property_type.title")}
        </h2>
      </div>

      {/* Section: Category (from API) */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("property_type.category_label")}
        </Label>
        <Select
          value={values.category_id ? String(values.category_id) : undefined}
          onValueChange={(value) => onChange("category_id", value)}
          disabled={categoriesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                categoriesLoading
                  ? t("common.loading")
                  : t("property_type.select_category")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Section: Property Use */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("property_type.type_label")}
        </Label>

        {/* Search */}
        <div className="relative mb-4">
          <Input
            placeholder={t("property_type.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
          <FiSearch className="absolute start-3 top-3 text-gray-400" />
        </div>

        {/* Property Use List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredUseOptions.map((type) => (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange("property_use", type.value)}
              className={cn(
                "w-full p-3 rounded-lg border text-start flex items-center gap-3 transition-colors",
                values.property_use === type.value
                  ? "border-main-green bg-main-green/5"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  values.property_use === type.value
                    ? "border-main-green bg-main-green"
                    : "border-gray-300",
                )}
              >
                {values.property_use === type.value && (
                  <FiCheck className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-lg">{type.icon}</span>
              <span className="font-medium text-gray-900">
                {(() => {
                  try {
                    return tTypes(type.value);
                  } catch {
                    return type.value;
                  }
                })()}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Section: Operation Type (sale / rent) */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("property_type.ad_type_label")}
        </Label>
        <Select
          value={values.operation_type}
          onValueChange={(value) => onChange("operation_type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("property_type.select_ad_type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">{t("ad_types.sale")}</SelectItem>
            <SelectItem value="rent">{t("ad_types.rent")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 py-6">
          {t("common.back")}
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-main-green hover:bg-main-green/90 text-white font-semibold py-6 disabled:opacity-50"
        >
          {t("common.next")}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepPropertyType;
