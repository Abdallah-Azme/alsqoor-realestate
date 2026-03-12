"use client";

import PageHeader from "@/components/shared/page-header";
import { SiteOffersList } from "@/features/offers/property-offers-index";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ServiceDescription } from "@/features/service-descriptions";

const OffersPage = () => {
  const t = useTranslations("offers_page");
  const tBreadcrumbs = useTranslations("breadcrumbs");

  return (
    <main className="space-y-12 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageHeader
          title={t("title")}
          breadcrumbItems={[{ label: tBreadcrumbs("offers") }]}
        >
          <ServiceDescription type="offers" />
        </PageHeader>
      </motion.div>

      {/* Content section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container"
      >
        <SiteOffersList />
      </motion.section>
    </main>
  );
};

export default OffersPage;
