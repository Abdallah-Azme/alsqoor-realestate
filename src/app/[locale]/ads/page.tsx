"use client";

import PageHeader from "@/components/shared/page-header";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import AdsSearchListing from "@/components/marketplace/ads-search-listing";

/**
 * /ads page — Public property search results.
 * Always shows search results from /properties/search endpoint.
 * URL search params (operation_type, category_id, etc.) are passed
 * directly to the endpoint as filters.
 */
const AdsPage = () => {
  const tBreadcrumbs = useTranslations("breadcrumbs");

  return (
    <main className="space-y-8 pb-16">
      <PageHeader
        title={tBreadcrumbs("advertisements")}
        breadcrumbItems={[{ label: tBreadcrumbs("advertisements") }]}
      />

      {/* Search Results */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container"
      >
        <AdsSearchListing />
      </motion.section>
    </main>
  );
};

export default AdsPage;
