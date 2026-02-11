"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EstateCard from "@/components/estates/estate-card";
import { Property } from "@/types";
import { useLocale } from "next-intl";

interface PropertiesCarouselProps {
  properties: Property[];
}

export default function PropertiesCarousel({
  properties,
}: PropertiesCarouselProps) {
  const locale = useLocale();

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
        direction: locale === "ar" ? "rtl" : "ltr",
        align: "start",
      }}
    >
      <CarouselContent className="p-1">
        {properties.map((property: Property) => (
          <CarouselItem key={property.id} className="md:basis-1/2 basis-full">
            <EstateCard property={property} withBorder={true} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-center gap-3 mt-4" dir={"ltr"}>
        <CarouselPrevious className="static translate-0" />
        <CarouselNext className="static translate-0" />
      </div>
    </Carousel>
  );
}
