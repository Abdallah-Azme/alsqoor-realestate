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
      <div className="bg-main-light-gray p-4 pb-4 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("notifications") }]} />
        <h1 className="text-main-navy text-2xl font-bold">الاشعارات</h1>
      </div>
      <div className="container border border-gray-300 rounded-2xl p-6">
        <div
          dir={locale === "ar" ? "ltr" : "rtl"}
          className="w-full lg:h-[70vh] overflow-auto notifction-scroll px-2 lg:px-4"
        >
          <div
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="p-4 py-6 border border-gray-200 hover:border-main-green/30 hover:shadow-lg transition-all duration-300 rounded-xl flex gap-3 bg-white"
              >
                <Image
                  src="/images/partner.png"
                  alt="notifications"
                  width={50}
                  height={50}
                  className="size-12 object-cover shrink-0"
                />
                <div className="space-y-4 flex-1">
                  <h2 className="font-bold text-main-navy">عنوان الإشعار</h2>
                  <p className="text-xs text-gray-500 leading-snug">
                    هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء
                  </p>
                  <div className="flex items-center gap-6 mt-2 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                      <BsClock size={12} className="text-gray-400" />
                      <p className="text-[11px] font-bold text-gray-500">
                        8:45_9:30
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <LuCalendarDays size={12} className="text-main-green" />
                      <p className="text-[11px] text-main-green font-bold">
                        25/9/2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;
