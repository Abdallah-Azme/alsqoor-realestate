"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PropertyUsage,
  PropertyAmenity,
  StreetFacing,
} from "../../types/advertisement.types";

interface StepDetailsProps {
  values: {
    area?: string;
    totalPrice?: string;
    pricePerMeter?: string;
    usage?: PropertyUsage[];
    amenities?: PropertyAmenity[];
    streetWidth?: string;
    streetFacing?: StreetFacing;
    obligations?: string;
    description?: string;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const USAGE_OPTIONS: PropertyUsage[] = [
  "residential",
  "commercial",
  "industrial",
  "agricultural",
];

const AMENITY_OPTIONS: PropertyAmenity[] = [
  "parking",
  "elevator",
  "security",
  "pool",
  "gym",
  "garden",
  "central_ac",
  "furnished",
  "kitchen",
  "maid_room",
  "driver_room",
  "basement",
];

const STREET_FACING_OPTIONS: StreetFacing[] = [
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
];

const StepDetails = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepDetailsProps) => {
  const t = useTranslations("advertisements.wizard");
  const tUsage = useTranslations("advertisements.usage_types");
  const tAmenities = useTranslations("advertisements.amenities");
  const tFacing = useTranslations("advertisements.street_facing");

  const toggleUsage = (usage: PropertyUsage) => {
    const current = values.usage || [];
    const updated = current.includes(usage)
      ? current.filter((u) => u !== usage)
      : [...current, usage];
    onChange("usage", updated);
  };

  const toggleAmenity = (amenity: PropertyAmenity) => {
    const current = values.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange("amenities", updated);
  };

  const isValid =
    values.area &&
    values.totalPrice &&
    values.usage &&
    values.usage.length > 0 &&
    values.description &&
    values.description.length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="py-6 px-4 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-main-navy mb-2">
          {t("details.title")}
        </h2>
      </div>

      {/* Area & Price Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.area_label")}
          </Label>
          <Input
            type="number"
            placeholder={t("details.area_placeholder")}
            value={values.area || ""}
            onChange={(e) => onChange("area", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.total_price_label")}
          </Label>
          <Input
            type="number"
            placeholder={t("details.price_placeholder")}
            value={values.totalPrice || ""}
            onChange={(e) => onChange("totalPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Price per meter */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.price_per_meter_label")}
        </Label>
        <Input
          type="number"
          placeholder={t("details.price_per_meter_placeholder")}
          value={values.pricePerMeter || ""}
          onChange={(e) => onChange("pricePerMeter", e.target.value)}
        />
      </div>

      {/* Property Usage */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("details.usage_label")}
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {USAGE_OPTIONS.map((usage) => (
            <div
              key={usage}
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-main-green cursor-pointer"
              onClick={() => toggleUsage(usage)}
            >
              <Checkbox
                checked={(values.usage || []).includes(usage)}
                onCheckedChange={() => toggleUsage(usage)}
              />
              <span className="text-sm">{tUsage(usage)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("details.amenities_label")}
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {AMENITY_OPTIONS.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-main-green cursor-pointer text-xs"
              onClick={() => toggleAmenity(amenity)}
            >
              <Checkbox
                checked={(values.amenities || []).includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <span>{tAmenities(amenity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Street Width & Facing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.street_width_label")}
          </Label>
          <Input
            placeholder={t("details.street_width_placeholder")}
            value={values.streetWidth || ""}
            onChange={(e) => onChange("streetWidth", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.street_facing_label")}
          </Label>
          <Select
            value={values.streetFacing}
            onValueChange={(value) => onChange("streetFacing", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("details.select_facing")} />
            </SelectTrigger>
            <SelectContent>
              {STREET_FACING_OPTIONS.map((facing) => (
                <SelectItem key={facing} value={facing}>
                  {tFacing(facing)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Obligations */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.obligations_label")}
        </Label>
        <Input
          placeholder={t("details.obligations_placeholder")}
          value={values.obligations || ""}
          onChange={(e) => onChange("obligations", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.description_label")}
        </Label>
        <Textarea
          placeholder={t("details.description_placeholder")}
          value={values.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
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

export default StepDetails;
