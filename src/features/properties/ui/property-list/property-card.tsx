"use client";

import { Property } from "../../types/property.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Bed, Bath, Maximize, DollarSign } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const t = useTranslations("properties");
  const locale = useLocale();

  const mainImage = property.images?.[0] || "/placeholder-property.jpg";
  const price = property.price_min
    ? `${property.price_min.toLocaleString()} - ${property.price_max?.toLocaleString()}`
    : property.price?.toLocaleString();

  return (
    <Link href={`/${locale}/marketplace/${property.slug || property.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover"
          />
          {property.is_featured && (
            <Badge className="absolute left-2 top-2 bg-main-green">
              {t("featured")}
            </Badge>
          )}
          {property.operation_type && (
            <Badge className="absolute right-2 top-2">
              {t(`operation_type.${property.operation_type}`)}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
            {property.title}
          </h3>

          {property.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {property.description}
            </p>
          )}

          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.city?.name || property.location || property.district}
            </span>
          </div>

          <div className="mb-3 flex flex-wrap gap-3 text-sm">
            {property.rooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.rooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>
                  {property.area} {t("sqm")}
                </span>
              </div>
            )}
          </div>

          {price && (
            <div className="flex items-center gap-1 text-lg font-bold text-primary">
              <DollarSign className="h-5 w-5" />
              <span>{price}</span>
            </div>
          )}

          {property.finishing_type && (
            <div className="mt-2">
              <Badge variant="outline" className="">
                {t(`finishing_type.${property.finishing_type}`)}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
