import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";
import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("notifications.title"),
    description: t("notifications.description"),
  };
}

const NotificationsPage = async () => {
  const locale = await getLocale();
  const t = await getTranslations("breadcrumbs");
  return (
    <main className="space-y-8">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("notifications") }]} />
        <h1 className="text-main-navy text-2xl font-bold">الاشعارات</h1>
      </div>
      <div className="container border border-gray-300 p-6 lg:flex gap-4">
        <div
          dir={locale === "ar" ? "ltr" : "rtl"}
          className="lg:w-1/2 lg:h-[70vh] overflow-auto notifction-scroll ps-4 space-y-4"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              key={index}
              className="p-4 py-7 border border-gray-300  rounded-xl flex  gap-2"
            >
              <Image
                src="/images/partner.png"
                alt="notifications"
                width={50}
                height={50}
                className="size-12 object-cover shrink-0"
              />
              <div className="space-y-4">
                <h2 className=" font-bold">عنوان الإشعار</h2>
                <p className="text-xs ">
                  هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء
                </p>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-1">
                    <BsClock size={12} className="text-main-green" />
                    <p className="text-xs font-bold">8:45_9:30</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <LuCalendarDays size={12} className="text-main-green" />
                    <p className="text-xs text-main-green font-bold">
                      25/9/2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block lg:w-1/2 lg:h-[70vh] relative">
          <Image
            src="/images/notifactions.svg"
            alt="notifications"
            fill
            className="object-center object-contain"
          />
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;
