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
          <ForgetForm />
        </div>
      </div>
    </main>
  );
};

export default ForgetPasswordPage;
