"use client";

import SmartPagination from "@/components/shared/smart-pagination";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import { useRealEstateProperties } from "@/features/properties/hooks/use-properties";
import { useAdLimit } from "@/hooks/use-ad-limit";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import MyPropertyCard from "./my-property-card";

const ITEMS_PER_PAGE = 6;

const RealEstateTab = () => {
  const t = useTranslations("Profile");
  const [currentPage, setCurrentPage] = useState(1);
  const { checkCanAddFeatured } = useAdLimit();

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
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
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
        {t("load_properties_failed")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Action */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">


        {/* Add New Ad Button */}
        {properties.length > 0 && (
          <CreateMarketplacePropertyDialog
            triggerClassName="w-full md:w-auto ms-auto bg-white hover:bg-gray-50 text-main-green border border-main-green/30 h-11 gap-2"
            buttonText={t("add_property")}
            onBeforeOpen={checkCanAddFeatured}
          />
        )}
      </div>

      {/* Grid */}
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <MyPropertyCard
                key={property.id}
                property={property}
                showConvertButton={!property.isConverted}
                viewHref={`/marketplace/${property.slug}`}
                hideDeleteButton
              />
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6 mt-6">
          <div className="bg-main-green/10 p-6 rounded-full">
            <FiPlus className="h-10 w-10 text-main-green" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-main-navy">
              {t("no_properties")}
            </h3>
            <p className="text-gray-500 max-w-sm px-4">
              {t("no_properties_description")}
            </p>
          </div>
          <CreateMarketplacePropertyDialog
            triggerClassName="bg-main-green hover:bg-main-green/90 text-white gap-2 px-8 h-11 rounded-md transition-all font-medium flex items-center justify-center"
            buttonText={t("add_property")}
            onBeforeOpen={checkCanAddFeatured}
          />
        </div>
      )}
    </div>
  );
};

export default RealEstateTab;
