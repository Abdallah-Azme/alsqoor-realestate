"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
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

interface RequestsFilterProps {
  onSubmit?: (filters: Record<string, any>) => void;
}

const propertyTypes = [
  { key: "all", icon: "🔍" },
  { key: "villa_sale", icon: "🏠" },
  { key: "land_sale", icon: "🏞️" },
  { key: "apartment_sale", icon: "🏢" },
  { key: "apartment_rent", icon: "🏠" },
  { key: "floor_sale", icon: "🏗️" },
  { key: "floor_rent", icon: "🏗️" },
  { key: "villa_rent", icon: "🏠" },
  { key: "shop_sale", icon: "🏪" },
  { key: "shop_rent", icon: "🏪" },
  { key: "warehouse_sale", icon: "🏭" },
  { key: "warehouse_rent", icon: "🏭" },
];

const RequestsFilter = ({ onSubmit }: RequestsFilterProps) => {
  const t = useTranslations("propertyRequestsPage");
  const [activeType, setActiveType] = useState("all");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleTypeClick = (typeKey: string) => {
    setActiveType(typeKey);
    handleSubmit({ type: typeKey });
  };

  const handleSubmit = (additionalFilters: Record<string, any> = {}) => {
    const filters = {
      type: activeType,
      location,
      sortBy,
      ...additionalFilters,
    };
    onSubmit?.(filters);
  };

  const handleSearch = () => {
    handleSubmit();
  };

  const handleClear = () => {
    setActiveType("all");
    setLocation("");
    setSortBy("newest");
    onSubmit?.({});
  };

  return (
    <div className="space-y-4">
      {/* Property type tabs - horizontal scrollable */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {propertyTypes.map((type) => (
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
              <span>{t(`types.${type.key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and sort row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location search */}
        <div className="flex-1 relative">
          <Input
            placeholder={t("filter.location_placeholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-gray-300 rounded-lg h-12 pe-10"
          />
          <IoLocationOutline className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        </div>

        {/* Sort dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 h-12 border-gray-300 rounded-lg">
            <SelectValue placeholder={t("filter.sort_by")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("filter.sort.newest")}</SelectItem>
            <SelectItem value="oldest">{t("filter.sort.oldest")}</SelectItem>
            <SelectItem value="price_low">
              {t("filter.sort.price_low")}
            </SelectItem>
            <SelectItem value="price_high">
              {t("filter.sort.price_high")}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Search and Clear buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="bg-main-green hover:bg-main-green/90 text-white h-12 px-6 gap-2"
          >
            <FiSearch />
            {t("filter.search")}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="h-12 px-4 border-red-500 text-red-500 hover:bg-red-50"
          >
            {t("filter.clear")}
          </Button>
        </div>
      </div>

      {/* Interest tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">{t("filter.interests")}:</span>
        <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          {t("filter.add_interest")}
        </button>
      </div>
    </div>
  );
};

// Mobile-friendly filter panel wrapper
const RequestsFilterPanel = ({ onSubmit }: RequestsFilterProps) => {
  const t = useTranslations("propertyRequestsPage");

  return (
    <div>
      {/* Desktop filter */}
      <div className="max-lg:hidden">
        <RequestsFilter onSubmit={onSubmit} />
      </div>

      {/* Mobile filter sheet */}
      <Sheet>
        <SheetTrigger className="lg:hidden bg-main-green text-white font-bold rounded-t-xl hover:bg-main-green/95 transition-all duration-500 w-full h-12">
          {t("filter.customize_request")}
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <div className="container py-6">
            <SheetHeader className="">
              <SheetTitle className="text-center">
                {t("filter.customize_request")}
              </SheetTitle>
              <SheetDescription className="text-center">
                {t("filter.customize_description")}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <RequestsFilter onSubmit={onSubmit} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RequestsFilterPanel;
