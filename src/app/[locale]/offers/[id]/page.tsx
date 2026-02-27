"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { useTranslations } from "next-intl";
import { useSiteOffer } from "@/features/offers/hooks/use-site-offers";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

const OfferPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("packages_page");
  const { data, isLoading, error } = useSiteOffer(params.id);

  // Handle the response wrapping
  const responseData: any = data;
  const offer = responseData?.data;

  if (isLoading) {
    return (
      <main className="space-y-6 flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-main-green" />
      </main>
    );
  }

  if (error || !offer) {
    return (
      <main className="space-y-6 flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-red-50 p-4 mb-4">
          <Loader2 className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-main-navy mb-2">
          {t("error") || "Error"}
        </h3>
        <p className="max-w-md text-gray-500 mb-6">
          {"We encountered an error while trying to fetch the offer details."}
        </p>
        <Link href="/offers">
          <Button variant="outline">{"Back to Offers"}</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-6 mb-16">
      <div className="container space-y-4 rounded-b-xl bg-main-light-gray p-4 pb-12">
        <CustomBreadcrumbs
          items={[
            { label: t("title") || "Offers", href: "/offers" },
            { label: offer.name },
          ]}
        />
        <h1 className="text-2xl font-bold text-main-navy">{offer.name}</h1>
      </div>

      <div className="container max-w-3xl">
        <Card
          className={`relative overflow-hidden border-2 transition-all duration-300 shadow-lg ${
            offer.isActive ? "border-main-green/20" : "border-gray-100"
          }`}
        >
          {offer.isActive && (
            <div className="absolute -end-12 top-6 rotate-45 bg-main-green px-12 py-1 text-xs font-bold text-white shadow-sm">
              {t("popular_badge") || "Active Plan"}
            </div>
          )}

          <CardHeader className="space-y-2 pb-6 pt-10 text-center bg-gray-50">
            <h2 className="text-3xl font-bold text-main-navy">{offer.name}</h2>
            <p className="text-md text-gray-500 max-w-md mx-auto">
              {offer.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-10">
            <div className="text-center">
              <span className="text-5xl font-bold text-main-green">
                {offer.price}
              </span>
              <span className="text-lg text-gray-400 ms-2 space-x-1">
                <span>{t("currency") || "SAR"} /</span>
                <span>
                  {offer.validityDays} {t("days") || "Days"}
                </span>
              </span>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="font-bold text-main-navy mb-6 text-lg">
                {"Included Features:"}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offer.features?.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-4 p-3 rounded-lg bg-gray-50/50"
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-main-green" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter className="pt-10 pb-10 bg-gray-50/50 mt-6 flex justify-center border-t border-gray-100">
            <Button
              className={`w-full max-w-sm h-14 text-lg ${
                offer.isActive
                  ? "bg-main-green hover:bg-main-green/90 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("subscribe_now") || "Subscribe Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default OfferPage;
