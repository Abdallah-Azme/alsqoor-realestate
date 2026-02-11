import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePackages } from "@/features/packages/hooks/use-packages";
import { Package } from "@/features/packages/types/packages.types";

interface PackageProps {
  title: string;
  price: string;
  duration: string;
  features: string[];
  isCurrent?: boolean;
}

const PackageCard = ({
  title,
  price,
  duration,
  features,
  isCurrent,
}: PackageProps) => {
  const t = useTranslations("Profile");

  return (
    <Card
      className={`border transition-all duration-300 h-full flex flex-col justify-between ${
        isCurrent
          ? "border-green-100 bg-green-50/30 shadow-sm"
          : "border-gray-100 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <CardHeader className="text-center pb-2">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="mt-2 flex items-center justify-center gap-1">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          <span className="text-sm font-medium text-gray-900">
            {t("currency")}
          </span>
        </div>
        <p className="text-sm text-gray-500 font-medium">{duration}</p>
      </CardHeader>

      <CardContent className="flex-grow">
        <ul className="space-y-3 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-main-green shrink-0" />
              <span className="text-gray-600 font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          className={`w-full font-bold h-10 ${
            isCurrent
              ? "bg-main-green hover:bg-green-700 text-white"
              : "bg-main-navy hover:bg-navy-700 text-white"
          }`}
        >
          {isCurrent ? t("renew_package") : t("change_plan")}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PackagesTab = () => {
  const t = useTranslations("Profile");
  const { data: packages, isLoading, error } = usePackages();

  const getFeaturesList = (pkg: Package) => {
    const features = [];
    if (pkg.hasUnlimitedAds) features.push(t("unlimited_ads"));
    else features.push(`${pkg.adCount} ${t("ads_suffix")}`);

    if (pkg.accessToPropertyRequests) features.push(t("access_to_requests"));
    if (pkg.accessToPartners) features.push(t("access_to_partners"));
    if (pkg.participateInPropertyMarketing)
      features.push(t("marketing_participation"));
    if (pkg.specialSearchSupport) features.push(t("search_support"));
    if (pkg.hasPersonalAccountManager) features.push(t("account_manager"));
    if (pkg.allowFeaturedAd) features.push(t("featured_ads"));
    if (pkg.allowUrgentRequest) features.push(t("urgent_requests"));

    return features;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-main-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">{t("error_loading")}</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Packages Grid */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold text-main-navy">
            {t("other_packages")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages?.map((pkg) => (
            <PackageCard
              key={pkg.id}
              title={pkg.name}
              price={pkg.price}
              duration={t("for_duration", {
                duration: pkg.durationDays,
                unit: t("days"),
              })}
              features={getFeaturesList(pkg)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagesTab;
