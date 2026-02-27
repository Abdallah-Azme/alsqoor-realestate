"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyPropertyCard from "./my-property-card";
import { useRealEstateProperties } from "@/features/properties/hooks/use-properties";
import SmartPagination from "@/components/shared/smart-pagination";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";

const ITEMS_PER_PAGE = 6;

const RealEstateTab = () => {
  const t = useTranslations("Profile");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: propertiesData,
    isLoading,
    error,
  } = useRealEstateProperties({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
  });

  const properties = Array.isArray(propertiesData)
    ? propertiesData
    : propertiesData?.data || [];
  const meta = !Array.isArray(propertiesData) ? propertiesData?.meta : null;
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
        {t("error_loading") || "Failed to load real estate properties"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Action */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        {/* <div className="relative w-full md:w-96">
          <Input
            placeholder={t("search_ad_placeholder") || "Search"}
            className="ps-10 h-11 bg-white border-gray-200"
          />
          <FiSearch className="absolute start-3 top-3.5 text-gray-400" />
        </div> */}

        {/* Add New Ad Button */}
        <CreateMarketplacePropertyDialog
          triggerClassName="w-full md:w-auto ms-auto bg-white hover:bg-gray-50 text-main-green border border-main-green/30 h-11 gap-2"
          buttonText={t("add_new_ad") || "Add New Property"}
        />
      </div>

      {/* Grid */}
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <MyPropertyCard key={property.id} property={property} />
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
          {t("no_properties") || "No properties found."}
        </div>
      )}
    </div>
  );
};

export default RealEstateTab;
