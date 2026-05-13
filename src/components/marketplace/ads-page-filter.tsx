"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useCategories,
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
import {
  LayoutGrid,
  Coins,
  KeyRound,
  Search,
  Trash2,
  MapPin,
  Home,
  Banknote,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { useRouter as useI18nRouter } from "@/i18n/navigation";

interface AdsFilterProps {
  onSubmit?: (filters: Record<string, unknown>) => void;
}

const operationTypes = [
  { key: "all", Icon: LayoutGrid },
  { key: "sale", Icon: Coins },
  { key: "rent", Icon: KeyRound },
] as const;

type PricePresetKey =
  | "all"
  | "under_500k"
  | "range_500k_1m"
  | "range_1m_2m"
  | "range_2m_5m"
  | "above_5m";

const PRICE_PRESETS: Record<
  Exclude<PricePresetKey, "all">,
  { min: string; max: string }
> = {
  under_500k: { min: "", max: "500000" },
  range_500k_1m: { min: "500000", max: "1000000" },
  range_1m_2m: { min: "1000000", max: "2000000" },
  range_2m_5m: { min: "2000000", max: "5000000" },
  above_5m: { min: "5000000", max: "" },
};

const AdsFilter = ({ onSubmit }: AdsFilterProps) => {
  const t = useTranslations();
  const tAds = useTranslations("marketplace.ads_page");
  const tRequests = useTranslations("propertyRequestsPage");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [activeType, setActiveType] = useState(
    searchParams.get("operation_type") || "all",
  );
  const [search, setSearch] = useState(searchParams.get("title") || "");
  const selectedCountry = "2";
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get("city_id") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "newest");
  const [pricePreset, setPricePreset] = useState<PricePresetKey>("all");
  const [isExpanded, setIsExpanded] = useState(false);

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

  const { data: cities = [] } = useCities(selectedCountry);
  const { data: categories = [] } = useCategories();

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resolvePriceFields = () => {
    if (pricePreset === "all") {
      return { min_price: formData.min_price, max_price: formData.max_price };
    }
    const p = PRICE_PRESETS[pricePreset];
    return { min_price: p.min, max_price: p.max };
  };

  const handleTypeClick = (typeKey: string) => {
    setActiveType(typeKey);
    handleSubmit({ operation_type: typeKey === "all" ? undefined : typeKey });
  };

  const handleSubmit = (additionalFilters: Record<string, unknown> = {}) => {
    const { min_price, max_price } = resolvePriceFields();

    const filters = {
      operation_type: activeType === "all" ? undefined : activeType,
      title: search,
      country_id: 2,
      city_id: selectedCity ? Number(selectedCity) : undefined,
      sort_by: sortBy,
      ...formData,
      min_price,
      max_price,
      ...additionalFilters,
    };

    const cleanFilters: Record<string, unknown> = {};
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
    setSelectedCity("");
    setSortBy("newest");
    setPricePreset("all");
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
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6 md:shadow-md">
      <div className="space-y-5">
        {/* Operation type — segmented control */}
        <div className="flex justify-start overflow-x-auto pb-0.5">
          <div
            role="group"
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/90 p-1.5"
          >
            {operationTypes.map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTypeClick(key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeType === key
                    ? "bg-main-green text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                <Icon className="size-4 shrink-0 opacity-90" />
                <span>{t(`home.state_filter.${key}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main filter row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative min-w-0 flex-1 lg:min-w-[200px]">
            <Input
              placeholder={tAds("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 border-gray-200 pe-11 text-sm rounded-xl"
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
            <Search className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          </div>

          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            disabled={!selectedCountry}
          >
            <SelectTrigger className="h-12 w-full min-w-[160px] rounded-xl border-gray-200 lg:w-[min(200px,100%)]">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <MapPin className="size-4 shrink-0 text-gray-400" />
                <SelectValue
                  placeholder={
                    tRequests("fields.select_city") ||
                    (locale === "ar" ? "اختر المدينة" : "Select City")
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              {cities.map((city: { id: number; name: string; name_ar?: string; name_en?: string }) => (
                <SelectItem key={city.id} value={String(city.id)}>
                  {locale === "ar"
                    ? city.name_ar || city.name
                    : city.name_en || city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.category_id}
            onValueChange={(v) => updateField("category_id", v)}
          >
            <SelectTrigger
              aria-label={tAds("property_type_placeholder")}
              className="h-12 w-full min-w-[160px] rounded-xl border-gray-200 lg:w-[min(200px,100%)]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Home className="size-4 shrink-0 text-gray-400" />
                <SelectValue placeholder={tAds("property_type_placeholder")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tRequests("types.all")}</SelectItem>
              {categories.map((cat: { id: number; name: string; name_ar?: string; name_en?: string }) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {locale === "ar" ? cat.name_ar || cat.name : cat.name_en || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={pricePreset}
            onValueChange={(v) => setPricePreset(v as PricePresetKey)}
          >
            <SelectTrigger
              aria-label={tAds("price_placeholder")}
              className="h-12 w-full min-w-[160px] rounded-xl border-gray-200 lg:w-[min(200px,100%)]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Banknote className="size-4 shrink-0 text-gray-400" />
                <SelectValue placeholder={tAds("price_placeholder")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tAds("price_option_all")}</SelectItem>
              <SelectItem value="under_500k">{tAds("price_under_500k")}</SelectItem>
              <SelectItem value="range_500k_1m">{tAds("price_500k_1m")}</SelectItem>
              <SelectItem value="range_1m_2m">{tAds("price_1m_2m")}</SelectItem>
              <SelectItem value="range_2m_5m">{tAds("price_2m_5m")}</SelectItem>
              <SelectItem value="above_5m">{tAds("price_above_5m")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex w-full gap-2 lg:w-auto lg:shrink-0">
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="h-12 flex-1 gap-2 rounded-xl border-red-500 text-red-500 hover:bg-red-50 lg:flex-initial lg:px-6"
            >
              <Trash2 className="size-4" />
              {tRequests("filter.clear")}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit()}
              className="h-12 flex-1 gap-2 rounded-xl bg-main-green px-8 text-white hover:bg-main-green/90 lg:flex-initial lg:px-10"
            >
              <Search className="size-4" />
              {tRequests("filter.search")}
            </Button>
          </div>
        </div>

        {/* More filters — centered */}
        <div className="flex justify-center border-t border-gray-100 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 text-gray-600 hover:bg-gray-50 hover:text-main-green"
          >
            <Filter className="size-4" />
            <span>{isExpanded ? tAds("less_filters") : tAds("more_filters")}</span>
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-4 border-t border-gray-100 pt-4 duration-300">
            <div className="max-w-full sm:max-w-xs">
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                {tAds("sort_label")}
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("property_details.fields.id") || "رقم الإعلان"}
                </label>
                <Input
                  placeholder="Ex: 3"
                  value={formData.id}
                  onChange={(e) => updateField("id", e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.district")}
                </label>
                <Input
                  placeholder={t("properties.district_placeholder")}
                  value={formData.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.area")}
                </label>
                <Input
                  type="number"
                  placeholder={t("properties.area_placeholder")}
                  value={formData.min_area}
                  onChange={(e) => updateField("min_area", e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.rooms")}
                </label>
                <Select
                  value={formData.rooms}
                  onValueChange={(v) => updateField("rooms", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder={tRequests("filter.any") || "الكل"} />
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.bathrooms")}
                </label>
                <Select
                  value={formData.bathrooms}
                  onValueChange={(v) => updateField("bathrooms", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder={tRequests("filter.any") || "الكل"} />
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.finishing_type_label")}
                </label>
                <Select
                  value={formData.finishing_type}
                  onValueChange={(v) => updateField("finishing_type", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder={tRequests("types.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tRequests("types.all")}</SelectItem>
                    {["none", "basic", "good", "luxury", "super_luxury"].map((ftype) => (
                      <SelectItem key={ftype} value={ftype}>
                        {t(`property_details.finishing_types.${ftype}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.filters.min_price")}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.min_price}
                  onChange={(e) => updateField("min_price", e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                  disabled={pricePreset !== "all"}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  {t("properties.filters.max_price")}
                </label>
                <Input
                  type="number"
                  placeholder="999,999,999"
                  value={formData.max_price}
                  onChange={(e) => updateField("max_price", e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                  disabled={pricePreset !== "all"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdsPageFilter() {
  const router = useI18nRouter();
  const t = useTranslations("propertyRequestsPage");

  const handleFilterSubmit = (newFilters: Record<string, unknown>) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all"
      ) {
        params.set(key, String(value));
      }
    });

    router.push(`/ads?${params.toString()}`);
  };

  return (
    <div className="mx-auto mb-8 w-full max-w-7xl">
      <div className="max-lg:hidden">
        <AdsFilter onSubmit={handleFilterSubmit} />
      </div>

      <Sheet>
        <SheetTrigger className="h-12 w-full rounded-xl bg-main-green font-bold text-white transition-all duration-300 hover:bg-main-green/95 lg:hidden">
          {t("filter.customize_request")}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-3xl"
        >
          <div className="py-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-center text-xl font-bold">
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
