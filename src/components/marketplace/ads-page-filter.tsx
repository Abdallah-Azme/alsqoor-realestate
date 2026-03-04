"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  useCategories,
  useCities,
} from "@/features/properties/hooks/use-properties";
import { Search } from "lucide-react";
import {
  BsHash,
  BsHouse,
  BsMap,
  BsGeoAlt,
  BsArrowsFullscreen,
  BsDoorOpen,
  BsDroplet,
  BsLayers,
} from "react-icons/bs";
import { cn } from "@/lib/utils";

// ── Reusable field wrapper ───────────────────────────────────────────────────
function FilterField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
      <div className="shrink-0 group-hover:scale-110 group-hover:text-main-green transition-transform duration-200 pb-2">
        {icon}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 block">
          {label}
        </span>
        <div className="w-full relative">{children}</div>
      </div>
    </div>
  );
}

export default function AdsPageFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();

  const [operationType, setOperationType] = useState(
    searchParams.get("operation_type") || "sale",
  );

  const [formData, setFormData] = useState({
    id: searchParams.get("id") || "",
    category_id: searchParams.get("category_id") || "all",
    city_id: searchParams.get("city_id") || "all",
    district: searchParams.get("district") || "",
    min_area: searchParams.get("min_area") || "",
    rooms: searchParams.get("rooms") || "any",
    bathrooms: searchParams.get("bathrooms") || "any",
    finishing_type: searchParams.get("finishing_type") || "all",
  });

  const { data: categories } = useCategories();
  const { data: cities } = useCities(1); // Assuming 1 is Saudi Arabia

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("operation_type", operationType);
    params.set("country_id", "1"); // Default

    if (formData.id) params.set("id", formData.id);
    if (formData.category_id !== "all")
      params.set("category_id", formData.category_id);
    if (formData.city_id !== "all") params.set("city_id", formData.city_id);
    if (formData.district) params.set("district", formData.district);
    if (formData.min_area) params.set("min_area", formData.min_area);
    if (formData.rooms !== "any") params.set("rooms", formData.rooms);
    if (formData.bathrooms !== "any")
      params.set("bathrooms", formData.bathrooms);
    if (formData.finishing_type !== "all")
      params.set("finishing_type", formData.finishing_type);

    router.push(`/ads?${params.toString()}`);
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-4">
      {/* Sale / Rent Tabs - Floating Style & Compact */}
      <div className="flex -mb-px relative z-10 w-full md:w-auto md:inline-flex px-4 md:px-0">
        <div className="flex w-full md:w-auto bg-white/70 backdrop-blur-md p-1 rounded-t-xl gap-1 border border-b-0 border-gray-200/60 shadow-sm relative top-px">
          {(["sale", "rent"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOperationType(type)}
              className={cn(
                "relative flex-1 md:flex-none px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                operationType === type
                  ? "text-main-green"
                  : "text-gray-500 hover:text-gray-700 bg-transparent hover:bg-gray-50",
              )}
            >
              {operationType === type && (
                <motion.div
                  layoutId="activeTabFilter"
                  className="absolute inset-0 bg-main-green/10 rounded-lg border border-main-green/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {t(`home.state_filter.${type}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Filter Body */}
      <div className="bg-white p-2 md:p-3 rounded-2xl rounded-tr-none md:rounded-tr-2xl shadow-sm border border-gray-200 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-1 p-1">
          {/* Ad ID */}
          <FilterField
            label="رقم الإعلان (ID)"
            icon={<BsHash className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Input
              placeholder="مثال: 3"
              value={formData.id}
              onChange={(e) => updateField("id", e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold w-full placeholder:text-gray-300 placeholder:font-normal text-sm"
            />
          </FilterField>

          {/* Category */}
          <FilterField
            label="نوع العقار"
            icon={<BsHouse className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Select
              value={formData.category_id}
              onValueChange={(v) => updateField("category_id", v)}
            >
              <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem
                  value="all"
                  className="focus:bg-main-green/10 font-medium"
                >
                  الكل
                </SelectItem>
                {categories?.map((cat: any) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    className="focus:bg-main-green/10"
                  >
                    {locale === "ar"
                      ? cat.name_ar || cat.name
                      : cat.name_en || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {/* City */}
          <FilterField
            label={t("add_deal.city")}
            icon={<BsMap className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Select
              value={formData.city_id}
              onValueChange={(v) => updateField("city_id", v)}
            >
              <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors text-sm">
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem
                  value="all"
                  className="focus:bg-main-green/10 font-medium"
                >
                  الكل
                </SelectItem>
                {cities?.map((city: any) => (
                  <SelectItem
                    key={city.id}
                    value={city.id.toString()}
                    className="focus:bg-main-green/10"
                  >
                    {locale === "ar"
                      ? city.name_ar || city.name
                      : city.name_en || city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {/* District */}
          <FilterField
            label={t("add_deal.district")}
            icon={<BsGeoAlt className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Input
              placeholder="مثال: التجمع الخامس"
              value={formData.district}
              onChange={(e) => updateField("district", e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold w-full placeholder:text-gray-300 placeholder:font-normal text-sm"
            />
          </FilterField>

          {/* Min Area */}
          <FilterField
            label={t("add_deal.min_area")}
            icon={
              <BsArrowsFullscreen className="text-gray-400 w-4 h-4 shrink-0" />
            }
          >
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="المساحة بالمتر"
                value={formData.min_area}
                onChange={(e) => updateField("min_area", e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold w-full placeholder:text-gray-300 placeholder:font-normal text-sm"
              />
            </div>
          </FilterField>

          {/* Rooms */}
          <FilterField
            label={t("property_details.fields.rooms")}
            icon={<BsDoorOpen className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Select
              value={formData.rooms}
              onValueChange={(v) => updateField("rooms", v)}
            >
              <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem
                  value="any"
                  className="focus:bg-main-green/10 font-medium"
                >
                  الكل
                </SelectItem>
                <SelectItem value="1" className="focus:bg-main-green/10">
                  1+
                </SelectItem>
                <SelectItem value="2" className="focus:bg-main-green/10">
                  2+
                </SelectItem>
                <SelectItem value="3" className="focus:bg-main-green/10">
                  3+
                </SelectItem>
                <SelectItem value="4" className="focus:bg-main-green/10">
                  4+
                </SelectItem>
                <SelectItem value="5" className="focus:bg-main-green/10">
                  5+
                </SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          {/* Bathrooms */}
          <FilterField
            label={t("property_details.fields.bathrooms")}
            icon={<BsDroplet className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Select
              value={formData.bathrooms}
              onValueChange={(v) => updateField("bathrooms", v)}
            >
              <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem
                  value="any"
                  className="focus:bg-main-green/10 font-medium"
                >
                  الكل
                </SelectItem>
                <SelectItem value="1" className="focus:bg-main-green/10">
                  1+
                </SelectItem>
                <SelectItem value="2" className="focus:bg-main-green/10">
                  2+
                </SelectItem>
                <SelectItem value="3" className="focus:bg-main-green/10">
                  3+
                </SelectItem>
                <SelectItem value="4" className="focus:bg-main-green/10">
                  4+
                </SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          {/* Finishing */}
          <FilterField
            label={t("property_details.fields.finishing_type")}
            icon={<BsLayers className="text-gray-400 w-4 h-4 shrink-0" />}
          >
            <Select
              value={formData.finishing_type}
              onValueChange={(v) => updateField("finishing_type", v)}
            >
              <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-5 bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem
                  value="all"
                  className="focus:bg-main-green/10 font-medium"
                >
                  الكل
                </SelectItem>
                <SelectItem value="luxury" className="focus:bg-main-green/10">
                  فاخر
                </SelectItem>
                <SelectItem
                  value="super_luxury"
                  className="focus:bg-main-green/10"
                >
                  سوبر لوكس
                </SelectItem>
                <SelectItem value="good" className="focus:bg-main-green/10">
                  جيد
                </SelectItem>
                <SelectItem value="basic" className="focus:bg-main-green/10">
                  بسيط
                </SelectItem>
                <SelectItem value="none" className="focus:bg-main-green/10">
                  بدون تشطيب
                </SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {/* Search Button Area */}
        <div className="w-full flex justify-end p-2 px-3 pt-0 mt-2">
          <Button
            onClick={handleSearch}
            className="bg-main-green hover:bg-main-green/90 px-8 h-9 text-sm font-bold rounded-lg shadow-sm shadow-main-green/20 group transition-all"
          >
            <Search className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2 group-hover:scale-110 transition-transform" />
            بحث وتصفية
          </Button>
        </div>
      </div>
    </div>
  );
}
