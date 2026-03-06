"use client";

import { useState, useContext } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/user-context";
import { useMarketplaceProperties } from "@/features/marketplace/hooks/use-marketplace-properties";
import { MarketplacePropertyCard } from "@/features/marketplace/components/marketplace-property-card";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

const ITEMS_PER_PAGE = 6;

const DevelopersListing = () => {
  const t = useTranslations("marketplace.developer");
  const tPage = useTranslations("home.estates_page");
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const locale = useLocale();
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const tTypes = useTranslations("advertisements.property_types");
  // Simplification: Removed inner property type tabs to match marketplace design
  const { data: response, isLoading } = useMarketplaceProperties({
    type: "developer",
    per_page: 8,
  });

  const properties = response?.data || [];
  const meta = response?.meta;
  const loading = isLoading;

  return (
    <div className="space-y-6">
      {/* 
          Inner filters (Property Type tabs) removed 
          to match simplified marketplace design.
      */}

      {/* Results count removed as they are handled by main page/unified card if needed */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">{meta?.total || 0}</span>{" "}
          {t("project")}
        </p>

        <div className="flex items-center gap-3">
          {properties.length > 0 && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-main-green hover:bg-main-green/90 text-white gap-2 h-9 px-4 text-sm whitespace-nowrap shrink-0 shadow-sm"
            >
              <FiPlus className="text-lg" />
              <span>{tPage("add_property")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-80 animate-pulse border border-gray-100"
            />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <>
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
        </>
      ) : null}

      {properties.length === 0 && !loading && (
        <EmptyState
          title={t("no_projects")}
          description={
            t("no_projects_description") ||
            "بادر بإضافة أول عقار في السوق الآن بكل سهولة من خلال الضغط على الزر أدناه."
          }
          buttonText={tPage("add_property")}
          onAction={() => setIsAddDialogOpen(true)}
        />
      )}

      <CreateMarketplacePropertyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        defaultRole="developer"
      />
    </div>
  );
};

export default DevelopersListing;
