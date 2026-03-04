"use client";

import { Check, Rocket, Crown, TrendingUp, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const getTierStyles = (title: string) => {
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes("نخبة") ||
    normalizedTitle.includes("elite") ||
    normalizedTitle.includes("احتراف") ||
    normalizedTitle.includes("pro")
  ) {
    return {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      accentColor: "bg-purple-50/50",
      borderColor: "border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      iconContainer: "bg-purple-100",
    };
  }

  if (
    normalizedTitle.includes("ذهبي") ||
    normalizedTitle.includes("gold") ||
    normalizedTitle.includes("3")
  ) {
    return {
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      accentColor: "bg-amber-50/50",
      borderColor: "border-amber-200",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      iconContainer: "bg-amber-100",
    };
  }

  if (
    normalizedTitle.includes("مميز") ||
    normalizedTitle.includes("premium") ||
    normalizedTitle.includes("2")
  ) {
    return {
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      accentColor: "bg-blue-50/50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      iconContainer: "bg-blue-100",
    };
  }

  return {
    icon: <Rocket className="w-8 h-8 text-main-green" />,
    accentColor: "bg-green-50/30",
    borderColor: "border-main-green/30",
    buttonColor: "bg-main-navy hover:bg-main-navy/90",
    iconContainer: "bg-main-green/10",
  };
};

export default function PlanCard({
  id,
  title,
  price,
  features = [],
  popular,
  onSelect,
}) {
  const t = useTranslations("packages_page");
  const styles = getTierStyles(title);

  return (
    <Card
      className={cn(
        "relative flex flex-col pt-8 pb-6 px-2 border-2 transition-all duration-300 overflow-hidden",
        popular
          ? "border-main-green bg-green-50/30 shadow-lg -translate-y-1 scale-[1.02] z-10"
          : "border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1",
      )}
    >
      {/* شارة الباقة المميزة */}
      {popular && (
        <div className="absolute top-0 right-0 left-0 bg-main-green text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider">
          {t("popular_badge") || "الأكثر شهرة"}
        </div>
      )}

      {/* العنوان والسعر */}
      <CardHeader className="text-center pt-2 space-y-4">
        <div
          className={cn(
            "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 hover:rotate-6",
            styles.iconContainer,
          )}
        >
          {styles.icon}
        </div>

        <div className="space-y-1">
          <CardTitle className="text-xl font-black text-main-navy tracking-tight">
            {title}
          </CardTitle>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm font-medium text-gray-400">
              {t("currency")}
            </span>
            <span className="text-4xl font-extrabold text-main-navy">
              {price}
            </span>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            {t("monthly") || "شهريًا"}
          </p>
        </div>
      </CardHeader>

      {/* المميزات */}
      <CardContent className="grow px-6">
        <div className="h-px bg-gray-100 w-full my-4" />
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3 group transition-all duration-300"
            >
              <div className="mt-1 rounded-full bg-main-green/10 p-1 group-hover:bg-main-green/20 transition-colors">
                <Check className="w-3 h-3 text-main-green" />
              </div>
              <span className="text-sm text-main-navy font-semibold leading-relaxed group-hover:text-black transition-colors">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* زر الاشتراك */}
      <CardFooter className="px-6 pt-6">
        <Button
          onClick={() => onSelect?.(id)}
          className={cn(
            "w-full h-12 rounded-xl font-black transition-all duration-300 shadow-lg active:scale-95",
            popular
              ? "bg-main-green text-white hover:bg-main-green/90 shadow-main-green/20"
              : "bg-main-navy text-white hover:bg-main-navy/90 shadow-main-navy/20",
          )}
        >
          {t("subscribe_now") || "اشترك الآن"}
        </Button>
      </CardFooter>
    </Card>
  );
}
