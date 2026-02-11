import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import PlanCard from "@/components/shared/plan-card";
import React from "react";
import { getTranslations } from "next-intl/server";
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/motion/animated-section";
import { packagesService } from "@/features/packages";

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

  // Map API data to plan card format
  const plansData = packages.map((pkg, index) => ({
    title: pkg.name,
    price: pkg.price.replace(".00", ""), // Remove .00 from price
    popular: index === 1, // Mark second package as popular (middle one)
    features: pkg.features,
  }));

  return (
    <main className="space-y-8">
      <AnimatedSection>
        <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
          <CustomBreadcrumbs items={[{ label: t("title") }]} />
          <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
        </div>
      </AnimatedSection>
      <div className="container">
        <AnimatedSection delay={0.2}>
          <div className="grid md:grid-cols-3 gap-6">
            {plansData.map((plan, index) => (
              <AnimatedItem key={index} index={index}>
                <PlanCard {...plan} />
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
};

export default PackagesPage;
