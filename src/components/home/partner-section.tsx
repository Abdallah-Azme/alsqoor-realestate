import React from "react";
import SectionHeader from "../shared/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLocale } from "next-intl";
import Partnercard from "../shared/partner-card";
import { getLocale, getTranslations } from "next-intl/server";
import { partnersService } from "@/features/partners";
import { AnimatedSection } from "@/components/motion/animated-section";
import { AnimatedCarouselItem } from "@/components/motion/animated-carousel-item";

const PartnerSection = async () => {
  const locale = await getLocale();
  const t = await getTranslations("partner");
  const data = await partnersService.getAll();
  return (
    <section className="container space-y-6 py-12">
      {/* header */}
      <AnimatedSection>
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
          <h3 className="text-4xl font-semibold">{t("title")}</h3>
          <CarouselContent className={"p-1"}>
            {data?.map((item, index) => (
              <AnimatedCarouselItem
                key={index}
                index={index}
                className="lg:basis-1/4 md:basis-1/2 basis-[90%]"
              >
                <Partnercard item={item} />
              </AnimatedCarouselItem>
            ))}
          </CarouselContent>
          <div
            className={`flex items-center justify-center gap-3  ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <CarouselPrevious className={"static translate-0 "} />
            <CarouselNext className={"static translate-0 "} />
          </div>
        </Carousel>
      </AnimatedSection>
    </section>
  );
};

export default PartnerSection;
