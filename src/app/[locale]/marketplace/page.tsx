"use client";

import { useTranslations } from "next-intl";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { motion } from "motion/react";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import { useMarketplaceProperties } from "@/features/marketplace/hooks/use-marketplace-properties";
import { MarketplacePropertyCard } from "@/features/marketplace/components/marketplace-property-card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketplacePage = () => {
  const t = useTranslations("breadcrumbs");
  const tPage = useTranslations("home.estates_page");
  const tMarket = useTranslations("marketplace");
  const tCommon = useTranslations("common");

  // Fetch properties from /properties-new
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useMarketplaceProperties({
    per_page: 30,
  });

  const properties = response?.data || [];

  return (
    <main className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container space-y-4 rounded-b-xl bg-main-light-gray p-4 pb-12"
      >
        <div className="flex items-center justify-between">
          <div>
            <CustomBreadcrumbs items={[{ label: t("marketplace") }]} />
            <h1 className="text-2xl font-bold text-main-navy">
              {tMarket("title")}
            </h1>
          </div>
          <CreateMarketplacePropertyDialog />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-main-green" />
            <p className="text-gray-500 font-medium">{tPage("loading")}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="text-xl font-bold text-destructive">
              {tPage("error_fetch")}
            </h3>
            <p className="text-gray-600 max-w-md text-center">
              {tPage("error_server")}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2 text-main-navy"
            >
              {tCommon("error.retry")}
            </Button>
          </div>
        ) : properties.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                {tMarket("results_count")}:{" "}
                <span className="font-bold text-main-navy">
                  {properties.length}
                </span>{" "}
                {tMarket("opportunity")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                <MarketplacePropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="bg-gray-100 p-6 rounded-full">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-main-navy">
              {tMarket("no_properties")}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {tMarket("no_properties_description") ||
                "No ads are currently available in the marketplace."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MarketplacePage;
