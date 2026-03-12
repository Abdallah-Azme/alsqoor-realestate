"use client";

import { Property } from "../../types/property.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Home,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Sparkles,
} from "lucide-react";
import PropertyLocationMap from "@/components/estates/property-location-map";

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const t = useTranslations("properties");

  const getName = (obj: any): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj.name || "";
  };

  const p_min = property.price_min ?? property.priceMin;
  const p_max = property.price_max ?? property.priceMax;
  const p_val = property.price ?? property.price_val; // Checking common variants

  const price = p_min
    ? `${Number(p_min).toLocaleString()} - ${p_max ? Number(p_max).toLocaleString() : ""}`
    : p_val
      ? Number(p_val).toLocaleString()
      : null;

  return (
    <div className="space-y-8">
      {/* Header & Price Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap gap-2">
            {(property.operation_type || property.operationType) && (
              <Badge className="bg-primary hover:bg-primary/90">
                {t(
                  `operation_type.${property.operation_type || property.operationType}`,
                )}
              </Badge>
            )}
            {(property.is_featured || property.isFeatured) && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 hover:bg-amber-100"
              >
                {t("featured")}
              </Badge>
            )}
            {property.status && (
              <Badge
                variant="outline"
                className="border-primary/20 text-primary"
              >
                {t(`status.${property.status}`)}
              </Badge>
            )}
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            {property.title}
          </h1>
          {property.location && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span className="text-sm">{property.location}</span>
            </div>
          )}
        </div>

        {price && (
          <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-xl border border-primary/10">
            <p className="text-sm font-medium text-primary/70 mb-1">
              {t("price")}
            </p>
            <p className="text-2xl font-bold text-primary">
              {price}{" "}
              <span className="text-lg font-semibold">
                {property.currency || "SAR"}
              </span>
            </p>
            {(property.price_per_meter || property.pricePerMeter) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {Number(
                  property.price_per_meter || property.pricePerMeter,
                ).toLocaleString()}{" "}
                {t("per_sqm")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Key Features Bar - Compact and Modern */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
        {(property.rooms || property.bedrooms) && (
          <div className="flex items-center gap-3 border-r last:border-0 border-gray-100 pr-4 md:justify-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bed className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-tight">
                {t("rooms")}
              </p>
              <p className="font-bold text-gray-900">
                {property.rooms || property.bedrooms}
              </p>
            </div>
          </div>
        )}
        {property.bathrooms && (
          <div className="flex items-center gap-3 border-r last:border-0 border-gray-100 pr-4 md:justify-center">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Bath className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-tight">
                {t("bathrooms")}
              </p>
              <p className="font-bold text-gray-900">{property.bathrooms}</p>
            </div>
          </div>
        )}
        {property.area && (
          <div className="flex items-center gap-3 border-r last:border-0 border-gray-100 pr-4 md:justify-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Maximize className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-tight">
                {t("area")}
              </p>
              <p className="font-bold text-gray-900">
                {property.area}{" "}
                <span className="text-[10px] font-normal">{t("sqm")}</span>
              </p>
            </div>
          </div>
        )}
        {(property.property_age !== undefined ||
          property.propertyAge !== undefined) && (
          <div className="flex items-center gap-3 md:justify-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-tight">
                {t("age")}
              </p>
              <p className="font-bold text-gray-900">
                {property.property_age ?? property.propertyAge}{" "}
                <span className="text-[10px] font-normal">{t("years")}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Description & Amenities */}
        <div className="space-y-8">
          {/* Description */}
          {property.description && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("description")}
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="whitespace-pre-line text-gray-600 leading-relaxed text-sm md:text-base">
                  {property.description}
                </p>
              </div>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t("amenities")}
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <Badge
                      key={amenity.id}
                      variant="secondary"
                      className="px-3 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 border-none"
                    >
                      {amenity.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details & Legal */}
        <div className="space-y-8">
          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              {t("property_details")}
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(property.property_use || property.propertyUse) && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t("property_use_label") || t("property_type")}
                    </dt>
                    <dd className="font-medium text-gray-900 border-b border-gray-50 pb-2">
                      {t(
                        `property_use.${property.property_use || property.propertyUse}`,
                      )}
                    </dd>
                  </div>
                )}
                {(property.finishing_type || property.finishingType) && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t("finishing_type_label") || "التشطيب"}
                    </dt>
                    <dd className="font-medium text-gray-900 border-b border-gray-50 pb-2">
                      {t(
                        `finishing_type.${property.finishing_type || property.finishingType}`,
                      )}
                    </dd>
                  </div>
                )}
                {property.facade && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t("facade.label")}
                    </dt>
                    <dd className="font-medium text-gray-900 border-b border-gray-50 pb-2">
                      {t(`facade.${property.facade}`)}
                    </dd>
                  </div>
                )}
                {(property.usable_area || property.usableArea) && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t("usable_area")}
                    </dt>
                    <dd className="font-medium text-gray-900 border-b border-gray-50 pb-2">
                      {property.usable_area || property.usableArea} {t("sqm")}
                    </dd>
                  </div>
                )}
                {property.balconies !== undefined && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t("balconies")}
                    </dt>
                    <dd className="font-medium text-gray-900 border-b border-gray-50 pb-2">
                      {property.balconies}
                    </dd>
                  </div>
                )}
                {property.garages !== undefined && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {t("garages")}
                    </dt>
                    <dd className="font-medium text-gray-900 border-b border-gray-50 pb-2">
                      {property.garages}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Legal Information */}
          {(property.license_number ||
            property.has_mortgage ||
            property.has_restriction) && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t("legal_info")}
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="space-y-4">
                  {(property.license_number || property.licenseNumber) && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t("license_number")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {property.license_number || property.licenseNumber}
                      </span>
                    </div>
                  )}
                  {(property.has_mortgage !== undefined ||
                    property.hasMortgage !== undefined) && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">
                        {t("has_mortgage")}
                      </span>
                      <Badge
                        variant={
                          property.has_mortgage || property.hasMortgage
                            ? "destructive"
                            : "secondary"
                        }
                        className="rounded-md"
                      >
                        {property.has_mortgage || property.hasMortgage
                          ? t("yes")
                          : t("no")}
                      </Badge>
                    </div>
                  )}
                  {(property.has_restriction !== undefined ||
                    property.hasRestriction !== undefined) && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">
                        {t("has_restriction")}
                      </span>
                      <Badge
                        variant={
                          property.has_restriction || property.hasRestriction
                            ? "destructive"
                            : "secondary"
                        }
                        className="rounded-md"
                      >
                        {property.has_restriction || property.hasRestriction
                          ? t("yes")
                          : t("no")}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Map */}
      {(property.latitude || property.longitude) && (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {t("location_title") || "الموقع"}
          </h3>
          <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg h-[400px]">
            <PropertyLocationMap
              latitude={property.latitude}
              longitude={property.longitude}
              title={property.title}
              address={
                getName(property.city) || property.location
                  ? `${getName(property.city) || property.location}، ${
                      getName(property.country) || ""
                    }`
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
