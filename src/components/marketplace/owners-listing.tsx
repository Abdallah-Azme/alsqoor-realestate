"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import OwnerPropertyCard from "./owner-property-card";
import OwnerFilterDialog, { OwnerFilterOption } from "./owner-filter-dialog";
import OwnerSortDialog, { OwnerSortOption } from "./owner-sort-dialog";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Mock data for development
const mockOwnerProperties = [
  {
    id: "1",
    title: "شقة للإيجار",
    propertyType: "apartment",
    operationType: "rent" as const,
    price: 26000,
    formattedPrice: "26,000",
    area: 128,
    location: "جدة، الحمراء",
    city: "جدة",
    timePosted: "منذ ساعتين",
    offersCount: 0,
    isVerified: true,
    isSubscribersOnly: false,
    isUnread: true,
  },
  {
    id: "2",
    title: "شقة للإيجار",
    propertyType: "apartment",
    operationType: "rent" as const,
    price: 20000,
    formattedPrice: "20,000",
    area: 145,
    location: "مكة المكرمة، العدل",
    city: "مكة المكرمة",
    timePosted: "منذ 3 ساعات",
    offersCount: 2,
    isVerified: true,
    isSubscribersOnly: false,
    isUnread: true,
  },
  {
    id: "3",
    title: "دور للإيجار",
    propertyType: "floor",
    operationType: "rent" as const,
    price: 36000,
    formattedPrice: "36,000",
    area: 300,
    location: "المدينة المنورة، حمراء الأسد",
    city: "المدينة المنورة",
    timePosted: "منذ 4 ساعات",
    offersCount: 3,
    isVerified: true,
    isSubscribersOnly: false,
    isUnread: true,
  },
  {
    id: "4",
    title: "عمارة تجارية سكنية للبيع",
    propertyType: "building",
    operationType: "sale" as const,
    price: 7000000,
    formattedPrice: "7,000,000",
    area: 750,
    location: "الرياض، السويدي الغربي",
    city: "الرياض",
    timePosted: "منذ 5 ساعات",
    offersCount: 22,
    isVerified: true,
    isSubscribersOnly: true,
    isUnread: false,
  },
  {
    id: "5",
    title: "شقة للبيع",
    propertyType: "apartment",
    operationType: "sale" as const,
    price: 700000,
    formattedPrice: "700,000",
    area: 256,
    location: "أبها، الرفيق",
    city: "أبها",
    timePosted: "منذ 5 ساعات",
    offersCount: 0,
    isVerified: true,
    isSubscribersOnly: false,
    isUnread: true,
  },
];

const OwnersListing = () => {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const [properties] = useState(mockOwnerProperties);
  const [loading] = useState(false);
  const [activePropertyType, setActivePropertyType] = useState("all");
  const [filterOption, setFilterOption] = useState<OwnerFilterOption>("all");
  const [sortOption, setSortOption] = useState<OwnerSortOption>("default");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showSortDialog, setShowSortDialog] = useState(false);

  const propertyTypeTabs = [
    { id: "all", label: t("filter.all") },
    { id: "villa_sale", label: t("owner.property_types.villa_sale") },
    { id: "land_sale", label: t("owner.property_types.land_sale") },
    { id: "apartment_sale", label: t("owner.property_types.apartment_sale") },
    { id: "apartment_rent", label: t("owner.property_types.apartment_rent") },
    { id: "floor_sale", label: t("owner.property_types.floor_sale") },
    { id: "floor_rent", label: t("owner.property_types.floor_rent") },
    { id: "building_sale", label: t("owner.property_types.building_sale") },
    { id: "building_rent", label: t("owner.property_types.building_rent") },
    { id: "shop_sale", label: t("owner.property_types.shop_sale") },
    { id: "shop_rent", label: t("owner.property_types.shop_rent") },
  ];

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // Apply filter
    switch (filterOption) {
      case "unread":
        result = result.filter((p) => p.isUnread);
        break;
      case "read":
        result = result.filter((p) => !p.isUnread);
        break;
      case "active":
        result = result.filter((p) => p.offersCount > 0);
        break;
      // Add more filter logic as needed
      default:
        break;
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        // In real implementation, sort by date
        break;
      case "oldest":
        // In real implementation, sort by date descending
        break;
      case "largest_area":
        result.sort((a, b) => b.area - a.area);
        break;
      case "smallest_area":
        result.sort((a, b) => a.area - b.area);
        break;
      case "highest_price":
        result.sort((a, b) => b.price - a.price);
        break;
      case "lowest_price":
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    return result;
  }, [properties, filterOption, sortOption]);

  return (
    <div className="space-y-6">
      {/* Property Type Filter Tabs */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex items-center gap-2 pb-2">
          {/* Search Button */}
          <button className="shrink-0 px-4 py-2 bg-main-green text-white rounded-lg text-sm flex items-center gap-2 hover:bg-main-green/90 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {t("search")}
          </button>

          {propertyTypeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePropertyType(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activePropertyType === tab.id
                  ? "bg-main-navy text-white border-main-navy"
                  : "bg-white text-gray-600 border-gray-300 hover:border-main-green"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count and sort/filter */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">
            {filteredAndSortedProperties.length}
          </span>{" "}
          {t("owner.request")}
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={() =>
              router.push("/profile?tab=my-properties&action=add-property")
            }
            className="bg-main-green hover:bg-main-green/90 text-white gap-2 h-9 px-4 text-sm"
          >
            <FiPlus />
            {t("add_property")}
          </Button>

          {/* Sort Button */}
          <button
            onClick={() => setShowSortDialog(true)}
            className="flex items-center gap-2 text-sm text-main-green hover:text-main-green/80 transition-colors bg-main-green/10 px-3 py-1.5 rounded-lg"
          >
            {t("owner.sort_label")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterDialog(true)}
            className="flex items-center gap-2 text-sm text-main-green hover:text-main-green/80 transition-colors bg-main-green/10 px-3 py-1.5 rounded-lg"
          >
            {t("owner.filter_label")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-36 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filteredAndSortedProperties.map((property, index) => (
            <OwnerPropertyCard
              key={property.id}
              property={property}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {filteredAndSortedProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("no_properties")}</p>
        </div>
      )}

      {/* Filter Dialog */}
      <OwnerFilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        currentFilter={filterOption}
        onFilterChange={setFilterOption}
      />

      {/* Sort Dialog */}
      <OwnerSortDialog
        open={showSortDialog}
        onOpenChange={setShowSortDialog}
        currentSort={sortOption}
        onSortChange={setSortOption}
      />
    </div>
  );
};

export default OwnersListing;
