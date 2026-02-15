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
    title: t("privacy_policy"),
  };
}

const PrivacyPolicyPage = async () => {
  const t = await getTranslations("Footer");
  const settings = await settingsService.getSettings();
  const content = settings?.content?.privacyPolicy || "";

  return (
    <StaticPageContent
      title={t("privacy_policy")}
      content={content}
      breadcrumb={t("privacy_policy")}
      // image="/images/placeholder.jpg"
    />
  );
};

export default PrivacyPolicyPage;
