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
import {
  useCountries,
  useCities,
} from "@/features/properties/hooks/use-properties";

interface StepLocationProps {
  values: {
    country_id?: number | string;
    city_id?: number | string;
    district?: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepLocation = ({
  values,
  onChange,
  onNext,
  onBack,
}: StepLocationProps) => {
  const t = useTranslations("advertisements.wizard");

  // Fetch countries from API
  const { data: countriesResponse, isLoading: countriesLoading } =
    useCountries();

  // Fetch cities only when country is selected
  const { data: citiesResponse, isLoading: citiesLoading } = useCities(
    values.country_id || undefined,
  );

  // Extract arrays from response
  const countries = Array.isArray(countriesResponse)
    ? countriesResponse
    : (countriesResponse as any)?.data || [];

  const cities = Array.isArray(citiesResponse)
    ? citiesResponse
    : (citiesResponse as any)?.data || [];

  const isValid =
    values.country_id &&
    values.city_id &&
    values.district &&
    values.district.trim().length > 0;

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
        <p className="text-sm text-gray-500">{t("location.subtitle")}</p>
      </div>

      {/* Country Select */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("location.country_label")}
        </Label>
        <Select
          value={values.country_id ? String(values.country_id) : undefined}
          onValueChange={(value) => {
            onChange("country_id", value);
            onChange("city_id", ""); // Reset city when country changes
          }}
          disabled={countriesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                countriesLoading
                  ? t("common.loading")
                  : t("location.select_country")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country: any) => (
              <SelectItem key={country.id} value={String(country.id)}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Select */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("location.city_label")}
        </Label>
        <Select
          value={values.city_id ? String(values.city_id) : undefined}
          onValueChange={(value) => onChange("city_id", value)}
          disabled={!values.country_id || citiesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                citiesLoading
                  ? t("common.loading")
                  : !values.country_id
                    ? t("location.select_country_first")
                    : t("location.select_city")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city: any) => (
              <SelectItem key={city.id} value={String(city.id)}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District (free text) */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          {t("location.district_label")}
        </Label>
        <Input
          placeholder={t("location.district_placeholder")}
          value={values.district || ""}
          onChange={(e) => onChange("district", e.target.value)}
        />
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
