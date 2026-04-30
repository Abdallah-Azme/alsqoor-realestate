import React from "react";
import Image from "next/image";
import { User, Home, Handshake, ShieldCheck } from "lucide-react";
import { getSettings } from "@/lib/settings-actions";
import DynamicLogo from "@/components/shared/dynamic-logo";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const siteInfo = settings?.siteInfo || {};

  const bottomIcons = [
    { icon: <User className="text-main-green" size={24} />, label: "تجربة مخصصة" },
    { icon: <Home className="text-main-green" size={24} />, label: "عقارات مختارة" },
    { icon: <Handshake className="text-main-green" size={24} />, label: "شركاء موثوقون" },
    { icon: <ShieldCheck className="text-main-green" size={24} />, label: "أمان وموثوقية" },
  ];

  return (
    <main className="min-h-screen relative bg-[#FDFBF7] overflow-hidden">
      {/* Background with swoosh and image integration */}
      <div className="absolute inset-0 z-0">
        {/* Right Background Image Section */}
        <div className="absolute right-0 top-0 h-full w-[65%] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/saudi-man.jpeg"
              alt="Saudi Man"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* High-Precision SVG Curved Background Separation (White area on the left) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[-15px_0_35px_rgba(0,0,0,0.03)]"
          >
            {/* White Area (Left) */}
            <path
              d="M0 0H780C780 0 640 450 780 900H0V0Z"
              fill="#FDFBF7"
            />
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
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-30 pt-16 pb-20">
        <div className="flex flex-col lg:flex-row-reverse items-start min-h-[800px]">
          {/* Right Side: Form and Icons (Actually Left Side in RTL) */}
          <div className="lg:w-[48%] w-full flex flex-col gap-12 mt-10">
            <div className="animate-in fade-in slide-in-from-left duration-1000 w-full">
              {children}
            </div>

            {/* Bottom Icons Section (Under Form) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 px-4 py-6">
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

          {/* Right Side: Spacer */}
          <div className="lg:w-[52%] w-full h-full" />
        </div>
      </div>

      {/* Gold-Rimmed Decorative Element (Bottom Right) */}
      <div className="absolute bottom-0 right-0 z-40 w-[550px] h-[450px] pointer-events-none max-lg:hidden overflow-hidden">
        {/* Decorative Secondary Triangle for depth */}
        <div 
          className="absolute bottom-0 right-0 w-[110%] h-[110%] bg-main-green/5"
          style={{ clipPath: "polygon(100% 15%, 100% 100%, 15% 100%)" }}
        />
        
        <div
          className="absolute bottom-0 right-0 w-full h-full bg-main-navy shadow-2xl relative overflow-hidden"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        >
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Inner Content of Triangle */}
          <div className="absolute bottom-10 right-10 flex flex-col items-center text-center gap-5 max-w-[300px]">
            <div className="relative group/logo">
              <div className="absolute -inset-4 bg-main-green/20 rounded-full blur-2xl group-hover/logo:bg-main-green/40 transition-all duration-700" />
              <div className="relative bg-white p-3 md:p-4 rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-500 group-hover/logo:scale-110">
                <DynamicLogo size={64} useLottie={false} src={siteInfo.siteLogo || "/images/logo.jpg"} />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-white font-black text-2xl tracking-tighter leading-tight">
                منصة الصقور <span className="text-main-green">العقارية</span>
              </h3>
              <div className="h-1 w-12 bg-main-green mx-auto rounded-full" />
              <div className="space-y-1">
                <p className="text-gray-100 font-bold text-lg opacity-90 tracking-wide">تربطك بالفرص الأفضل</p>
                <p className="text-main-green/80 text-sm font-bold tracking-widest uppercase">بكل سهولة وثقة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Border Line with Glow */}
        <div
          className="absolute bottom-0 right-0 w-[150%] h-[6px] bg-gradient-to-r from-transparent via-[#B4965D] to-[#B4965D] origin-bottom-right rotate-[-39deg] shadow-[0_0_25px_rgba(180,150,93,0.5)] z-50"
          style={{ transformOrigin: "100% 100%" }}
        />
      </div>
    </main>
  );
}
