import React from "react";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import Image from "next/image";
import OtpForm from "@/components/auth/otp-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("verifyOtp.title"),
    description: t("verifyOtp.description"),
  };
}

const VrefiyOtpPage = async () => {
  const t = await getTranslations("otp");
  return (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-main-navy tracking-tight">{t("title")}</h1>
        <p className="text-gray-500 text-lg">{t("description")}</p>
      </div>
      <OtpForm />
    </>
  );
};

export default VrefiyOtpPage;
