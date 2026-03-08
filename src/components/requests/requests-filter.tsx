"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { propertiesService } from "@/features/properties/services/properties.service";
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
  { key: "buy", icon: "💰" },
  { key: "rent", icon: "🔑" },
];

const RequestsFilter = ({ onSubmit }: RequestsFilterProps) => {
  const t = useTranslations("propertyRequestsPage");
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Fetch countries on mount
  useEffect(() => {
    propertiesService.getCountries().then((data) => setCountries(data));
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      propertiesService
        .getCities(selectedCountry)
        .then((data) => setCities(data));
      setSelectedCity(""); // Reset city when country changes
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  const handleTypeClick = (typeKey: string) => {
    setActiveType(typeKey);
    handleSubmit({ request_type: typeKey === "all" ? undefined : typeKey });
  };

  /**
   * Filter the property requests based on user selection
   * search: maps to the keyword/details search
   * country_id: filters by country
   * city_id: filters by city
   */
  const handleSubmit = (additionalFilters: Record<string, any> = {}) => {
    const filters = {
      request_type: activeType === "all" ? undefined : activeType,
      search: search,
      country_id: selectedCountry ? Number(selectedCountry) : undefined,
      city_id: selectedCity ? Number(selectedCity) : undefined,
      sort_by: sortBy,
      ...additionalFilters,
    };
    onSubmit?.(filters);
  };

  const handleSearch = () => {
    handleSubmit();
  };

  const handleClear = () => {
    setActiveType("all");
    setSearch("");
    setSortBy("newest");
    setSelectedCountry("");
    setSelectedCity("");
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

      {/* Search and location selection row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Keyword search */}
        <div className="relative">
          <Input
            placeholder={t("filter.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-gray-300 rounded-lg h-12 pe-10"
          />
          <FiSearch className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        </div>

        {/* Country filter */}
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="h-12 border-gray-300 rounded-lg">
            <SelectValue placeholder={t("fields.country")} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={String(country.id)}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City filter */}
        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
          disabled={!selectedCountry}
        >
          <SelectTrigger className="h-12 border-gray-300 rounded-lg">
            <SelectValue placeholder={t("fields.city")} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={String(city.id)}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-12 border-gray-300 rounded-lg">
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
      </div>

      {/* Action buttons row */}
      <div className="flex justify-end gap-2 text-end">
        <Button
          onClick={handleClear}
          variant="outline"
          className="h-12 px-8 border-red-500 text-red-500 hover:bg-red-50"
        >
          {t("filter.clear")}
        </Button>
        <Button
          onClick={handleSearch}
          className="bg-main-green hover:bg-main-green/90 text-white h-12 px-12 gap-2"
        >
          <FiSearch />
          {t("filter.search")}
        </Button>
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
