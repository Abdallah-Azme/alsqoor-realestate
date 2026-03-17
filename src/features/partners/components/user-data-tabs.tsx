"use client";

import { useLocale, useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useUserMarketedProperties,
  useUserProperties,
  useUserRequests,
} from "../hooks/use-userdata";
import { Loader2, Building2, ClipboardList, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { MapPin, Bed, Maximize, DollarSign, Hash } from "lucide-react";

interface UserDataTabsProps {
  userId: string | number;
}

// ─── Mini Property Card ───────────────────────────────────────────
function PropertyCard({ property, index }: { property: any; index: number }) {
  const firstImage = Array.isArray(property.images) && property.images.length > 0
    ? property.images[0]
    : null;

  const price = property.price
    ? Number(property.price).toLocaleString()
    : property.startingPrice
      ? `من ${Number(property.startingPrice).toLocaleString()}`
      : "السعر عند الطلب";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-44 w-full bg-gray-100 shrink-0">
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Home className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {property.isVerified && (
          <Badge className="absolute left-2 top-2 bg-main-green text-xs">موثق</Badge>
        )}
        {property.status && (
          <Badge className="absolute right-2 top-2 bg-main-navy text-xs">{property.status}</Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-main-navy text-base line-clamp-1">{property.title}</h3>

        {property.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{property.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
          {property.rooms && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-main-green" />
              {property.rooms}
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-main-green" />
              {property.area} م²
            </span>
          )}
          {property.city?.name && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-main-green" />
              {property.city.name}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-main-green text-base">
            {price}
            {property.currency && (
              <span className="text-xs font-medium text-gray-500 mr-1">{property.currency}</span>
            )}
          </span>
          {property.transactionType && (
            <Badge variant="outline" className="text-xs capitalize">
              {property.transactionType === "buy" ? "بيع" : "إيجار"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Mini Request Card ────────────────────────────────────────────
function RequestCard({ request }: { request: any }) {
  const statusColors: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    expired: "bg-gray-100 text-gray-600 border-gray-200",
    accepted: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    closed: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const statusClass = statusColors[request.status] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Hash className="w-3.5 h-3.5" />
            {request.requestNumber}
          </span>
          <Badge variant="outline" className={`text-xs ${statusClass}`}>
            {request.statusLabel || request.status}
          </Badge>
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-main-green font-bold">النوع:</span>
            {request.requestTypeLabel}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-main-green font-bold">الدفع:</span>
            {request.paymentMethodLabel}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-main-green font-bold">المساحة:</span>
            {request.area} م²
          </div>
          <div className="flex items-center gap-1">
            <span className="text-main-green font-bold">الميزانية:</span>
            {request.budgetAmount
              ? `${Number(request.budgetAmount).toLocaleString()} ر.س`
              : request.budgetTypeLabel}
          </div>
        </div>

        {/* Location */}
        {(request.city?.name || request.district) && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-main-green shrink-0" />
            <span>
              {[request.city?.name, request.district].filter(Boolean).join(" - ")}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="text-xs text-gray-400 pt-1">
          {new Date(request.createdAt).toLocaleDateString("ar-SA")}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Tabs Component ──────────────────────────────────────────
export function UserDataTabs({ userId }: UserDataTabsProps) {
  const t = useTranslations("partners_profile");
  const locale = useLocale();

  // ⚠️ NOTE: api-client auto-unwraps { success, data, meta } → returns only `data` (the array directly).
  // So `marketedData` IS the array, not { data: [], meta: {} }.
  const { data: marketedData, isLoading: isLoadingMarketed } =
    useUserMarketedProperties(userId);
  const { data: propertiesData, isLoading: isLoadingProperties } =
    useUserProperties(userId);
  const { data: requestsData, isLoading: isLoadingRequests } =
    useUserRequests(userId);

  // The api-client strips the wrapper → each "data" variable IS the array
  const marketedList = Array.isArray(marketedData) ? marketedData : [];
  const propertiesList = Array.isArray(propertiesData) ? propertiesData : [];
  const requestsList = Array.isArray(requestsData) ? requestsData : [];

  return (
    <div className="w-full">
      <Tabs
        defaultValue="marketed"
        className="w-full"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-0 rounded-xl mb-12 overflow-hidden h-14 items-stretch">
          <TabsTrigger
            value="marketed"
            className="rounded-none h-full data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:shadow-sm transition-all font-bold gap-2 text-base"
          >
            <Building2 className="w-5 h-5" />
            {t("marketed_properties")}
            {marketedList.length > 0 && (
              <span className="bg-main-green/10 text-main-green text-xs rounded-full px-2 py-0.5">
                {marketedList.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="properties"
            className="rounded-none h-full data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:shadow-sm transition-all font-bold gap-2 text-base"
          >
            <Home className="w-5 h-5" />
            {t("properties")}
            {propertiesList.length > 0 && (
              <span className="bg-main-green/10 text-main-green text-xs rounded-full px-2 py-0.5">
                {propertiesList.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="rounded-none h-full data-[state=active]:bg-white data-[state=active]:text-main-green data-[state=active]:shadow-sm transition-all font-bold gap-2 text-base"
          >
            <ClipboardList className="w-5 h-5" />
            {t("requests")}
            {requestsList.length > 0 && (
              <span className="bg-main-green/10 text-main-green text-xs rounded-full px-2 py-0.5">
                {requestsList.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ─── Marketed Properties ─── */}
        <TabsContent value="marketed" className="mt-0 outline-none">
          {isLoadingMarketed ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-main-green" />
            </div>
          ) : marketedList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketedList.map((property: any, index: number) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{t("no_marketed_properties")}</p>
            </div>
          )}
        </TabsContent>

        {/* ─── Properties ─── */}
        <TabsContent value="properties" className="mt-0 outline-none">
          {isLoadingProperties ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-main-green" />
            </div>
          ) : propertiesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesList.map((property: any, index: number) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{t("no_properties")}</p>
            </div>
          )}
        </TabsContent>

        {/* ─── Requests ─── */}
        <TabsContent value="requests" className="mt-0 outline-none">
          {isLoadingRequests ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-main-green" />
            </div>
          ) : requestsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requestsList.map((request: any) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{t("no_requests")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
