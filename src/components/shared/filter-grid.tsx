import React from "react";
import StatesCard from "./state-card";
import AnimatedDoor from "./animated-door";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLocale, useTranslations } from "next-intl";

const FilterGrid = ({ properties = [], loading = false }) => {
  const locale = useLocale();
  const t = useTranslations("estates_filter");

  // Show loading skeletons
  if (loading) {
    return (
      <>
        <div className="lg:grid hidden lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-6 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <StatesCard key={index} withBorder={false} />
          ))}
        </div>
        <Carousel
          className={"space-y-8 lg:hidden"}
          opts={{
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr",
            align: "start",
          }}
        >
          <CarouselContent className={"p-1"}>
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="lg:basis-1/4 md:basis-1/2 basis-[90%]"
              >
                <StatesCard />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </>
    );
  }

  // Show empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t("no_properties_found")}</p>
      </div>
    );
  }

  // Limit to 6 properties for grid view
  const gridProperties = properties.slice(0, 6);

  return (
    <>
      <div className="lg:grid hidden lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-6 gap-4">
        {gridProperties.map((property) => (
          <StatesCard
            key={property.id}
            withBorder={false}
            property={property}
          />
        ))}
        <button className="lg:col-span-3 md:col-span-2 col-span-1">
          <AnimatedDoor />
        </button>
      </div>

      {/* slider */}
      <Carousel
        className={"space-y-8 lg:hidden"}
        opts={{
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
          align: "start",
        }}
      >
        <CarouselContent className={"p-1"}>
          {properties.map((property) => (
            <CarouselItem
              key={property.id}
              className="lg:basis-1/4 md:basis-1/2 basis-[90%]"
            >
              <StatesCard property={property} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-3 flex-row-reverse pb-8">
          <CarouselPrevious className={"static translate-0 "} />
          <CarouselNext className={"static translate-0 "} />
        </div>
      </Carousel>
    </>
  );
};

export default FilterGrid;
