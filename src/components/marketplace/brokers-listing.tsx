"use client";

import { useState, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import BrokerPropertyCard from "./broker-property-card";
import SortDialog, { SortOption } from "./sort-dialog";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import EmptyState from "@/components/shared/empty-state";
import { useRouter, useSearchParams } from "next/navigation";
import { propertiesService } from "@/features/properties/services/properties.service";
import { UserContext } from "@/context/user-context";

const BrokersListing = () => {
  const t = useTranslations("marketplace");
  const tPage = useTranslations("home.estates_page");
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tSort = useTranslations("marketplace.sort_dialog");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [showSortDialog, setShowSortDialog] = useState(false);

  // ── Read filter values from URL (set by FilterForm on homepage) ──
  const urlOperationType = searchParams.get("operation_type") || undefined;
  const urlCategoryId = searchParams.get("category_id") || undefined;
  const urlRooms = searchParams.get("rooms") || undefined;
  const urlFinishing = searchParams.get("finishing_type") || undefined;
  const urlMinArea = searchParams.get("min_area") || undefined;
  const urlDistrict = searchParams.get("district") || undefined;
  const urlCountryId = searchParams.get("country_id") || undefined;

  // Simplification: Removed inner status and category filters to match marketplace design
  // FETCH BROKERS PROPERTIES
  const { data: response, isLoading } = useQuery({
    queryKey: [
      "marketplace-brokers",
      sortOption,
      urlOperationType,
      urlCategoryId,
      urlRooms,
      urlFinishing,
      urlMinArea,
      urlDistrict,
    ],
    queryFn: () =>
      propertiesService.searchProperties({
        type: "agent",
        // From URL (hero FilterForm)
        operation_type: urlOperationType,
        category_id: urlCategoryId,
        rooms: urlRooms,
        finishing_type: urlFinishing,
        min_area: urlMinArea,
        district: urlDistrict,
        country_id: urlCountryId,
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
      {/* 
          Inner filters (Individual/Office, Status) removed 
          to match simplified marketplace design.
      */}

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
          {formattedProperties.length > 0 && (
            <CreateMarketplacePropertyDialog
              triggerClassName="bg-[#3fb38b] hover:bg-[#3fb38b]/90 text-white gap-2 h-9 px-4 text-sm whitespace-nowrap shrink-0 shadow-sm"
              buttonText={tPage("add_property")}
              defaultRole="agent"
            />
          )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <EmptyState
          title={t("no_properties")}
          description={
            t("no_properties_description") ||
            "بادر بإضافة أول عقار في السوق الآن بكل سهولة من خلال الضغط على الزر أدناه."
          }
          buttonText={tPage("add_property")}
          actionType="dialog"
          defaultRole="agent"
        />
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
