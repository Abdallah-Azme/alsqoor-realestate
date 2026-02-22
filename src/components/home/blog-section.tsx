import React from "react";
import SectionHeader from "../shared/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlogCard from "../shared/blog-card";
import { getLocale, getTranslations } from "next-intl/server";
import { blogsService } from "@/features/blogs";
import { AnimatedSection } from "@/components/motion/animated-section";
import { AnimatedCarouselItem } from "@/components/motion/animated-carousel-item";
const BlogSection = async () => {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const data = await blogsService.getAll();

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
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <h3 className="text-4xl font-semibold">{t("subtitle")}</h3>
              <p className="text-xs">{t("description")}</p>
            </div>

            <div className={`flex items-center gap-3 w-fit`}>
              <CarouselPrevious className={"static translate-0 "} />
              <CarouselNext className={"static translate-0 "} />
            </div>
          </div>
          <CarouselContent className={"p-1"}>
            {data?.map((item, index) => (
              <AnimatedCarouselItem
                key={index}
                index={index}
                className="lg:basis-1/4 md:basis-1/2 basis-[90%]"
              >
                <BlogCard item={item} />
              </AnimatedCarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </AnimatedSection>
    </section>
  );
};

export default BlogSection;
