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
import {
  PropertyType,
  AdType,
  RentPeriod,
  HousingType,
} from "../../types/advertisement.types";
import { useState } from "react";

interface StepPropertyTypeProps {
  values: {
    propertyType?: PropertyType;
    adType?: AdType;
    rentPeriod?: RentPeriod;
    housingType?: HousingType;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PROPERTY_TYPES: { value: PropertyType; icon: string }[] = [
  { value: "villa", icon: "🏠" },
  { value: "residential_land", icon: "🏗️" },
  { value: "commercial_land", icon: "🏢" },
  { value: "apartment", icon: "🏢" },
  { value: "floor", icon: "🏠" },
  { value: "shop", icon: "🏪" },
  { value: "building", icon: "🏛️" },
  { value: "warehouse", icon: "🏭" },
  { value: "rest_house", icon: "🏡" },
  { value: "farm", icon: "🌾" },
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

  const filteredTypes = PROPERTY_TYPES.filter((type) =>
    tTypes(type.value).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isValid = values.propertyType && values.adType;

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

      {/* Section: Property Type */}
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

        {/* Property Types List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredTypes.map((type) => (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange("propertyType", type.value)}
              className={cn(
                "w-full p-3 rounded-lg border text-start flex items-center gap-3 transition-colors",
                values.propertyType === type.value
                  ? "border-main-green bg-main-green/5"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  values.propertyType === type.value
                    ? "border-main-green bg-main-green"
                    : "border-gray-300",
                )}
              >
                {values.propertyType === type.value && (
                  <FiCheck className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-lg">{type.icon}</span>
              <span className="font-medium text-gray-900">
                {tTypes(type.value)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Section: Ad Type */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("property_type.ad_type_label")}
        </Label>
        <Select
          value={values.adType}
          onValueChange={(value) => onChange("adType", value)}
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

      {/* Conditional: Rent Period (if rent) */}
      {values.adType === "rent" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            {t("property_type.rent_period_label")}
          </Label>
          <Select
            value={values.rentPeriod}
            onValueChange={(value) => onChange("rentPeriod", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("property_type.select_rent_period")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t("rent_periods.daily")}</SelectItem>
              <SelectItem value="monthly">
                {t("rent_periods.monthly")}
              </SelectItem>
              <SelectItem value="yearly">{t("rent_periods.yearly")}</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Section: Housing Type */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("property_type.housing_type_label")}
        </Label>
        <Select
          value={values.housingType}
          onValueChange={(value) => onChange("housingType", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("property_type.select_housing_type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="families">
              {t("housing_types.families")}
            </SelectItem>
            <SelectItem value="singles">
              {t("housing_types.singles")}
            </SelectItem>
            <SelectItem value="both">{t("housing_types.both")}</SelectItem>
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
