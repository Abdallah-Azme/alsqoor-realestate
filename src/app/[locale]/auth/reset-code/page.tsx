import React from "react";
import { getTranslations } from "next-intl/server";
import ResetCodeForm from "@/components/auth/reset-code-form";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("resetCode.title"),
    description: t("resetCode.description"),
  };
}

const VrefiyOtpPage = async () => {
  const t = await getTranslations("otp");
  return (
    <>
      <div className="space-y-1 mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-main-navy tracking-tight">{t("title")}</h1>
        <p className="text-gray-500 text-sm md:text-lg">{t("description")}</p>
      </div>
      <ResetCodeForm />
    </>
  );
};

export default VrefiyOtpPage;
