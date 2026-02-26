"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyPropertyCard from "./my-property-card";
import { useUserProperties } from "@/features/properties/hooks/use-properties";
import SmartPagination, {
  usePagination,
} from "@/components/shared/smart-pagination";

const ITEMS_PER_PAGE = 6;

const MyPropertiesTab = () => {
  const t = useTranslations("Profile");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: propertiesData,
    isLoading,
    error,
  } = useUserProperties({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
  });

  const properties = propertiesData?.data || [];
  const meta = propertiesData?.meta;
  const totalPages = meta?.lastPage || 1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-500 bg-white rounded-xl border border-gray-200">
        {t("error_loading") || "Failed to load properties"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Action */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Input
            placeholder={t("search_ad_placeholder")}
            className="ps-10 h-11 bg-white border-gray-200"
          />
          <FiSearch className="absolute start-3 top-3.5 text-gray-400" />
        </div>

        {/* Add New Ad Button */}
        <Button className="w-full md:w-auto bg-white hover:bg-gray-50 text-main-green border border-main-green/30 h-11 gap-2">
          <FiPlus />
          {t("add_new_ad")}
        </Button>
      </div>

      {/* Grid */}
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <MyPropertyCard key={property.id} property={property as any} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <SmartPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          )}
        </>
      ) : (
        <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
          {t("no_properties")}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesTab;
