"use client";

import { useState, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context/user-context";
import { useMarketplaceProperties } from "@/features/marketplace/hooks/use-marketplace-properties";
import { MarketplacePropertyCard } from "@/features/marketplace/components/marketplace-property-card";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

const BrokersListing = () => {
  const t = useTranslations("marketplace");
  const tPage = useTranslations("home.estates_page");
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // ── Read filter values from URL (set by FilterForm on homepage) ──
  const urlOperationType = searchParams.get("operation_type") || undefined;
  const urlCategoryId = searchParams.get("category_id") || undefined;
  const urlRooms = searchParams.get("rooms") || undefined;
  const urlFinishing = searchParams.get("finishing_type") || undefined;
  const urlMinArea = searchParams.get("min_area") || undefined;
  const urlDistrict = searchParams.get("district") || undefined;
  const urlCountryId = searchParams.get("country_id") || undefined;

  // Simplification: Removed inner status and category filters to match marketplace design
  // FETCH BROKERS PROPERTIES using the unified marketplace hook
  const { data: response, isLoading } = useMarketplaceProperties({
    type: "agent",
    per_page: 8,
    // From URL (hero FilterForm)
    operation_type: urlOperationType,
    category_id: urlCategoryId,
    rooms: urlRooms,
    finishing_type: urlFinishing,
    min_area: urlMinArea,
    district: urlDistrict,
    country_id: urlCountryId,
  });

  const properties = response?.data || [];
  const loading = isLoading;

  const getSortLabel = () => {
    return t("sort_by");
  };

  return (
    <div className="space-y-6">
      {/* 
          Inner filters (Individual/Office, Status) removed 
          to match simplified marketplace design.
      */}

      {/* Results count and sort removed as they are handled by main page/unified card */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">{properties.length}</span>{" "}
          {t("opportunity")}
        </p>

        <div className="flex items-center gap-3">
          {properties.length > 0 && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[#3fb38b] hover:bg-[#3fb38b]/90 text-white gap-2 h-9 px-4 text-sm whitespace-nowrap shrink-0 shadow-sm"
            >
              <FiPlus className="text-lg" />
              <span>{tPage("add_property")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {properties.map((property: any, index: number) => (
            <MarketplacePropertyCard
              key={property.id}
              property={property}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {properties.length === 0 && !loading && (
        <EmptyState
          title={t("no_properties")}
          description={
            t("no_properties_description") ||
            "بادر بإضافة أول عقار في السوق الآن بكل سهولة من خلال الضغط على الزر أدناه."
          }
          buttonText={tPage("add_property")}
          onAction={() => setIsAddDialogOpen(true)}
        />
      )}

      <CreateMarketplacePropertyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        defaultRole="agent"
      />
    </div>
  );
};

export default BrokersListing;
