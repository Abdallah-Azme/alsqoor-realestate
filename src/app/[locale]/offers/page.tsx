"use client";

import PageHeader from "@/components/shared/page-header";
import { SiteOffersList, CreateSiteOfferDialog } from "@/features/offers/property-offers-index";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ServiceDescription } from "@/features/service-descriptions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { getToken } from "@/services";
import { useRouter } from "@/i18n/navigation";

const OffersPage = () => {
  const t = useTranslations("offers_page");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const router = useRouter();

  const handleOpenAddDialog = async () => {
    const token = await getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsAddDialogOpen(true);
  };

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
          <div className="flex items-center gap-4">
            <ServiceDescription type="offers" />
            <Button
              onClick={handleOpenAddDialog}
              className="bg-main-green hover:bg-main-green/90 text-white gap-2 font-bold px-6 shadow-lg shadow-main-green/20 border-none"
            >
              <FiPlus className="stroke-[3px]" />
              {t("add_offer") || "إضافة عرض"}
            </Button>
          </div>
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

      <CreateSiteOfferDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </main>
  );
};

export default OffersPage;
