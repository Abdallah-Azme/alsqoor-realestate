import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  usePackages,
  useActiveSubscription,
} from "@/features/packages/hooks/use-packages";
import { Package } from "@/features/packages/types/packages.types";
import { useState } from "react";
import { SubscriptionDialog } from "./subscription-dialog";

interface PackageProps {
  id: string | number;
  title: string;
  price: string;
  duration: string;
  features: string[];
  isCurrent?: boolean;
  showRenewButton?: boolean;
  onSelect: (id: string | number) => void;
}

const PackageCard = ({
  id,
  title,
  price,
  duration,
  features,
  isCurrent,
  showRenewButton = true,
  onSelect,
}: PackageProps) => {
  const t = useTranslations("Profile");

  return (
    <Card
      className={`border transition-all duration-300 h-full flex flex-col justify-between ${
        isCurrent
          ? "border-main-green bg-green-50/30 shadow-sm"
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
        {showRenewButton && (
          <Button
            onClick={() => onSelect(id)}
            className={`w-full font-bold h-10 gap-2 ${
              isCurrent
                ? "bg-main-green hover:bg-green-700 text-white"
                : "bg-main-navy hover:bg-navy-700 text-white"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {isCurrent ? t("renew_package") : t("change_plan")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const PackagesTab = () => {
  const t = useTranslations("Profile");
  const { data: packages, isLoading, error } = usePackages();
  const { data: activeSubData, isLoading: isLoadingActive } =
    useActiveSubscription();

  const [selectedPackageId, setSelectedPackageId] = useState<
    string | number | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectPackage = (id: string | number) => {
    setSelectedPackageId(id);
    setIsDialogOpen(true);
  };

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

  const isEndDateExceeded = () => {
    if (!activeSubData?.package?.endDate) return false;
    const endDate = new Date(activeSubData.package.endDate);
    const today = new Date();
    return endDate <= today;
  };

  if (isLoading || isLoadingActive) {
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
      {/* Active Package */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold text-main-navy">
            {t("active_package")}
          </h2>
        </div>

        {activeSubData?.package?.package ? (
          <div className="max-w-md">
            <PackageCard
              id={activeSubData.package.package.id}
              title={activeSubData.package.package.name}
              price={activeSubData.package.package.price}
              duration={t("remaining_days", {
                days: activeSubData.package.remainingDays,
              })}
              features={getFeaturesList(activeSubData.package.package)}
              isCurrent={true}
              showRenewButton={isEndDateExceeded()}
              onSelect={handleSelectPackage}
            />
          </div>
        ) : (
          <p className="text-gray-500">{t("no_active_package")}</p>
        )}
      </div>

      {/* Packages Grid */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold text-main-navy">
            {t("other_packages")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages?.map((pkg) => (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.name}
              price={pkg.price}
              duration={t("for_duration", {
                duration: pkg.durationDays,
                unit: t("days"),
              })}
              features={getFeaturesList(pkg)}
              onSelect={handleSelectPackage}
            />
          ))}
        </div>
      </div>

      <SubscriptionDialog
        packageId={selectedPackageId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default PackagesTab;
