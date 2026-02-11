"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import SectionHeader from "../shared/section-header";
import StatesCard from "../shared/state-card";
import { motion } from "motion/react";

const StatesSection = ({ properties = null }) => {
  const locale = useLocale();
  const t = useTranslations("home.featured_properties");

  // Use provided properties or fall back to placeholder
  const displayItems =
    properties && properties.length > 0
      ? properties
      : Array.from({ length: 7 });

  return (
    <section className="container py-12 space-y-8">
      {/* title */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between max-md:flex-col max-md:gap-6"
      >
        <div className="space-y-6">
          <SectionHeader>{t("title")}</SectionHeader>
          <h3 className="text-4xl font-semibold">{t("subtitle")}</h3>
          <p className="text-xs">{t("description")}</p>
        </div>
        {/* link */}
        <Link
          href={"/estats"}
          className="flex items-center gap-1 hover:gap-2 transation-all duration-300 text-main-green text-sm w-fit"
        >
          <IoIosArrowDroprightCircle size={20} className="drop-shadow-xl" />
          <span>{t("view_all")}</span>
        </Link>
      </motion.div>

      {/* slider */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Carousel
          className={"space-y-8"}
          opts={{
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr",
            align: "start",
          }}
        >
          <CarouselContent className={"p-1"}>
            {displayItems.map((property, index) => (
              <CarouselItem
                key={property?.id || index}
                className="lg:basis-1/4 md:basis-1/2 basis-[90%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <StatesCard property={property} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-3 flex-row-reverse">
            <CarouselPrevious className={"static translate-0"} />
            <CarouselNext className={"static translate-0"} />
          </div>
        </Carousel>
      </motion.div>
    </section>
  );
};

export default StatesSection;
