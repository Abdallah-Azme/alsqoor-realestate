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

import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Zap,
  BarChart3,
  Check,
  TrendingUp,
  Award,
  Crown,
  Sparkles,
  LayoutDashboard,
  Users,
} from "lucide-react";

interface PackageProps {
  id: string | number;
  title: string;
  price: string;
  duration: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  showRenewButton?: boolean;
  hasAnyActiveSubscription?: boolean;
  onSelect: (id: string | number) => void;
}

const getTierStyles = (title: string, isCurrent: boolean) => {
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes("نخبة") ||
    normalizedTitle.includes("elite") ||
    normalizedTitle.includes("احتراف") ||
    normalizedTitle.includes("pro")
  ) {
    return {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      accentColor: "bg-purple-50",
      borderColor: "border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      badgeColor: "bg-purple-500 text-white",
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
      accentColor: "bg-amber-50",
      borderColor: "border-amber-200",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      badgeColor: "bg-amber-500 text-white",
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
      accentColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      badgeColor: "bg-blue-500 text-white",
      iconContainer: "bg-blue-100",
    };
  }
  // Default / Basic
  return {
    icon: <Rocket className="w-8 h-8 text-main-green" />,
    accentColor: "bg-green-50/50",
    borderColor: isCurrent ? "border-main-green" : "border-gray-100",
    buttonColor: "bg-main-navy hover:bg-navy-700",
    badgeColor: "bg-main-green text-white",
    iconContainer: "bg-main-green/10",
  };
};

const PackageCard = ({
  id,
  title,
  price,
  duration,
  features,
  isCurrent,
  isPopular = false,
  showRenewButton = true,
  hasAnyActiveSubscription = false,
  onSelect,
}: PackageProps) => {
  const t = useTranslations("Profile");
  const styles = getTierStyles(title, isCurrent || false);

  return (
    <Card
      className={`relative border-2 transition-all duration-300 h-full flex flex-col pt-8 pb-6 px-2 overflow-hidden ${
        isCurrent
          ? `${styles.borderColor} ${styles.accentColor} shadow-md`
          : "border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 left-0 bg-main-green text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider">
          {t("popular_badge") || "الاكثر طلباً"}
        </div>
      )}

      {isCurrent && (
        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className="bg-main-green/20 text-main-green border-none text-[10px] py-0 px-2"
          >
            {t("active_package")}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pt-2 space-y-4">
        <div
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${styles.iconContainer}`}
        >
          {styles.icon}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-main-navy tracking-tight">
            {title}
          </h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm font-medium text-gray-400">
              {t("currency")}
            </span>
            <span className="text-4xl font-extrabold text-main-navy">
              {price}
            </span>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            {duration}
          </p>
        </div>
      </CardHeader>

      <CardContent className="grow px-6">
        <div className="h-px bg-gray-100 w-full my-4" />
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3 transition-colors group"
            >
              <div className="mt-0.5 rounded-full bg-main-green/10 p-1 group-hover:bg-main-green/20">
                <Check className="w-3 h-3 text-main-green" />
              </div>
              <span className="text-sm text-main-navy font-semibold leading-relaxed line-clamp-2">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pt-6">
        {showRenewButton && (
          <Button
            onClick={() => onSelect(id)}
            className={`w-full font-black h-12 rounded-xl transition-all shadow-lg active:scale-95 ${
              isCurrent
                ? "bg-main-green hover:bg-main-green/90 text-white shadow-main-green/20"
                : "bg-main-navy hover:bg-main-navy/90 text-white shadow-main-navy/20"
            }`}
          >
            {isCurrent
              ? t("renew_package")
              : hasAnyActiveSubscription
                ? t("change_plan")
                : t("subscribe_now_button")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
            <PackageCard
              id={activeSubData.package.package.id}
              title={activeSubData.package.package.name}
              price={activeSubData.package.package.price}
              duration={t("remaining_days", {
                days: activeSubData.package.remainingDays,
              })}
              features={getFeaturesList(activeSubData.package.package)}
              isCurrent={true}
              hasAnyActiveSubscription={true}
              showRenewButton={isEndDateExceeded()}
              onSelect={handleSelectPackage}
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-400 font-medium">
              {t("no_active_package")}
            </p>
          </div>
        )}
      </div>

      {/* Packages Grid */}
      <div className="space-y-6 pt-10 border-t border-gray-100">
        <div className="text-center md:text-start space-y-1">
          <h2 className="text-3xl font-black text-main-navy italic">
            {t("other_packages")}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            اختر الخطة المناسبة لاحتياجاتك العقارية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-8">
          {packages?.map((pkg, index) => {
            const isPremium =
              pkg.name.toLowerCase().includes("مميز") ||
              pkg.name.toLowerCase().includes("premium") ||
              index === 1;
            return (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.name}
                price={pkg.price}
                isPopular={isPremium}
                duration={t("for_duration", {
                  duration: pkg.durationDays,
                  unit: t("days"),
                })}
                features={getFeaturesList(pkg)}
                hasAnyActiveSubscription={!!activeSubData?.package?.package}
                onSelect={handleSelectPackage}
              />
            );
          })}
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
