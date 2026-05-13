"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ServiceDescription } from "@/features/service-descriptions";

/**
 * Ads listing hero — icon + title stack on one side, breadcrumbs + service info on the other (RTL-aware).
 */
export default function AdsPageHeader() {
  const tBread = useTranslations("breadcrumbs");
  const t = useTranslations("marketplace");

  return (
    <header className=" px-4 py-6 md:py-8 rounded-b-xl">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4 items-start">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#C5A059] text-white shadow-sm"
              aria-hidden
            >
              <Building2 className="size-6" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-main-navy">
                {t("ads_page.hero_title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground md:text-base max-w-xl leading-relaxed">
                {t("ads_page.hero_subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <CustomBreadcrumbs items={[{ label: tBread("advertisements") }]} />
            <ServiceDescription type="ads" compact />
          </div>
        </div>
      </div>
    </header>
  );
}
