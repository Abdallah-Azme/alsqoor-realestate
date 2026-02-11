"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import BrokerPropertyCard from "./broker-property-card";
import SortDialog, { SortOption } from "./sort-dialog";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Mock data for development
const mockBrokerProperties = [
  {
    id: "1",
    slug: "villa-for-sale-jeddah",
    title: "فيلا للبيع",
    price: 1850000,
    formattedPrice: "1,850,000",
    area: 360,
    rooms: 9,
    location: "حي الرياض",
    city: "جدة",
    image: "/images/state.png",
    commissionPercentage: 50,
    timePosted: "منذ 24 دقيقة",
    status: "new" as const,
    type: "office",
  },
  {
    id: "2",
    slug: "land-for-sale-kaec",
    title: "أرض سكنية للبيع",
    price: 3200014.38,
    formattedPrice: "3,200,014.38",
    area: 1364.03,
    location: "مدينة الملك عبدالله الاقتصادية",
    city: "الملك عبدالله",
    image: "/images/state.png",
    commissionPercentage: 50,
    timePosted: "منذ 23 دقيقة",
    status: "new" as const,
    type: "individual",
  },
  {
    id: "3",
    slug: "apartment-for-sale-kaec",
    title: "شقة للبيع",
    price: 1100000,
    formattedPrice: "1,100,000",
    area: 125.9,
    location: "مدينة الملك عبدالله الاقتصادية",
    city: "الملك عبدالله",
    image: "/images/state.png",
    commissionPercentage: 20,
    timePosted: "منذ 33 دقيقة",
    status: "marketing" as const,
    type: "office",
  },
  {
    id: "4",
    slug: "apartment-for-sale-madinah",
    title: "شقة للبيع",
    price: 690000,
    formattedPrice: "690,000",
    area: 172.27,
    rooms: 4,
    location: "المدينة المنورة، شوران",
    city: "المدينة المنورة",
    image: "/images/state.png",
    commissionPercentage: 10,
    timePosted: "منذ 41 دقيقة",
    status: "half_deal" as const,
    type: "individual",
  },
];

const BrokersListing = () => {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const tSort = useTranslations("marketplace.sort_dialog");
  const [properties] = useState(mockBrokerProperties);
  const [loading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [showSortDialog, setShowSortDialog] = useState(false);

  const filterTabs = [
    { id: "all", label: t("filter.all") },
    { id: "new", label: t("broker.status.new") },
    { id: "marketing", label: t("broker.status.marketing") },
    { id: "half_deal", label: t("broker.status.half_deal") },
    { id: "limited", label: t("broker.status.limited") },
  ];

  const categoryTabs = [
    { id: "all", label: t("broker.types.all") },
    { id: "individual", label: t("broker.types.individual") },
    { id: "office", label: t("broker.types.office") },
  ];

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = properties;

    // Filter by User Type (Individual/Office)
    if (activeCategory !== "all") {
      result = result.filter((p) => p.type === activeCategory);
    }

    // Filter by Status
    if (activeFilter !== "all") {
      result = result.filter((p) => p.status === activeFilter);
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        // In real implementation, sort by date
        break;
      case "highest_commission":
        result.sort((a, b) => b.commissionPercentage - a.commissionPercentage);
        break;
      case "lowest_commission":
        result.sort((a, b) => a.commissionPercentage - b.commissionPercentage);
        break;
      case "highest_price":
        result.sort((a, b) => b.price - a.price);
        break;
      case "lowest_price":
        result.sort((a, b) => a.price - b.price);
        break;
      case "largest_area":
        result.sort((a, b) => b.area - a.area);
        break;
      case "smallest_area":
        result.sort((a, b) => a.area - b.area);
        break;
      default:
        break;
    }

    return result;
  }, [properties, activeFilter, sortOption, activeCategory]);

  const getSortLabel = () => {
    if (sortOption === "default") {
      return t("sort_by");
    }
    return tSort(sortOption);
  };

  return (
    <div className="space-y-6">
      {/* Sub-filters */}
      <div className="space-y-4 mb-6">
        {/* Category Filter (Individual/Office) */}
        <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-lg w-fit">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === tab.id
                  ? "bg-white text-main-green shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === tab.id
                    ? "bg-main-green text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Button */}
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
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
        </div>
      </div>

      {/* Results count and sort */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">
            {filteredAndSortedProperties.length}
          </span>{" "}
          {t("opportunity")}
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/advertisements/add")}
            className="bg-main-green hover:bg-main-green/90 text-white gap-2 h-9 px-4 text-sm"
          >
            <FiPlus />
            {t("add_property")}
          </Button>

          {/* Sort Button */}
          <button
            onClick={() => setShowSortDialog(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-main-green transition-colors bg-gray-100 px-3 py-2 rounded-lg"
          >
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
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="10" y2="18" />
            </svg>
            {getSortLabel()}
          </button>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-48 animate-pulse"
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
          className="space-y-4"
        >
          {filteredAndSortedProperties.map((property, index) => (
            <BrokerPropertyCard
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

      {/* Sort Dialog */}
      <SortDialog
        open={showSortDialog}
        onOpenChange={setShowSortDialog}
        currentSort={sortOption}
        onSortChange={setSortOption}
      />
    </div>
  );
};

export default BrokersListing;
