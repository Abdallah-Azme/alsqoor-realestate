import React from "react";
import NewPasswordForm from "@/components/auth/new-password-form";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("newPassword.title"),
    description: t("newPassword.description"),
  };
}

const NewPasswordPage = async () => {
  const t = await getTranslations("new-password");
  return (
    <>
      <div className="space-y-1 mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-main-navy tracking-tight">{t("title")}</h1>
        <p className="text-gray-500 text-sm md:text-lg">{t("description")}</p>
      </div>
      <NewPasswordForm />
    </>
  );
};

export default NewPasswordPage;
