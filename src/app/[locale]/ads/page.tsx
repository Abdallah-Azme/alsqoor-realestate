"use client";

import AdsPageHeader from "@/components/marketplace/ads-page-header";
import { motion } from "motion/react";
import AdsSearchListing from "@/components/marketplace/ads-search-listing";
import AdsPageFilter from "@/components/marketplace/ads-page-filter";

/**
 * /ads page — Public property search results.
 * Always shows search results from /properties/search endpoint.
 * URL search params (operation_type, category_id, etc.) are passed
 * directly to the endpoint as filters.
 */
const AdsPage = () => {
  return (
    <main className="space-y-8 pb-16">
      <AdsPageHeader />

      {/* Search Results */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container"
      >
        <AdsPageFilter />
        <AdsSearchListing />
      </motion.section>
    </main>
  );
};

export default AdsPage;
