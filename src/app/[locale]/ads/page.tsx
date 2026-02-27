"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/user-context";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { FiPlus } from "react-icons/fi";
import BrokersListing from "@/components/marketplace/brokers-listing";
import OwnersListing from "@/components/marketplace/owners-listing";
import DevelopersListing from "@/components/marketplace/developers-listing";
import MarketplaceTabs from "@/components/marketplace/marketplace-tabs";

const AdsPage = () => {
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const tPage = useTranslations("home.estates_page");
  const t = useTranslations("marketplace");
  const { user } = useContext(UserContext);
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "brokers";

  const handleAddAd = () => {
    if (!user) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    router.push("/advertisements/add");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "brokers":
        return <BrokersListing />;
      case "owners":
        return <OwnersListing />;
      case "developers":
        return <DevelopersListing />;
      default:
        return <BrokersListing />;
    }
  };

  return (
    <main className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-main-light-gray p-4 pb-8 space-y-4 rounded-b-xl container"
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <CustomBreadcrumbs
              items={[{ label: tBreadcrumbs("advertisements") }]}
            />
            <h1 className="text-main-navy text-2xl font-bold">
              {tBreadcrumbs("advertisements")}
            </h1>
          </div>

          <Button
            onClick={handleAddAd}
            className="bg-main-green hover:bg-main-green/90 text-white gap-2"
          >
            <FiPlus className="text-lg" />
            <span>{tPage("add_ad")}</span>
          </Button>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container"
      >
        <MarketplaceTabs activeTab={activeTab} />
      </motion.div>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container"
      >
        {renderContent()}
      </motion.section>
    </main>
  );
};

export default AdsPage;
