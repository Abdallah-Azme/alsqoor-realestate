import ComplaintsForm from "@/components/shared/complaints-form";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("complaints.title"),
    description: t("complaints.description"),
  };
}

const ComplaintsPage = async () => {
  const t = await getTranslations("Complaints");
  return (
    <main className="space-y-12">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("title") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="container border  p-6 flex items-center gap-12 lg:gap-16">
        <div className="hidden lg:block lg:w-1/2 h-[80vh]">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover rounded-e-2xl"
          >
            <source src="/images/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="lg:w-[40%] w-full">
          <ComplaintsForm />
        </div>
      </div>
    </main>
  );
};

export default ComplaintsPage;
