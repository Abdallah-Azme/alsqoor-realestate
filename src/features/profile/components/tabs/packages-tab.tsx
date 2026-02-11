import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface PackageProps {
  title: string; // e.g., "Current Package" or "Second Package"
  price: string;
  duration: string; // e.g., "For 7 days"
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

  const features = [
    t("unlimited_ads"),
    t("continuous_technical_support"),
    t("continuous_technical_support"), // Repeated in screenshot
    t("unlimited_ads"),
    t("unlimited_ads"),
  ];

  return (
    <div className="space-y-8  ">
      {/* Current Package Section */}
      <div className="space-y-4">
        <div className="flex  ">
          <h2 className="text-2xl font-bold text-main-navy">
            {t("current_package")}
          </h2>
        </div>

        {/* Current Package Card */}
        {/* Use flex justify-end which respects RTL direction */}
        <div className="flex ">
          <div className="w-full md:w-1/3">
            <PackageCard
              title={t("current_package")}
              price="8.99"
              duration={t("for_duration", { duration: 7, unit: t("days") })}
              features={features}
              isCurrent={true}
            />
          </div>
        </div>
      </div>

      {/* Other Packages Section */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold text-main-navy">
            {t("other_packages")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PackageCard
            title={t("package_2")}
            price="8.99"
            duration={t("for_duration", { duration: 2, unit: t("days") })}
            features={features.slice(0, 4)}
          />
          <PackageCard
            title={t("package_3")}
            price="8.99"
            duration={t("for_duration", { duration: 3, unit: t("days") })}
            features={features.slice(0, 4)}
          />
          <PackageCard
            title={t("package_2")}
            price="8.99"
            duration={t("for_duration", { duration: 2, unit: t("days") })}
            features={features.slice(0, 4)}
          />
        </div>
      </div>
    </div>
  );
};

export default PackagesTab;
