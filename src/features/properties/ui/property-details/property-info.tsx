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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          {(property.operation_type || property.operationType) && (
            <Badge className="">
              {t(
                `operation_type.${property.operation_type || property.operationType}`,
              )}
            </Badge>
          )}
          {(property.is_featured || property.isFeatured) && (
            <Badge variant="secondary" className="">
              {t("featured")}
            </Badge>
          )}
          {property.status && (
            <Badge variant="outline" className="">
              {t(`status.${property.status}`)}
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">{property.title}</h1>
        {property.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        )}
      </div>

      {/* Price */}
      {price && (
        <Card className="">
          <CardContent className="flex items-center gap-2 p-6">
            <DollarSign className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t("price")}</p>
              <p className="text-2xl font-bold">
                {price} {property.currency || "SAR"}
              </p>
              {(property.price_per_meter || property.pricePerMeter) && (
                <p className="text-sm text-muted-foreground">
                  {Number(
                    property.price_per_meter || property.pricePerMeter,
                  ).toLocaleString()}{" "}
                  {t("per_sqm")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Features */}
      <Card className="">
        <CardHeader className="">
          <CardTitle className="">{t("key_features")}</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(property.rooms || property.bedrooms) && (
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("rooms")}</p>
                  <p className="font-semibold">
                    {property.rooms || property.bedrooms}
                  </p>
                </div>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("bathrooms")}
                  </p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("area")}</p>
                  <p className="font-semibold">
                    {property.area} {t("sqm")}
                  </p>
                </div>
              </div>
            )}
            {(property.property_age !== undefined ||
              property.propertyAge !== undefined) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("age")}</p>
                  <p className="font-semibold">
                    {property.property_age ?? property.propertyAge} {t("years")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {property.description && (
        <Card className="">
          <CardHeader className="">
            <CardTitle className="">{t("description")}</CardTitle>
          </CardHeader>
          <CardContent className="">
            <p className="whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Property Details */}
      <Card className="">
        <CardHeader className="">
          <CardTitle className="">{t("property_details")}</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid gap-3 md:grid-cols-2">
            {(property.property_use || property.propertyUse) && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("property_use_label") || t("property_type")}:
                </span>
                <span className="font-medium">
                  {t(
                    `property_use.${property.property_use || property.propertyUse}`,
                  )}
                </span>
              </div>
            )}
            {(property.finishing_type || property.finishingType) && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("finishing_type_label") || "السيشطيب"}:
                </span>
                <span className="font-medium">
                  {t(
                    `finishing_type.${property.finishing_type || property.finishingType}`,
                  )}
                </span>
              </div>
            )}
            {property.facade && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("facade.label")}:
                </span>
                <span className="font-medium">
                  {t(`facade.${property.facade}`)}
                </span>
              </div>
            )}
            {(property.usable_area || property.usableArea) && (
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("usable_area")}:
                </span>
                <span className="font-medium">
                  {property.usable_area || property.usableArea} {t("sqm")}
                </span>
              </div>
            )}
            {property.balconies !== undefined && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("balconies")}:
                </span>
                <span className="font-medium">{property.balconies}</span>
              </div>
            )}
            {property.garages !== undefined && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("garages")}:
                </span>
                <span className="font-medium">{property.garages}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <Card className="">
          <CardHeader className="">
            <CardTitle className="">{t("amenities")}</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity.id} variant="secondary" className="">
                  {amenity.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Map */}
      {(property.latitude || property.longitude) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("location_title") || "الموقع"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
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
          </CardContent>
        </Card>
      )}

      {/* Legal Information */}
      {(property.license_number ||
        property.has_mortgage ||
        property.has_restriction) && (
        <Card className="">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("legal_info")}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-2">
              {(property.license_number || property.licenseNumber) && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("license_number")}:
                  </span>
                  <span className="font-medium">
                    {property.license_number || property.licenseNumber}
                  </span>
                </div>
              )}
              {(property.has_mortgage !== undefined ||
                property.hasMortgage !== undefined) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("has_mortgage")}:
                  </span>
                  <Badge
                    variant={
                      property.has_mortgage || property.hasMortgage
                        ? "destructive"
                        : "secondary"
                    }
                    className=""
                  >
                    {property.has_mortgage || property.hasMortgage
                      ? t("yes")
                      : t("no")}
                  </Badge>
                </div>
              )}
              {(property.has_restriction !== undefined ||
                property.hasRestriction !== undefined) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("has_restriction")}:
                  </span>
                  <Badge
                    variant={
                      property.has_restriction || property.hasRestriction
                        ? "destructive"
                        : "secondary"
                    }
                    className=""
                  >
                    {property.has_restriction || property.hasRestriction
                      ? t("yes")
                      : t("no")}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
