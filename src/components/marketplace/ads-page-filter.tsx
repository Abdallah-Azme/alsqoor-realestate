"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCategories,
  useCountries,
  useCities,
} from "@/features/properties/hooks/use-properties";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AdsFilterProps {
  onSubmit?: (filters: Record<string, any>) => void;
}

const operationTypes = [
  { key: "all", icon: "🔍" },
  { key: "sale", icon: "💰" },
  { key: "rent", icon: "🔑" },
];

const AdsFilter = ({ onSubmit }: AdsFilterProps) => {
  const t = useTranslations();
  const tRequests = useTranslations("propertyRequestsPage");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [activeType, setActiveType] = useState(
    searchParams.get("operation_type") || "all",
  );
  const [search, setSearch] = useState(searchParams.get("title") || "");
  const [selectedCountry, setSelectedCountry] = useState<string>(
    searchParams.get("country_id") || "",
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get("city_id") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "newest");
  const [isExpanded, setIsExpanded] = useState(false);

  // Additional Filters
  const [formData, setFormData] = useState({
    id: searchParams.get("id") || "",
    category_id: searchParams.get("category_id") || "all",
    district: searchParams.get("district") || "",
    min_area: searchParams.get("min_area") || "",
    rooms: searchParams.get("rooms") || "any",
    bathrooms: searchParams.get("bathrooms") || "any",
    finishing_type: searchParams.get("finishing_type") || "all",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
  });

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCities(selectedCountry);
  const { data: categories = [] } = useCategories();

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeClick = (typeKey: string) => {
    setActiveType(typeKey);
    handleSubmit({ operation_type: typeKey === "all" ? undefined : typeKey });
  };

  const handleSubmit = (additionalFilters: Record<string, any> = {}) => {
    const filters = {
      operation_type: activeType === "all" ? undefined : activeType,
      title: search,
      country_id: selectedCountry ? Number(selectedCountry) : undefined,
      city_id: selectedCity ? Number(selectedCity) : undefined,
      sort_by: sortBy,
      ...formData,
      ...additionalFilters,
    };

    // Clean up filters
    const cleanFilters: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== "all" &&
        value !== "any" &&
        value !== undefined &&
        value !== null
      ) {
        cleanFilters[key] = value;
      }
    });

    onSubmit?.(cleanFilters);
  };

  const handleClear = () => {
    setActiveType("all");
    setSearch("");
    setSelectedCountry("");
    setSelectedCity("");
    setSortBy("newest");
    setFormData({
      id: "",
      category_id: "all",
      district: "",
      min_area: "",
      rooms: "any",
      bathrooms: "any",
      finishing_type: "all",
      min_price: "",
      max_price: "",
    });
    onSubmit?.({});
  };

  return (
    <div className="space-y-4">
      {/* Operation type tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {operationTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => handleTypeClick(type.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeType === type.key
                  ? "bg-main-green text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{type.icon}</span>
              <span>{t(`home.state_filter.${type.key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main search row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keyword search (Title) */}
        <div className="relative">
          <Input
            placeholder={t("propertyRequestsPage.fields.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-gray-300 rounded-lg h-12 pe-10"
          />
          <FiSearch className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        </div>

        {/* Country */}
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="!h-12 border-gray-300 rounded-lg">
            <SelectValue placeholder={tRequests("fields.country")} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country: any) => (
              <SelectItem key={country.id} value={String(country.id)}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City */}
        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
          disabled={!selectedCountry}
        >
          <SelectTrigger className="!h-12 border-gray-300 rounded-lg">
            <SelectValue placeholder={tRequests("fields.city")} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city: any) => (
              <SelectItem key={city.id} value={String(city.id)}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="!h-12 border-gray-300 rounded-lg">
            <SelectValue placeholder={tRequests("filter.sort_by")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              {tRequests("filter.sort.newest")}
            </SelectItem>
            <SelectItem value="oldest">
              {tRequests("filter.sort.oldest")}
            </SelectItem>
            <SelectItem value="price_low">
              {tRequests("filter.sort.price_low")}
            </SelectItem>
            <SelectItem value="price_high">
              {tRequests("filter.sort.price_high")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters Toggle */}
      <div>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-500 hover:text-main-green"
        >
          <FiFilter />
          <span>
            {isExpanded
              ? t("common.less_filters") || "فلاتر أقل"
              : t("common.more_filters") || "فلاتر أكثر"}
          </span>
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Ad ID */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("property_details.fields.id") || "رقم الإعلان"}
                </label>
                <Input
                  placeholder="Ex: 3"
                  value={formData.id}
                  onChange={(e) => updateField("id", e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.category")}
                </label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) => updateField("category_id", v)}
                >
                  <SelectTrigger className="!h-12 border-gray-300 rounded-lg text-sm">
                    <SelectValue placeholder={tRequests("types.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {tRequests("types.all")}
                    </SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {locale === "ar"
                          ? cat.name_ar || cat.name
                          : cat.name_en || cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.district")}
                </label>
                <Input
                  placeholder={t("properties.district_placeholder")}
                  value={formData.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                />
              </div>

              {/* Min Area */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.area")}
                </label>
                <Input
                  type="number"
                  placeholder={t("properties.area_placeholder")}
                  value={formData.min_area}
                  onChange={(e) => updateField("min_area", e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                />
              </div>

              {/* Rooms */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.rooms")}
                </label>
                <Select
                  value={formData.rooms}
                  onValueChange={(v) => updateField("rooms", v)}
                >
                  <SelectTrigger className="!h-12 border-gray-300 rounded-lg text-sm">
                    <SelectValue
                      placeholder={tRequests("filter.any") || "الكل"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">
                      {tRequests("filter.any") || "الكل"}
                    </SelectItem>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.bathrooms")}
                </label>
                <Select
                  value={formData.bathrooms}
                  onValueChange={(v) => updateField("bathrooms", v)}
                >
                  <SelectTrigger className="!h-12 border-gray-300 rounded-lg text-sm">
                    <SelectValue
                      placeholder={tRequests("filter.any") || "الكل"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">
                      {tRequests("filter.any") || "الكل"}
                    </SelectItem>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Finishing */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.finishing_type_label")}
                </label>
                <Select
                  value={formData.finishing_type}
                  onValueChange={(v) => updateField("finishing_type", v)}
                >
                  <SelectTrigger className="!h-12 border-gray-300 rounded-lg text-sm">
                    <SelectValue placeholder={tRequests("types.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {tRequests("types.all")}
                    </SelectItem>
                    {["none", "basic", "good", "luxury", "super_luxury"].map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {t(`property_details.finishing_types.${type}`)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.filters.min_price")}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.min_price}
                  onChange={(e) => updateField("min_price", e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                />
              </div>

              {/* Max Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.filters.max_price")}
                </label>
                <Input
                  type="number"
                  placeholder="999,999,999"
                  value={formData.max_price}
                  onChange={(e) => updateField("max_price", e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons row */}
      <div className="flex justify-end gap-2 text-end">
        <Button
          onClick={handleClear}
          variant="outline"
          className="h-12 px-8 border-red-500 text-red-500 hover:bg-red-50 rounded-lg"
        >
          {tRequests("filter.clear")}
        </Button>
        <Button
          onClick={() => handleSubmit()}
          className="bg-main-green hover:bg-main-green/90 text-white h-12 px-12 gap-2 rounded-lg"
        >
          <FiSearch />
          {tRequests("filter.search")}
        </Button>
      </div>
    </div>
  );
};

export default function AdsPageFilter() {
  const router = useRouter();
  const t = useTranslations("propertyRequestsPage");

  const handleFilterSubmit = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all"
      ) {
        params.set(key, value.toString());
      }
    });

    router.push(`/ads?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      {/* Desktop filter */}
      <div className="max-lg:hidden">
        <AdsFilter onSubmit={handleFilterSubmit} />
      </div>

      {/* Mobile filter sheet */}
      <Sheet>
        <SheetTrigger className="lg:hidden bg-main-green text-white font-bold rounded-xl hover:bg-main-green/95 transition-all duration-500 w-full h-12">
          {t("filter.customize_request")}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto rounded-t-3xl"
        >
          <div className="py-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-center font-bold text-xl">
                {t("filter.customize_request")}
              </SheetTitle>
              <SheetDescription className="text-center text-gray-500">
                {t("filter.customize_description")}
              </SheetDescription>
            </SheetHeader>
            <AdsFilter onSubmit={handleFilterSubmit} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
