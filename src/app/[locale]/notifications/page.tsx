import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { getDefaultHeaders } from "@/shared/utils/headers";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

type NotificationItem = {
  id: number;
  type: string;
  notificationTitle: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  timeAgo: string;
  user?: {
    id: number;
    name: string;
    role: string;
  };
};

type NotificationsApiResponse = {
  success: boolean;
  message: string;
  data?: {
    data: NotificationItem[];
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links?: {
        next: string | null;
        previous: string | null;
      };
    };
  };
  meta?: {
    unread_count?: number;
  };
};

async function markNotificationAsRead(
  notificationId: number,
  locale: string,
  query: string,
) {
  "use server";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (!apiUrl) return;

  const headers = await getDefaultHeaders(false, locale);
  await fetch(`${apiUrl}/notifications/${notificationId}/mark-as-read`, {
    method: "POST",
    headers: {
      ...headers,
      Accept: "application/json",
    },
    cache: "no-store",
  }).catch(() => null);

  revalidatePath(`/${locale}/notifications`);
  redirect(`/${locale}/notifications${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

async function markAllNotificationsAsRead(locale: string, query: string) {
  "use server";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (!apiUrl) return;

  const headers = await getDefaultHeaders(false, locale);
  await fetch(`${apiUrl}/notifications/mark-all-read`, {
    method: "POST",
    headers: {
      ...headers,
      Accept: "application/json",
    },
    cache: "no-store",
  }).catch(() => null);

  revalidatePath(`/${locale}/notifications`);
  redirect(`/${locale}/notifications${query ? `?q=${encodeURIComponent(query)}` : ""}`);
}

const NotificationsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) => {
  const locale = await getLocale();
  const t = await getTranslations("breadcrumbs");
  const query = (await searchParams)?.q?.trim() || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  let notifications: NotificationItem[] = [];
  let unreadCount = 0;

  if (apiUrl) {
    try {
      const headers = await getDefaultHeaders(false, locale);
      const endpoint = query
        ? `${apiUrl}/notifications/search?q=${encodeURIComponent(query)}`
        : `${apiUrl}/notifications`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          ...headers,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const json = (await response.json()) as NotificationsApiResponse;
        notifications = json?.data?.data ?? [];
        unreadCount = json?.meta?.unread_count ?? 0;
      }
    } catch {
      // Keep a graceful fallback UI if API is temporarily unavailable.
    }
  }

  return (
    <main className="space-y-8">
      <div className="bg-main-light-gray p-4 pb-4 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("notifications") }]} />
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-main-navy text-2xl font-bold">الاشعارات</h1>
          <div className="flex items-center gap-3">
            <form action={markAllNotificationsAsRead.bind(null, locale, query)}>
              <button
                type="submit"
                className="text-xs md:text-sm px-3 py-2 rounded-lg bg-main-green text-white hover:opacity-90 transition-opacity"
              >
                تعليم الكل كمقروء
              </button>
            </form>
            <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-red-500 text-white text-sm font-bold">
              {unreadCount}
            </span>
          </div>
        </div>
        <form
          method="GET"
          action={`/${locale}/notifications`}
          className="flex items-center gap-2"
        >
          <input
            name="q"
            defaultValue={query}
            placeholder="ابحث في الإشعارات..."
            className="w-full md:max-w-md h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main-green/30"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-lg bg-main-navy text-white text-sm"
          >
            بحث
          </button>
        </form>
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
            {notifications.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-500 font-medium">
                لا توجد إشعارات حالياً
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 py-6 border hover:border-main-green/30 hover:shadow-lg transition-all duration-300 rounded-xl flex gap-3 bg-white ${
                    notification.isRead ? "border-gray-200" : "border-main-green/40"
                  }`}
                >
                  <Image
                    src="/images/partner.png"
                    alt="notifications"
                    width={50}
                    height={50}
                    className="size-12 object-cover shrink-0"
                  />
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-bold text-main-navy">
                        {notification.notificationTitle}
                      </h2>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.isRead && (
                          <>
                            <span className="w-2.5 h-2.5 mt-1 rounded-full bg-main-green shrink-0" />
                            <form
                              action={markNotificationAsRead.bind(
                                null,
                                notification.id,
                                locale,
                                query,
                              )}
                            >
                              <button
                                type="submit"
                                className="text-[11px] px-2 py-1 rounded-md border border-main-green text-main-green hover:bg-main-green hover:text-white transition-colors"
                              >
                                تعليم كمقروء
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-6 mt-2 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1">
                        <BsClock size={12} className="text-gray-400" />
                        <p className="text-[11px] font-bold text-gray-500">
                          {notification.timeAgo}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <LuCalendarDays size={12} className="text-main-green" />
                        <p className="text-[11px] text-main-green font-bold">
                          {notification.createdAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;
