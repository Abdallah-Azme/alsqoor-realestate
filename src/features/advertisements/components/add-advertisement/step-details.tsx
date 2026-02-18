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
import { cn } from "@/lib/utils";
import { FinishingType, Facade } from "../../types/advertisement.types";
import { useAmenities } from "@/features/properties/hooks/use-properties";

interface StepDetailsProps {
  values: {
    title?: string;
    description?: string;
    area?: string;
    usable_area?: string;
    rooms?: string;
    bathrooms?: string;
    balconies?: string;
    garages?: string;
    finishing_type?: FinishingType;
    property_age?: string;
    facade?: Facade;
    price_min?: string;
    price_max?: string;
    price_per_meter?: string;
    price_hidden?: boolean;
    amenity_ids?: number[];
    services?: string[];
    obligations?: string;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const FINISHING_TYPES: FinishingType[] = [
  "none",
  "basic",
  "good",
  "luxury",
  "super_luxury",
];

const FACADE_OPTIONS: Facade[] = [
  "north",
  "south",
  "east",
  "west",
  "north_east",
  "north_west",
  "south_east",
  "south_west",
  "multiple",
  "unknown",
];

const StepDetails = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepDetailsProps) => {
  const t = useTranslations("advertisements.wizard");

  // Fetch amenities from API
  const { data: amenitiesResponse, isLoading: amenitiesLoading } =
    useAmenities();

  // Extract amenities array from response
  const amenities = Array.isArray(amenitiesResponse)
    ? amenitiesResponse
    : (amenitiesResponse as any)?.data || [];

  // Toggle amenity selection
  const toggleAmenity = (amenityId: number) => {
    const currentIds = values.amenity_ids || [];
    const newIds = currentIds.includes(amenityId)
      ? currentIds.filter((id) => id !== amenityId)
      : [...currentIds, amenityId];
    onChange("amenity_ids", newIds);
  };

  const isValid =
    values.title &&
    values.title.length >= 3 &&
    values.area &&
    values.price_min &&
    values.price_max &&
    values.finishing_type &&
    values.description &&
    values.description.length >= 10;

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
          {t("details.title")}
        </h2>
        <p className="text-sm text-gray-500">{t("details.subtitle")}</p>
      </div>

      {/* Title */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.property_title_label")}
        </Label>
        <Input
          placeholder={t("details.property_title_placeholder")}
          value={values.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      {/* Area & Usable Area */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
            {t("details.usable_area_label")}
          </Label>
          <Input
            type="number"
            placeholder={t("details.usable_area_placeholder")}
            value={values.usable_area || ""}
            onChange={(e) => onChange("usable_area", e.target.value)}
          />
        </div>
      </div>

      {/* Rooms, Bathrooms, Balconies, Garages */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.rooms_label")}
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={values.rooms || ""}
            onChange={(e) => onChange("rooms", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.bathrooms_label")}
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={values.bathrooms || ""}
            onChange={(e) => onChange("bathrooms", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.balconies_label")}
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={values.balconies || ""}
            onChange={(e) => onChange("balconies", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.garages_label")}
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={values.garages || ""}
            onChange={(e) => onChange("garages", e.target.value)}
          />
        </div>
      </div>

      {/* Finishing Type & Property Age */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.finishing_type_label")}
          </Label>
          <Select
            value={values.finishing_type}
            onValueChange={(value) => onChange("finishing_type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("details.select_finishing_type")} />
            </SelectTrigger>
            <SelectContent>
              {FINISHING_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`finishing_types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.property_age_label")}
          </Label>
          <Input
            type="number"
            placeholder={t("details.property_age_placeholder")}
            value={values.property_age || ""}
            onChange={(e) => onChange("property_age", e.target.value)}
          />
        </div>
      </div>

      {/* Facade */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.facade_label")}
        </Label>
        <Select
          value={values.facade}
          onValueChange={(value) => onChange("facade", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("details.select_facade")} />
          </SelectTrigger>
          <SelectContent>
            {FACADE_OPTIONS.map((direction) => (
              <SelectItem key={direction} value={direction}>
                {t(`facades.${direction}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.price_min_label")}
          </Label>
          <Input
            type="number"
            placeholder={t("details.price_placeholder")}
            value={values.price_min || ""}
            onChange={(e) => onChange("price_min", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {t("details.price_max_label")}
          </Label>
          <Input
            type="number"
            placeholder={t("details.price_placeholder")}
            value={values.price_max || ""}
            onChange={(e) => onChange("price_max", e.target.value)}
          />
        </div>
      </div>

      {/* Price per meter */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.price_per_meter_label")}
        </Label>
        <Input
          type="number"
          placeholder={t("details.price_per_meter_placeholder")}
          value={values.price_per_meter || ""}
          onChange={(e) => onChange("price_per_meter", e.target.value)}
        />
      </div>

      {/* Price Hidden Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <Checkbox
          id="price_hidden"
          checked={values.price_hidden || false}
          onCheckedChange={(checked) => onChange("price_hidden", checked)}
        />
        <Label htmlFor="price_hidden" className="text-sm text-gray-700">
          {t("details.price_hidden_label")}
        </Label>
      </div>

      {/* Amenities (from API) */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("details.amenities_label")}
        </Label>
        {amenitiesLoading ? (
          <p className="text-sm text-gray-400">{t("common.loading")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity: any) => (
              <motion.button
                key={amenity.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "p-3 rounded-lg border text-start flex items-center gap-2 transition-colors text-sm",
                  (values.amenity_ids || []).includes(amenity.id)
                    ? "border-main-green bg-main-green/5 text-main-green"
                    : "border-gray-200 hover:border-gray-300 text-gray-700",
                )}
              >
                {amenity.fullIconUrl && (
                  <img
                    src={amenity.fullIconUrl}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span>{amenity.name}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Services (free text, comma separated) */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.services_label")}
        </Label>
        <Input
          placeholder={t("details.services_placeholder")}
          value={(values.services || []).join(", ")}
          onChange={(e) => {
            const serviceList = e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            onChange("services", serviceList);
          }}
        />
        <p className="text-xs text-gray-400 mt-1">
          {t("details.services_hint")}
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("details.description_label")}
        </Label>
        <Textarea
          className="w-full"
          placeholder={t("details.description_placeholder")}
          value={values.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
        />
        {values.description && values.description.length < 10 && (
          <p className="text-xs text-red-500 mt-1">
            {t("details.description_min_hint")}
          </p>
        )}
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

export default StepDetails;
