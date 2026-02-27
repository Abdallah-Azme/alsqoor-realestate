"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRealEstateBySlug } from "@/features/marketplace/hooks/use-marketplace-properties";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { motion } from "motion/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Bed,
  Maximize,
  Calendar,
  Eye,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketplacePropertyDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations("properties");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const tMarket = useTranslations("marketplace");

  // Safe label lookup for transaction/property types that come from the API
  const typeLabels: Record<string, string> = {
    buy: "شراء",
    sale: "بيع",
    rent: "إيجار",
    apartment: "شقة",
    villa: "فيلا",
    land: "أرض",
    land_residential: "أرض سكنية",
    land_commercial: "أرض تجارية",
    commercial_shop: "محل تجاري",
    office: "مكتب",
    building: "عمارة",
    floor: "دور",
    shop: "محل",
    warehouse: "مستودع",
    rest_house: "استراحة",
    farm: "مزرعة",
    factory: "مصنع",
    other: "أخرى",
  };

  const getTypeLabel = (value?: string | null) => {
    if (!value) return "—";
    return typeLabels[value] ?? value;
  };

  const { data: property, isLoading, error } = useRealEstateBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-main-green" />
        <p className="text-gray-500 font-medium">
          {t("loading") || "Loading property details..."}
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-main-navy">
          {t("error_fetch") || "Error loading property"}
        </h2>
        <p className="text-gray-600">
          {t("error_server") ||
            "The property could not be found or there was a server error."}
        </p>
        <Button onClick={() => window.history.back()} variant="outline">
          {t("back") || "Go Back"}
        </Button>
      </div>
    );
  }

  return (
    <main className="container py-8 space-y-8">
      <CustomBreadcrumbs
        items={[
          { label: tBreadcrumbs("marketplace"), href: "/marketplace" },
          { label: property.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <Image
              src={property.image || "/images/state.png"}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            {property.isVerified && (
              <Badge className="absolute top-4 left-4 bg-main-green px-3 py-1 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-1 inline" /> {t("verified")}
              </Badge>
            )}
            <Badge className="absolute top-4 right-4 bg-main-navy px-3 py-1 text-sm">
              {tMarket(`broker.status.${property.status || "new"}`)}
            </Badge>
          </motion.div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-main-navy">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-2xl font-bold text-main-green bg-main-green/5 px-4 py-2 rounded-xl border border-main-green/10">
                {property.price
                  ? property.price.toLocaleString()
                  : property.startingPrice?.toLocaleString()}
                <span className="text-sm font-medium">
                  {property.currency || tMarket("currency")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <MapPin className="w-4 h-4 text-main-green" />
                <span>
                  {property.city?.name || property.location},{" "}
                  {property.country?.name}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Calendar className="w-4 h-4 text-main-green" />
                <span>{new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Eye className="w-4 h-4 text-main-green" />
                <span>
                  {property.views} {t("views")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
              <div className="text-center space-y-1">
                <p className="text-gray-400 text-xs uppercase font-semibold">
                  {t("area")}
                </p>
                <div className="flex items-center justify-center gap-1 font-bold text-main-navy">
                  <Maximize className="w-4 h-4 text-main-green" />
                  {property.area} {tMarket("area_unit")}
                </div>
              </div>
              {property.rooms && (
                <div className="text-center space-y-1">
                  <p className="text-gray-400 text-xs uppercase font-semibold">
                    {t("rooms")}
                  </p>
                  <div className="flex items-center justify-center gap-1 font-bold text-main-navy">
                    <Bed className="w-4 h-4 text-main-green" />
                    {property.rooms}
                  </div>
                </div>
              )}
              <div className="text-center space-y-1">
                <p className="text-gray-400 text-xs uppercase font-semibold">
                  {t("transaction_type")}
                </p>
                <Badge
                  variant="outline"
                  className="font-bold text-main-navy border-main-green/20"
                >
                  {getTypeLabel(
                    property.transactionType || property.propertyType,
                  )}
                </Badge>
              </div>
              <div className="text-center space-y-1">
                <p className="text-gray-400 text-xs uppercase font-semibold">
                  {t("commission")}
                </p>
                <div className="font-bold text-main-green">
                  {property.commissionPercentage
                    ? `%${property.commissionPercentage}`
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-main-navy">
                {t("description")}
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: User Info and Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-main-navy border-b pb-4 border-gray-100">
              {t("contact_info") || "معلومات الاتصال"}
            </h3>

            <div className="flex items-center gap-4">
              <div className="bg-main-light-gray p-3 rounded-full">
                <User className="w-8 h-8 text-main-navy" />
              </div>
              <div>
                <p className="font-bold text-main-navy">
                  {property.user?.name}
                </p>
                <Badge
                  variant="secondary"
                  className="text-[10px] mt-1 uppercase"
                >
                  {property.user?.role}{" "}
                  {property.user?.agentType && `(${property.user.agentType})`}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button className="w-full bg-main-green hover:bg-main-green/90 h-12 text-md font-bold">
                {tMarket("start_marketing") || "ابدأ التسويق"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-md font-bold text-main-navy"
              >
                {t("contact_owner") || "تواصل مع المعلن"}
              </Button>
            </div>

            {property.totalUnits && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-main-green" />
                  <span className="text-sm font-semibold text-main-navy">
                    {t("total_units") || "إجمالي الوحدات"}
                  </span>
                </div>
                <p className="text-2xl font-bold text-main-green">
                  {property.totalUnits}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MarketplacePropertyDetailPage;
