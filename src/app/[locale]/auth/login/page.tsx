import React from "react";
import Image from "next/image";
import LoginForm from "@/components/auth/login-form";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("login.title"),
    description: t("login.description"),
  };
}

const LoginPage = async () => {
  const t = await getTranslations("login");
  return (
    <main className="space-y-12">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("title") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="container flex items-start gap-5">
        <div className="w-[45%] max-lg:hidden">
          <Image
            src="/images/auth.png"
            alt="login"
            width={800}
            height={500}
            className="w-full fit-content"
          />
        </div>
        <div className="lg:w-[50%] w-full">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
