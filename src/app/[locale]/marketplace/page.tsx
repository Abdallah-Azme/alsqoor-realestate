"use client";

import BrokersListing from "@/components/marketplace/brokers-listing";
import DevelopersListing from "@/components/marketplace/developers-listing";
import MarketplaceTabs from "@/components/marketplace/marketplace-tabs";
import OwnersListing from "@/components/marketplace/owners-listing";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/user-context";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { FiPlus } from "react-icons/fi";

const MarketplacePage = () => {
  const t = useTranslations("marketplace");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const searchParams = useSearchParams();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const locale = useLocale();

  const handleAddProperty = () => {
    if (!user) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    if (
      user.role === "agent" ||
      user.role === "broker" ||
      user.role === "office" ||
      user.role === "company"
    ) {
      router.push("/advertisements/add");
    } else {
      router.push("/profile?tab=my-properties&action=add-property");
    }
  };

  // Get active tab from URL, default to "brokers"
  const activeTab = searchParams.get("tab") || "brokers";

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
              items={[{ label: tBreadcrumbs("marketplace") }]}
            />
            <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
          </div>

          <Button
            onClick={handleAddProperty}
            className="bg-main-green hover:bg-main-green/90 text-white gap-2"
          >
            <FiPlus className="text-lg" />
            <span className="hidden sm:inline">{t("add_property")}</span>
            <span className="sm:hidden">{t("add")}</span>
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

export default MarketplacePage;
