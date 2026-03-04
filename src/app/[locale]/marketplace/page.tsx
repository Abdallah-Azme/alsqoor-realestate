"use client";

import { useTranslations } from "next-intl";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { motion } from "motion/react";
import { CreateMarketplacePropertyDialog } from "@/features/marketplace/components/create-marketplace-property-dialog";
import { useMarketplaceProperties } from "@/features/marketplace/hooks/use-marketplace-properties";
import { MarketplacePropertyCard } from "@/features/marketplace/components/marketplace-property-card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdLimit } from "@/hooks/use-ad-limit";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiPlus } from "react-icons/fi";

const MarketplacePage = () => {
  const t = useTranslations("breadcrumbs");
  const tPage = useTranslations("home.estates_page");
  const tMarket = useTranslations("marketplace");
  const tCommon = useTranslations("common");
  const { checkCanAddFeatured } = useAdLimit();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeTab = searchParams.get("type") || "agent";

  // Fetch properties from /properties-new
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useMarketplaceProperties({
    per_page: 30,
    type: activeTab,
  });

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const properties = response?.data || [];

  return (
    <main className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container space-y-4 rounded-b-xl bg-main-light-gray p-4 pb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <CustomBreadcrumbs items={[{ label: t("marketplace") }]} />
            <h1 className="text-2xl font-bold text-main-navy">
              {tMarket("title")}
            </h1>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="hidden md:block"
          >
            <TabsList className="bg-white border text-main-navy">
              <TabsTrigger
                value="developer"
                className="data-[state=active]:bg-main-green data-[state=active]:text-white"
              >
                {tMarket("tabs.developer")}
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="data-[state=active]:bg-main-green data-[state=active]:text-white"
              >
                {tMarket("tabs.owner")}
              </TabsTrigger>
              <TabsTrigger
                value="agent"
                className="data-[state=active]:bg-main-green data-[state=active]:text-white"
              >
                {tMarket("tabs.agent")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            <CreateMarketplacePropertyDialog
              buttonText={tMarket("add_property")}
              onBeforeOpen={checkCanAddFeatured}
              defaultRole={activeTab}
            />
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="block md:hidden pt-2">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="bg-white border text-main-navy w-full grid grid-cols-3">
              <TabsTrigger
                value="developer"
                className="data-[state=active]:bg-main-green data-[state=active]:text-white text-xs"
              >
                {tMarket("tabs.developer")}
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="data-[state=active]:bg-main-green data-[state=active]:text-white text-xs"
              >
                {tMarket("tabs.owner")}
              </TabsTrigger>
              <TabsTrigger
                value="agent"
                className="data-[state=active]:bg-main-green data-[state=active]:text-white text-xs"
              >
                {tMarket("tabs.agent")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6 mt-6">
            <div className="bg-main-green/10 p-6 rounded-full">
              <FiPlus className="h-10 w-10 text-main-green" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-main-navy">
                {tMarket("no_properties")}
              </h3>
              <p className="text-gray-500 text-center max-w-sm px-4">
                {tMarket("no_properties_description")}
              </p>
            </div>
            <CreateMarketplacePropertyDialog
              triggerClassName="bg-main-green hover:bg-main-green/90 text-white gap-2 px-8"
              buttonText={tMarket("add_property")}
              onBeforeOpen={checkCanAddFeatured}
              defaultRole={activeTab}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default MarketplacePage;
