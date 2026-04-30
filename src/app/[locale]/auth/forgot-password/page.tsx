import ForgetForm from "@/components/auth/forget-form";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("forgotPassword.title"),
    description: t("forgotPassword.description"),
  };
}

const ForgetPasswordPage = async () => {
  const t = await getTranslations("forget-password");
  return (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-main-navy tracking-tight">{t("title")}</h1>
        <p className="text-gray-500 text-lg">{t("description")}</p>
      </div>
      <ForgetForm />
    </>
  );
};

export default ForgetPasswordPage;
