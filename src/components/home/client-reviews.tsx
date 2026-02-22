import React from "react";
import SectionHeader from "../shared/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ClientCard from "../shared/client-card";
import { getLocale, getTranslations } from "next-intl/server";
import { reviewsService } from "@/features/reviews";
import { AnimatedSection } from "@/components/motion/animated-section";
import { AnimatedCarouselItem } from "@/components/motion/animated-carousel-item";

const ClientReviews = async () => {
  const locale = await getLocale();
  const t = await getTranslations("client_reviews");

  let data = [];
  try {
    data = await reviewsService.getAll();
  } catch (error) {
    console.error("Failed to fetch client reviews:", error);
  }

  // Don't render the section if there's no data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 py-12">
      {/* header */}
      <AnimatedSection className="container">
        <SectionHeader>{t("title")}</SectionHeader>
      </AnimatedSection>

      {/* slider */}
      <AnimatedSection delay={0.2}>
        <Carousel
          className={"space-y-8"}
          opts={{
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr",
            align: "start",
          }}
        >
          {/* title */}
          <div className="flex items-center justify-between container">
            <div className="space-y-6">
              <h3 className="text-4xl font-semibold">{t("subtitle")}</h3>
              <p className="text-xs"> {t("description")}</p>
            </div>
            <div className={`flex items-center gap-3 w-fit`}>
              <CarouselPrevious className={"static translate-0 "} />
              <CarouselNext className={"static translate-0 "} />
            </div>
          </div>
          <CarouselContent className={"lg:w-[90%] ms-auto max-lg:container"}>
            {data.map((item, index) => (
              <AnimatedCarouselItem
                key={index}
                index={index}
                className="lg:basis-[35%] md:basis-1/2 basis-[90%]"
              >
                <ClientCard item={item} />
              </AnimatedCarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </AnimatedSection>
    </section>
  );
};

export default ClientReviews;
