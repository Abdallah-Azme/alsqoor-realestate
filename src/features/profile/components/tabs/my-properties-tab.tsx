"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyPropertyCard from "./my-property-card";
import SmartPagination, {
  usePagination,
} from "@/components/shared/smart-pagination";

// Mock data
const mockProperties = [
  {
    id: "1",
    title: "فيلا جديدة في جدة",
    price: 788000,
    formattedPrice: "788,000",
    area: 224,
    rooms: 5,
    bathrooms: 2,
    garages: 2,
    location: "جدة، السعودية",
    city: "جدة",
    image: "/images/state.png",
    timePosted: "منذ 4 أيام",
    isSerious: true,
  },
  {
    id: "2",
    title: "فيلا جديدة في جدة",
    price: 788000,
    formattedPrice: "788,000",
    area: 224,
    rooms: 5,
    bathrooms: 2,
    garages: 2,
    location: "جدة، السعودية",
    city: "جدة",
    image: "/images/state.png",
    timePosted: "منذ 4 أيام",
    isSerious: true,
  },
  {
    id: "3",
    title: "فيلا جديدة في جدة",
    price: 788000,
    formattedPrice: "788,000",
    area: 224,
    rooms: 5,
    bathrooms: 2,
    garages: 2,
    location: "جدة، السعودية",
    city: "جدة",
    image: "/images/state.png",
    timePosted: "منذ 4 أيام",
    isSerious: true,
  },
];

const ITEMS_PER_PAGE = 6;

const MyPropertiesTab = () => {
  const t = useTranslations("Profile");
  const [currentPage, setCurrentPage] = useState(1);

  // Use the reusable pagination hook
  const { totalPages, getPageItems } = usePagination(
    mockProperties,
    ITEMS_PER_PAGE,
  );
  const currentProperties = getPageItems(currentPage);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <MyPropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      <SmartPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-8"
      />
    </div>
  );
};

export default MyPropertiesTab;
