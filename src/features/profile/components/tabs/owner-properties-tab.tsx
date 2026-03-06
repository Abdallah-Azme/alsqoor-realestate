"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiHome,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyPropertyCard from "./my-property-card";
import Image from "next/image";
import SmartPagination, {
  usePagination,
} from "@/components/shared/smart-pagination";
import { motion } from "motion/react";
import {
  useUserProperties,
  useDeleteProperty,
} from "@/features/properties/hooks/use-properties";
import { toast } from "sonner";
import EmptyState from "@/components/shared/empty-state";

const ITEMS_PER_PAGE = 10;

interface OwnerPropertiesTabProps {
  onEditProperty?: (property: any) => void;
  onAddProperty?: () => void;
}

const OwnerPropertiesTab = ({
  onEditProperty,
  onAddProperty,
}: OwnerPropertiesTabProps) => {
  const t = useTranslations("Profile");
  const tOwner = useTranslations("owner_properties");
  const tCommon = useTranslations("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: propertiesData, isLoading } = useUserProperties({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
  });

  const deleteMutation = useDeleteProperty();

  const properties = propertiesData?.data || [];
  const meta = propertiesData?.meta;
  const totalPages = meta?.lastPage || 1;

  // Local filter for search (since API might not support search in /user/properties)
  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        tOwner("delete_confirm") ||
          "Are you sure you want to delete this property?",
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success(
          tOwner("delete_success") || "Property deleted successfully",
        );
      } catch (error) {
        toast.error(tOwner("delete_error") || "Failed to delete property");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Action */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Input
            placeholder={t("search_ad_placeholder")}
            className="ps-10 h-11 bg-white border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute start-3 top-3.5 text-gray-400" />
        </div>

        {/* Add New Property Button — only shown when there is data */}
        {filteredProperties.length > 0 && (
          <Button
            onClick={onAddProperty}
            className="w-full md:w-auto bg-main-green hover:bg-main-green/90 text-white h-11 px-6 rounded-lg transition-all font-bold flex items-center justify-center gap-2 shadow-sm shadow-main-green/20"
          >
            <FiPlus className="w-5 h-5" />
            <span>{t("add_new_ad")}</span>
          </Button>
        )}
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="h-48 w-full bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
                <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <MyPropertyCard
                key={property.id}
                property={property as any}
                onEdit={() => onEditProperty?.(property)}
                viewHref={`/ads/${(property as any).slug}`}
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
        <EmptyState
          title={tOwner("no_properties")}
          description={
            t("no_properties_description") ||
            "بادر بإضافة إعلانك الأول الآن بكل سهولة من خلال الضغط على الزر أدناه."
          }
          buttonText={t("add_new_ad")}
          onAction={onAddProperty}
        />
      )}
    </div>
  );
};

export default OwnerPropertiesTab;
