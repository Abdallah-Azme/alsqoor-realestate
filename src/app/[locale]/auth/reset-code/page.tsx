import React from "react";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import Image from "next/image";
import OtpForm from "@/components/auth/otp-form";
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
    <main className="space-y-12">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("title") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="container flex items-start">
        <div className="w-[45%] max-lg:hidden">
          <Image
            src="/images/auth.png"
            alt="login"
            width={800}
            height={500}
            className="w-full -translate-x-10 fit-content"
          />
        </div>
        <div className="lg:w-[60%] w-full">
          <ResetCodeForm />
        </div>
      </div>
    </main>
  );
};

export default VrefiyOtpPage;
