import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { getMessages, getTranslations } from "next-intl/server";
import { Alexandria } from "next/font/google";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import FloatingSocials from "@/components/shared/FloatingSocials";
import { Toaster } from "sonner";
import UserContextProvider from "@/context/user-context";
import { settingsService } from "@/features/settings";
import { getSettings } from "@/lib/settings-actions";
import Providers from "../providers";
import type { Metadata } from "next";
import { DirectionProvider } from "@/components/ui/direction";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-alexandria",
});

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  // Fetch settings from service
  const settings = await settingsService.getSettingsForMetadata();

  const siteInfo = settings?.siteInfo;
  const seo = settings?.seo;

  return {
    title: {
      default: siteInfo?.siteName || t("title"),
      template: `%s | ${siteInfo?.siteName || t("title")}`,
    },
    description:
      seo?.metaDescription || siteInfo?.siteDescription || t("description"),
    keywords: seo?.metaKeywords?.split(",").map((k: string) => k.trim()) || [],
    icons: {
      icon: siteInfo?.siteFavicon || "/favicon.ico",
      apple: siteInfo?.siteFavicon || "/favicon.ico",
    },
    openGraph: {
      title: siteInfo?.siteName || t("title"),
      description:
        seo?.metaDescription || siteInfo?.siteDescription || t("description"),
      images: siteInfo?.siteLogo ? [siteInfo.siteLogo] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteInfo?.siteName || t("title"),
      description:
        seo?.metaDescription || siteInfo?.siteDescription || t("description"),
      images: siteInfo?.siteLogo ? [siteInfo.siteLogo] : [],
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = (await params) || "ar";
  const messages = await getMessages();

  // Fetch navbar color
  const navbarColor = await settingsService.getTopnavColor();

  // Fetch settings
  const settings = await getSettings();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${alexandria.className} antialiased text-main-navy relative`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
            <Providers>
              <UserContextProvider>
                <Toaster
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  richColors
                  position="top-right"
                />
                <div className="fixed top-0 left-0 right-0 z-50">
                  <Navbar topnavColor={navbarColor} settings={settings} />
                </div>
                <div className="mt-40 min-h-screen">{children}</div>
                <FloatingSocials settings={settings} />
                <Footer settings={settings} />
              </UserContextProvider>
            </Providers>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
