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
    title: t("contact_info"),
  };
}

const ContactInfoPage = async () => {
  const t = await getTranslations("Footer");
  const settings = await settingsService.getSettings();
  const content = settings?.content?.contactInfoContent || "";

  return (
    <StaticPageContent
      title={t("contact_info")}
      content={content}
      breadcrumb={t("contact_info")}
      // image="/images/placeholder.jpg"
    />
  );
};

export default ContactInfoPage;
