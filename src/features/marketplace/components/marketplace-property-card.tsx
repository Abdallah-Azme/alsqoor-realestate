"use client";

import { MarketplaceProperty } from "../../properties/types/property.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Bed, Maximize, DollarSign } from "lucide-react";
import { motion } from "motion/react";

interface MarketplacePropertyCardProps {
  property: MarketplaceProperty;
  index?: number;
}

export function MarketplacePropertyCard({
  property,
  index = 0,
}: MarketplacePropertyCardProps) {
  const t = useTranslations("properties");
  const tMarket = useTranslations("marketplace");
  const locale = useLocale();

  const mainImage = property.image || "/images/state.png";
  const formattedPrice = property.price
    ? property.price.toLocaleString()
    : property.startingPrice
      ? `${t("from")} ${Number(property.startingPrice).toLocaleString()}`
      : t("contact_for_price");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/marketplace/${property.slug || property.id}`}>
        <Card className="overflow-hidden transition-all hover:shadow-lg border-2 border-gray-100 h-full flex flex-col">
          <div className="relative h-48 w-full shrink-0">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover"
            />
            {property.isVerified && (
              <Badge className="absolute left-2 top-2 bg-main-green">
                {t("verified")}
              </Badge>
            )}
            {property.status && (
              <Badge className="absolute right-2 top-2 bg-main-navy">
                {tMarket(`broker.status.${property.status}`)}
              </Badge>
            )}
          </div>

          <CardContent className="p-4 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-1 text-lg font-bold text-main-navy">
                {property.title}
              </h3>

              {property.description && (
                <div
                  className="mb-3 line-clamp-2 text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              )}

              <div className="mb-3 flex flex-wrap gap-3 text-sm text-gray-500">
                {property.rooms && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-main-green" />
                    <span>{property.rooms}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4 text-main-green" />
                    <span>
                      {property.area} {tMarket("area_unit")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-lg font-bold text-main-green">
                <span>{formattedPrice}</span>
                <span className="text-sm font-medium">
                  {property.currency || tMarket("currency")}
                </span>
              </div>

              {property.transactionType && (
                <Badge variant="outline" className="text-xs uppercase">
                  {t(property.transactionType)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
