"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MarketplaceTabsProps {
  activeTab: string;
  basePath?: string;
}

const MarketplaceTabs = ({ activeTab, basePath }: MarketplaceTabsProps) => {
  const t = useTranslations("marketplace.tabs");
  const pathname = usePathname();
  const resolvedPath = basePath ?? pathname;

  const tabs = [
    { id: "brokers", label: t("brokers"), href: `${resolvedPath}?tab=brokers` },
    { id: "owners", label: t("owners"), href: `${resolvedPath}?tab=owners` },
    {
      id: "developers",
      label: t("developers"),
      href: `${resolvedPath}?tab=developers`,
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-2 overflow-x-auto pb-px scrollbar-hide">
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={tab.href}
              className={cn(
                "relative px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg",
                activeTab === tab.id
                  ? "text-main-green bg-main-green/10"
                  : "text-gray-500 hover:text-main-green hover:bg-gray-50",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 start-0 end-0 h-0.5 bg-main-green"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

export default MarketplaceTabs;
