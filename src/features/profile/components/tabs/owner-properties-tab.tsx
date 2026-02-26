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
import { Badge } from "@/components/ui/badge";
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

const ITEMS_PER_PAGE = 10;

interface OwnerPropertiesTabProps {
  onAddProperty?: () => void;
  onEditProperty?: (property: any) => void;
}

const OwnerPropertiesTab = ({
  onAddProperty,
  onEditProperty,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-700">
            {tOwner("status.published")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700">
            {tOwner("status.pending")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700">
            {tOwner("status.rejected")}
          </Badge>
        );
      default:
        return null;
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

        {/* Add New Property Button */}
        <Button
          onClick={onAddProperty}
          className="w-full md:w-auto bg-main-green hover:bg-main-green/90 text-white h-11 gap-2"
        >
          <FiPlus />
          {tOwner("add_property")}
        </Button>
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
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={property.images?.[0] || "/images/state.png"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 start-3">
                    {getStatusBadge(property.status || "pending")}
                  </div>
                  <div className="absolute top-3 end-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-main-navy">
                    {property.area}
                    {tCommon("sqm")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Price */}
                  <div className="flex items-center gap-1 text-main-green font-bold text-lg mb-2">
                    <span>
                      {Number(
                        property.price_min || property.priceMin || 0,
                      ).toLocaleString()}
                    </span>
                    <Image
                      src="/images/ryal.svg"
                      alt={tCommon("sar")}
                      width={14}
                      height={14}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-4 truncate">
                    {property.district},{" "}
                    {typeof property.city === "string"
                      ? property.city
                      : property.city?.name}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-1">
                      <FiEye className="text-main-green" />
                      <span>{property.viewsCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiHome className="text-main-green" />
                      <span>
                        {typeof property.category === "string"
                          ? property.category
                          : property.category?.name || tOwner("property")}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => onEditProperty?.(property)}
                    >
                      <FiEdit className="w-4 h-4" />
                      {tOwner("edit")}
                    </Button>
                    {/* Commented out the delete button temporarily per user request */}
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button> */}
                  </div>
                </div>
              </motion.div>
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
          {tOwner("no_properties")}
        </div>
      )}
    </div>
  );
};

export default OwnerPropertiesTab;
