import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import PlanCard from "@/components/shared/plan-card";
import React from "react";
import { getTranslations } from "next-intl/server";
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/motion/animated-section";
import { packagesService } from "@/features/packages";

import PackagesListClient from "./components/packages-list-client";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("packages.title"),
    description: t("packages.description"),
  };
}

const PackagesPage = async () => {
  const t = await getTranslations("packages_page");

  // Fetch packages from API
  const packages = await packagesService.getAll();

  const tProfile = await getTranslations("Profile");

  // Map API data to plan card format
  const plansData = packages.map((pkg, index) => {
    // Generate features list dynamically
    const features: string[] = [];

    if (pkg.hasUnlimitedAds) {
      features.push(tProfile("unlimited_ads"));
    } else {
      features.push(`${pkg.adCount} ${tProfile("ads_suffix")}`);
    }

    if (pkg.accessToPropertyRequests)
      features.push(tProfile("access_to_requests"));
    if (pkg.accessToPartners) features.push(tProfile("access_to_partners"));
    if (pkg.participateInPropertyMarketing)
      features.push(tProfile("marketing_participation"));
    if (pkg.specialSearchSupport) features.push(tProfile("search_support"));
    if (pkg.hasPersonalAccountManager)
      features.push(tProfile("account_manager"));
    if (pkg.allowFeaturedAd) features.push(tProfile("featured_ads"));
    if (pkg.allowUrgentRequest) features.push(tProfile("urgent_requests"));

    // Check if package is premium/middle one for "popular" tag
    const normalizedTitle = pkg.name.toLowerCase();
    const isPremiumTier =
      normalizedTitle.includes("مميز") ||
      normalizedTitle.includes("premium") ||
      index === 1;

    return {
      id: pkg.id,
      title: pkg.name,
      price: pkg.price?.replace(".00", "") || "0",
      popular: isPremiumTier,
      features,
    };
  });

  return (
    <main className="min-h-screen bg-gray-50/30">
      <div className="container my-10">
        <AnimatedSection delay={0.2}>
          <PackagesListClient plansData={plansData} />
        </AnimatedSection>
      </div>
    </main>
  );
};

export default PackagesPage;
