"use client";
import React, { useState, useEffect } from "react";
import ServicesCard from "../shared/services-card";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLocale } from "next-intl";

const ServicesSection = ({ coreValues = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const locale = useLocale();

  // Determine the cards to display
  const cards = coreValues.length > 0 ? coreValues : Array.from({ length: 4 });
  const cardCount = cards.length;

  // Handle active index from carousel
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial sync
    onSelect();

    return () => {
      if (api) {
        api.off("select", onSelect);
        api.off("reInit", onSelect);
      }
    };
  }, [api]);

  // Auto-cycle through items
  useEffect(() => {
    if (!api || cardCount <= 1) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000); // Cycle every 3 seconds

    return () => clearInterval(interval);
  }, [api, cardCount]);

  return (
    <section className="container py-12 ">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          direction: locale === "ar" ? "rtl" : "ltr",
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ms-4 py-4 min-h-[260px] cursor-grab active:cursor-grabbing">
          {cards.map((value, index) => (
            <CarouselItem
              key={index}
              className="pl-4 lg:basis-1/4 md:basis-1/2 basis-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ServicesCard
                  value={coreValues.length > 0 ? value : null}
                  isActive={activeIndex === index}
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ServicesSection;
