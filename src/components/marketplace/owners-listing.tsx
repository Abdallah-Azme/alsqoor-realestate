"use client";

import { useState, useMemo, useContext } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import OwnerPropertyCard from "./owner-property-card";
import OwnerFilterDialog, { OwnerFilterOption } from "./owner-filter-dialog";
import OwnerSortDialog, { OwnerSortOption } from "./owner-sort-dialog";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/user-context";

import { propertiesService } from "@/features/properties/services/properties.service";
import { useQuery } from "@tanstack/react-query";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";

// Helper to parse tab ID to property type and operation
const parseTabId = (tabId: string) => {
  if (tabId === "all")
    return { propertyType: undefined, operationType: undefined };
  const [type, op] = tabId.split("_");
  return { propertyType: type, operationType: op };
};

const OwnersListing = () => {
  const t = useTranslations("marketplace");
  const tPage = useTranslations("home.estates_page");
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const locale = useLocale();
  const router = useRouter();
  // Simplification: Removed inner filters and sub-tabs to match marketplace design
  const [sortOption, setSortOption] = useState<OwnerSortOption>("default");
  const [showSortDialog, setShowSortDialog] = useState(false);

  // Fetch owner properties
  const { data: response, isLoading } = useQuery({
    queryKey: ["marketplace-owners", sortOption],
    queryFn: () => {
      const params: any = {
        type: "owner",
      };
      return propertiesService.getMarketplaceProperties(params);
    },
  });

  const properties = response?.data || [];
  const loading = isLoading;

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    // Map API properties to component format first
    let result = properties.map((p) => ({
      id: String(p.id),
      title: p.title,
      propertyType: p.propertyType || "",
      operationType: (p.transactionType === "buy" ? "sale" : "rent") as
        | "sale"
        | "rent",
      price: Number(p.price || 0),
      formattedPrice: Number(p.price || 0).toLocaleString(),
      area: Number(p.area || 0),
      image: p.image || "",
      location: p.location || p.city || "",
      city: p.city || "",
      timePosted:
        p.timePosted ||
        (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""),
      offersCount: p.offersCount || 0,
      isVerified: p.isVerified,
      isSubscribersOnly: false,
      isUnread: false,
    }));

    // Apply sorting
    switch (sortOption) {
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
  }, [properties, sortOption]);

  return (
    <div className="space-y-6">
      {/* 
          Inner filters (Property Types tabs) removed 
          to match simplified marketplace design.
      */}

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
          {filteredAndSortedProperties.length > 0 && (
            <CreateMarketplacePropertyDialog
              triggerClassName="bg-[#3fb38b] hover:bg-[#3fb38b]/90 text-white gap-2 h-9 px-4 text-sm whitespace-nowrap shrink-0 shadow-sm"
              buttonText={tPage("add_property")}
              defaultRole="owner"
            />
          )}

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
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100/80 rounded-xl h-80 animate-pulse border border-gray-100"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="bg-main-green/10 p-6 rounded-full">
            <FiPlus className="h-10 w-10 text-main-green" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-main-navy">
              {t("no_properties")}
            </h3>
            <p className="text-gray-500 max-w-sm">
              {t("no_properties_description") ||
                "بادر بإضافة أول عقار في السوق الآن بكل سهولة من خلال الضغط على الزر أدناه."}
            </p>
          </div>
          <CreateMarketplacePropertyDialog
            triggerClassName="bg-main-green hover:bg-main-green/90 text-white gap-2 px-8"
            buttonText={tPage("add_property")}
            defaultRole="owner"
          />
        </div>
      )}

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
