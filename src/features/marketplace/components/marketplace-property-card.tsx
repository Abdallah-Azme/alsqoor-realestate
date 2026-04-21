"use client";
import * as React from "react";
import { MarketplaceProperty } from "../../properties/types/property.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Bed, Maximize, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

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
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : ["/images/state.png"];

  React.useEffect(() => {
    if (!api) return;

    // In RTL/dynamic layouts, sometimes Embla needs an extra nudge
    setTimeout(() => {
      api.reInit();
      setCurrent(api.selectedScrollSnap());
    }, 100);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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
      className="h-full"
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg border-2 py-0 border-gray-100 h-full flex flex-col group/card">
        <div className="relative h-48 w-full shrink-0 group">
          {images.length > 1 ? (
            <Carousel
              setApi={setApi}
              className="w-full h-full overflow-hidden"
              opts={{
                loop: true,
                direction: locale === "ar" ? "rtl" : "ltr",
              }}
            >
              <CarouselContent
                className="h-48"
                style={{ marginInlineStart: 0 }}
              >
                {images.map((img, idx) => (
                  <CarouselItem
                    key={idx}
                    className="h-48 w-full basis-full"
                    style={{ paddingInlineStart: 0 }}
                  >
                    <Link
                      href={`/marketplace/${property.slug}`}
                      className="block h-full w-full"
                    >
                      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
                        <img
                          src={img}
                          alt={`${property.title} - ${idx + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/state.png";
                          }}
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      api?.scrollTo(idx);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      current === idx
                        ? "bg-main-green w-4"
                        : "bg-white/60 hover:bg-white/80",
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          ) : (
            <Link
              href={`/marketplace/${property.slug}`}
              className="block h-48 w-full"
            >
              <div className="h-48 w-full bg-gray-100 overflow-hidden">
                <img
                  src={images[0]}
                  alt={property.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/state.png";
                  }}
                />
              </div>
            </Link>
          )}

          {property.isVerified && (
            <Badge className="absolute left-2 top-2 bg-main-green z-20 pointer-events-none">
              {t("verified")}
            </Badge>
          )}
          {property.status && (
            <Badge className="absolute right-2 top-2 bg-main-navy z-20 pointer-events-none">
              {tMarket(`broker.status.${property.status}`)}
            </Badge>
          )}
        </div>

        <Link
          href={`/marketplace/${property.slug}`}
          className="flex-1 flex flex-col"
        >
          <CardContent className="p-4 flex-1 flex flex-col hover:bg-gray-50/50 transition-colors">
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-1 text-lg font-bold text-main-navy group-hover/card:text-main-green transition-colors">
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
                <Badge
                  variant="outline"
                  className="text-xs uppercase border-main-navy text-main-navy"
                >
                  {t(property.transactionType)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
