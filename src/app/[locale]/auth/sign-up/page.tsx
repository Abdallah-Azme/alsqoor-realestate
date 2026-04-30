import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import React from "react";
import Image from "next/image";
import SignUpForm from "@/components/auth/sign-up-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("signUp.title"),
    description: t("signUp.description"),
  };
}

const SignUpPage = async () => {
  const t = await getTranslations("sign_up");
  return (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-main-navy tracking-tight">{t("title")}</h1>
        <p className="text-gray-500 text-lg">{t("subtitle")}</p>
      </div>
      <SignUpForm />
    </>
  );
};

export default SignUpPage;
