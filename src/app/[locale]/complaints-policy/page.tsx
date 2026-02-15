import StaticPageContent from "@/components/shared/static-page-content";
import { settingsService } from "@/features/settings/services/settings.service";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Footer" });
  return {
    title: t("complaints_policy"),
  };
}

const ComplaintsPolicyPage = async () => {
  const t = await getTranslations("Footer");
  const settings = await settingsService.getSettings();
  const content = settings?.content?.complaintsPolicy || "";

  return (
    <StaticPageContent
      title={t("complaints_policy")}
      content={content}
      breadcrumb={t("complaints_policy")}
      // image="/images/placeholder.jpg"
    />
  );
};

export default ComplaintsPolicyPage;
