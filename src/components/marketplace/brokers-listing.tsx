"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import BrokerPropertyCard from "./broker-property-card";
import SortDialog, { SortOption } from "./sort-dialog";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { propertiesService } from "@/features/properties/services/properties.service";
import { AddPropertyDialog } from "@/features/properties/ui";

const BrokersListing = () => {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const tSort = useTranslations("marketplace.sort_dialog");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [showSortDialog, setShowSortDialog] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  // Fetch brokers properties
  const { data: response, isLoading } = useQuery({
    queryKey: ["marketplace-brokers", activeCategory, activeFilter, sortOption],
    queryFn: () =>
      propertiesService.getMarketplaceProperties({
        type: activeCategory !== "all" ? "agent" : undefined,
        agent_type: activeCategory !== "all" ? activeCategory : undefined,
        status: activeFilter !== "all" ? activeFilter : undefined,
      }),
  });

  const properties = response?.data || [];
  const loading = isLoading;

  // Client-side sorting (since API might not support all sort options yet)
  const sortedProperties = useMemo(() => {
    let result = [...properties];

    // Apply sorting
    switch (sortOption) {
      case "highest_commission":
        result.sort(
          (a, b) =>
            Number(b.commissionPercentage || 0) -
            Number(a.commissionPercentage || 0),
        );
        break;
      case "lowest_commission":
        result.sort(
          (a, b) =>
            Number(a.commissionPercentage || 0) -
            Number(b.commissionPercentage || 0),
        );
        break;
      case "highest_price":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "lowest_price":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "largest_area":
        result.sort((a, b) => Number(b.area || 0) - Number(a.area || 0));
        break;
      case "smallest_area":
        result.sort((a, b) => Number(a.area || 0) - Number(b.area || 0));
        break;
      default:
        break;
    }

    return result;
  }, [properties, sortOption]);

  // Format properties for card component
  const formattedProperties = sortedProperties.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    price: Number(p.price || 0),
    formattedPrice: Number(p.price || 0).toLocaleString(),
    area: Number(p.area || 0),
    rooms: p.rooms || 0,
    location: p.location || p.city || "",
    city: p.city || "",
    image: p.image || "",
    commissionPercentage: Number(p.commissionPercentage || 0),
    timePosted:
      p.timePosted || p.createdAt
        ? new Date(p.createdAt).toLocaleDateString()
        : "",
    status: (p.status as any) || "new",
  }));

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
            {formattedProperties.length}
          </span>{" "}
          {t("opportunity")}
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
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
          {formattedProperties.map((property, index) => (
            <BrokerPropertyCard
              key={property.id}
              property={property}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {formattedProperties.length === 0 && !loading && (
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

      {/* Add Property Dialog */}
      <AddPropertyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default BrokersListing;
