"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import MyPropertyCard from "./my-property-card";
import SmartPagination from "@/components/shared/smart-pagination";
import { useUserProperties } from "@/features/properties/hooks/use-properties";
import StartMarketingDialog from "../dialogs/start-marketing-dialog";
import EmptyState from "@/components/shared/empty-state";

const ITEMS_PER_PAGE = 6;

interface BrokerPropertiesTabProps {
  onEditProperty?: (property: any) => void;
  onAddProperty?: () => void;
}

const BrokerPropertiesTab = ({
  onEditProperty,
  onAddProperty,
}: BrokerPropertiesTabProps) => {
  const t = useTranslations("Profile");
  const [currentPage, setCurrentPage] = useState(1);
  const [marketingDialogOpen, setMarketingDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );

  const { data: propertiesData, isLoading } = useUserProperties({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
  });

  const properties =
    propertiesData?.data ||
    (Array.isArray(propertiesData) ? propertiesData : []);
  const meta = (propertiesData as any)?.meta;
  const totalPages = meta?.lastPage || 1;

  return (
    <div className="space-y-6">
      {/* Add New Property Button */}
      <div className="flex justify-end items-center">
        <Button
          onClick={onAddProperty}
          className="w-full md:w-auto bg-main-green hover:bg-main-green/90 text-white h-11 px-6 rounded-lg transition-all font-bold flex items-center justify-center gap-2 shadow-sm shadow-main-green/20"
        >
          <FiPlus className="w-5 h-5" />
          <span>{t("add_new_ad")}</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 h-80 animate-pulse"
            />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="h-full">
                <MyPropertyCard
                  property={property}
                  onEdit={() => onEditProperty?.(property)}
                  viewHref={`/ads/${property.slug}`}
                  hideDeleteButton
                />
              </div>
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
        <EmptyState
          title={t("no_properties")}
          description={t("no_ads_empty_description")}
          buttonText={t("add_new_ad")}
          onAction={onAddProperty}
        />
      )}

      {/* Start Marketing Dialog */}
      <StartMarketingDialog
        open={marketingDialogOpen}
        onOpenChange={setMarketingDialogOpen}
        propertyId={selectedPropertyId}
      />
    </div>
  );
};

export default BrokerPropertiesTab;
