"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { SiteOffersList } from "@/features/offers/property-offers-index";
import { useTranslations } from "next-intl";

const OffersPage = () => {
  const t = useTranslations("offers");

  return (
    <main className="space-y-6">
      <div className="container space-y-4 rounded-b-xl bg-main-light-gray p-4 pb-12">
        <CustomBreadcrumbs items={[{ label: t("title") }]} />
        <h1 className="text-2xl font-bold text-main-navy">{t("title")}</h1>
      </div>
      <div className="container">
        <SiteOffersList />
      </div>
    </main>
  );
};

export default OffersPage;
