import React from "react";
import Image from "next/image";
import { User, Home, Handshake, ShieldCheck } from "lucide-react";
import { getSettings } from "@/lib/settings-actions";
import DynamicLogo from "@/components/shared/dynamic-logo";

import { getTranslations } from "next-intl/server";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { locale } = await params;
  const t = await getTranslations("auth_layout");
  const isRtl = locale === "ar";
  const settings = await getSettings();
  const siteInfo = settings?.siteInfo || {};

  const bottomIcons = [
    {
      icon: <User className="text-main-green" size={24} />,
      label: t("personalized_experience"),
    },
    {
      icon: <Home className="text-main-green" size={24} />,
      label: t("selected_properties"),
    },
    {
      icon: <Handshake className="text-main-green" size={24} />,
      label: t("trusted_partners"),
    },
    {
      icon: <ShieldCheck className="text-main-green" size={24} />,
      label: t("safety_reliability"),
    },
  ];

  const heroBranding = (
    <div className="flex flex-col items-center text-center gap-4 md:gap-5 max-w-[300px] mx-auto">
      <div className="relative group/logo">
        <div className="absolute -inset-4 bg-main-green/25 rounded-full blur-2xl group-hover/logo:bg-main-green/40 transition-all duration-700" />
        <div className="relative bg-white p-3 md:p-4 rounded-3xl border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-sm transition-all duration-500 group-hover/logo:scale-105">
          <DynamicLogo
            size={64}
            useLottie={false}
            src={siteInfo.siteLogo || "/images/logo.jpg"}
          />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-white font-black text-xl md:text-2xl tracking-tighter leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          {t("platform_name")}{" "}
          <span className="text-main-green">{t("real_estate")}</span>
        </h3>
        <div className="h-1 w-12 bg-main-green mx-auto rounded-full shadow-sm" />
        <div className="space-y-1">
          <p className="text-gray-100 font-bold text-base md:text-lg opacity-95 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
            {t("connect_opportunities")}
          </p>
          <p className="text-main-green font-bold text-xs md:text-sm tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
            {t("ease_confidence")}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <main
      className="min-h-screen relative bg-[#FDFBF7] overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background with swoosh (photo sits in-page beside form so heights align) */}
      <div className="absolute inset-0 z-0">
        {/* High-Precision SVG Curved Background Separation */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isRtl ? "" : "drop-shadow-[-15px_0_35px_rgba(0,0,0,0.03)]"}
          >
            {isRtl ? (
              <>
                {/* White Area (Left) */}
                <path d="M0 0H780C780 0 640 450 780 900H0V0Z" fill="#FDFBF7" />
                {/* Primary Swoosh Accent Line */}
                <path
                  d="M790 0C790 0 650 450 790 900"
                  stroke="#E5E0D8"
                  strokeWidth="2"
                  opacity="0.5"
                />
                {/* Secondary Subtle Line */}
                <path
                  d="M770 0C770 0 630 450 770 900"
                  stroke="#E5E0D8"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </>
            ) : (
              <>
                {/* White Area (Right) */}
                <path
                  d="M1440 0H660C660 0 800 450 660 900H1440V0Z"
                  fill="#FDFBF7"
                />
                {/* Primary Swoosh Accent Line */}
                <path
                  d="M650 0C650 0 790 450 650 900"
                  stroke="#E5E0D8"
                  strokeWidth="2"
                  opacity="0.5"
                />
                {/* Secondary Subtle Line */}
                <path
                  d="M670 0C670 0 810 450 670 900"
                  stroke="#E5E0D8"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Main Content — grid row 1: image | title+form share one row height */}
      <div className="container relative z-30 pt-16 pb-20">
        <div className="grid min-h-[800px] grid-cols-1 grid-rows-[auto_auto] lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:grid-rows-[auto_auto] gap-x-8 xl:gap-x-12 gap-y-10 lg:gap-y-12 lg:items-stretch">
          {/* Hero image — same row as auth content so height matches the form block */}
          <div className="relative hidden overflow-hidden rounded-[30px] md:rounded-[40px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] lg:block lg:row-start-1 lg:col-start-1 lg:h-full lg:min-h-0 lg:self-stretch">
            <Image
              src="/saudi-man.jpeg"
              alt={t("hero_image_alt")}
              fill
              sizes="(max-width: 1280px) 52vw, 640px"
              className="object-cover object-[center_22%]"
              priority
            />
            {/* Branding moved from corner triangle — sits over photo */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6 pt-20 px-5 md:pb-8 md:px-8 rounded-b-[28px] md:rounded-b-[36px]"
              style={{
                background:
                  "linear-gradient(to top, rgba(5, 68, 87, 0.94) 0%, rgba(5, 68, 87, 0.62) 42%, transparent 100%)",
              }}
            >
              {heroBranding}
            </div>
          </div>

          <div
            className={`mt-10 lg:mt-10 animate-in fade-in lg:col-start-2 lg:row-start-1 w-full ${
              isRtl ? "slide-in-from-left" : "slide-in-from-right"
            } duration-1000`}
          >
            {children}
          </div>

          {/* Bottom icons — under form column only */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 px-4 py-6 lg:col-start-2 lg:row-start-2">
            {bottomIcons.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 md:gap-3 p-1 group cursor-pointer"
              >
                <div className="bg-white p-3.5 md:p-5 rounded-full shadow-lg md:shadow-xl border border-gray-50 group-hover:shadow-main-green/20 group-hover:-translate-y-2 transition-all duration-300">
                  <div className="scale-75 md:scale-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <p className="text-main-navy font-bold text-[9px] md:text-[11px] whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity tracking-tight">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
