"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepLocationProps {
  values: {
    city?: string;
    neighborhood?: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock cities - in production, fetch from API
const MOCK_CITIES = [
  { id: "1", key: "riyadh" },
  { id: "2", key: "jeddah" },
  { id: "3", key: "dammam" },
  { id: "4", key: "mecca" },
  { id: "5", key: "medina" },
];

// Mock neighborhoods - in production, fetch based on city
const MOCK_NEIGHBORHOODS: Record<string, { id: string; key: string }[]> = {
  "1": [
    { id: "1-1", key: "alnakhil" },
    { id: "1-2", key: "alolaya" },
    { id: "1-3", key: "almalqa" },
    { id: "1-4", key: "hittin" },
  ],
  "2": [
    { id: "2-1", key: "alhamra" },
    { id: "2-2", key: "alrawdah" },
    { id: "2-3", key: "alnasim" },
  ],
  "3": [
    { id: "3-1", key: "alshatea" },
    { id: "3-2", key: "alfaisaliyah" },
  ],
  "4": [
    { id: "4-1", key: "alaziziyah" },
    { id: "4-2", key: "alshawqiyah" },
  ],
  "5": [
    { id: "5-1", key: "quba" },
    { id: "5-2", key: "alawali" },
  ],
};

const StepLocation = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepLocationProps) => {
  const t = useTranslations("advertisements.wizard");
  const tLoc = useTranslations("locations");

  const neighborhoods = values.city
    ? MOCK_NEIGHBORHOODS[values.city] || []
    : [];
  const isValid = values.city && values.neighborhood;

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
          {t("location.title")}
        </h2>
      </div>

      {/* City Select */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("location.city_label")}
        </Label>
        <Select
          value={values.city}
          onValueChange={(value) => {
            onChange("city", value);
            onChange("neighborhood", ""); // Reset neighborhood when city changes
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("location.select_city")} />
          </SelectTrigger>
          <SelectContent>
            {MOCK_CITIES.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {tLoc(`cities.${city.key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood Select */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("location.neighborhood_label")}
        </Label>
        <Select
          value={values.neighborhood}
          onValueChange={(value) => onChange("neighborhood", value)}
          disabled={!values.city}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("location.select_neighborhood")} />
          </SelectTrigger>
          <SelectContent>
            {neighborhoods.map((neighborhood) => (
              <SelectItem key={neighborhood.id} value={neighborhood.id}>
                {tLoc(`neighborhoods.${neighborhood.key}`)}
              </SelectItem>
            ))}
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

export default StepLocation;
