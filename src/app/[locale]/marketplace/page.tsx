"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import MarketplaceTabs from "@/components/marketplace/marketplace-tabs";
import BrokersListing from "@/components/marketplace/brokers-listing";
import OwnersListing from "@/components/marketplace/owners-listing";
import DevelopersListing from "@/components/marketplace/developers-listing";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

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
        <div className="flex justify-between items-center">
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
            <FiPlus />
            {t("add_property") || "Add Property"}
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
