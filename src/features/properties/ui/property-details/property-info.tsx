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

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const t = useTranslations("properties");

  const price = property.price_min
    ? `${property.price_min.toLocaleString()} - ${property.price_max?.toLocaleString()}`
    : property.price?.toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          {property.operation_type && (
            <Badge>{t(`operation_type.${property.operation_type}`)}</Badge>
          )}
          {property.is_featured && (
            <Badge variant="secondary">{t("featured")}</Badge>
          )}
          {property.status && (
            <Badge variant="outline">{t(`status.${property.status}`)}</Badge>
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
        <Card>
          <CardContent className="flex items-center gap-2 p-6">
            <DollarSign className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t("price")}</p>
              <p className="text-2xl font-bold">{price}</p>
              {property.price_per_meter && (
                <p className="text-sm text-muted-foreground">
                  {property.price_per_meter.toLocaleString()} {t("per_sqm")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>{t("key_features")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {property.rooms && (
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("rooms")}</p>
                  <p className="font-semibold">{property.rooms}</p>
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
            {property.property_age !== undefined && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("age")}</p>
                  <p className="font-semibold">
                    {property.property_age} {t("years")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle>{t("description")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t("property_details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {property.property_use && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("property_use.label")}:
                </span>
                <span className="font-medium">
                  {t(`property_use.${property.property_use}`)}
                </span>
              </div>
            )}
            {property.finishing_type && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("finishing_type.label")}:
                </span>
                <span className="font-medium">
                  {t(`finishing_type.${property.finishing_type}`)}
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
            {property.usable_area && (
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("usable_area")}:
                </span>
                <span className="font-medium">
                  {property.usable_area} {t("sqm")}
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
        <Card>
          <CardHeader>
            <CardTitle>{t("amenities")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity.id} variant="secondary">
                  {amenity.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Information */}
      {(property.license_number ||
        property.has_mortgage ||
        property.has_restriction) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("legal_info")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {property.license_number && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("license_number")}:
                  </span>
                  <span className="font-medium">{property.license_number}</span>
                </div>
              )}
              {property.has_mortgage !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("has_mortgage")}:
                  </span>
                  <Badge
                    variant={
                      property.has_mortgage ? "destructive" : "secondary"
                    }
                  >
                    {property.has_mortgage ? t("yes") : t("no")}
                  </Badge>
                </div>
              )}
              {property.has_restriction !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("has_restriction")}:
                  </span>
                  <Badge
                    variant={
                      property.has_restriction ? "destructive" : "secondary"
                    }
                  >
                    {property.has_restriction ? t("yes") : t("no")}
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
