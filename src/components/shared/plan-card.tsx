"use client";

import { CheckCircle2 } from "lucide-react";
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

export default function PlanCard({ title, price, features, popular }) {
  const t = useTranslations("packages_page");
  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between rounded-none rounded-tr-xl rounded-bl-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        popular ? "border-main-green bg-main-green/5" : "border-gray-200"
      )}
    >
      {/* شارة الباقة المميزة */}
      {popular && (
        <span className="absolute -top-3 right-3 bg-main-green text-white text-xs font-semibold py-1 px-3 rounded-full">
          {t("popular_badge") || "الأكثر شهرة"}
        </span>
      )}

      {/* العنوان والسعر */}
      <CardHeader className="text-center space-y-3 pt-6">
        <CardTitle className="text-lg font-bold text-main-navy">
          {title}
        </CardTitle>
        <p className="text-3xl font-bold text-main-green">
          {price} {t("currency")}
          <span className="text-sm text-gray-500 font-normal">
            {" "}
            / {t("monthly") || "شهريًا"}
          </span>
        </p>
      </CardHeader>

      {/* المميزات */}
      <CardContent className="space-y-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <CheckCircle2 className="text-main-green w-4 h-4" />
            <span>{feature}</span>
          </div>
        ))}
      </CardContent>

      {/* زر الاشتراك */}
      <CardFooter className="p-6 pt-0">
        <Button
          className={cn(
            "w-full rounded-lg font-medium transition-all duration-300",
            popular
              ? "bg-main-green text-white hover:bg-main-green/80"
              : "bg-main-navy text-white hover:bg-main-navy/80"
          )}
        >
          {t("subscribe_now") || "اشترك الآن"}
        </Button>
      </CardFooter>
    </Card>
  );
}
