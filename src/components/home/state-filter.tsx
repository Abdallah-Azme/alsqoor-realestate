"use client";
import SectionHeader from "../shared/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import BrokersListing from "@/components/marketplace/brokers-listing";
import DevelopersListing from "@/components/marketplace/developers-listing";
import OwnersListing from "@/components/marketplace/owners-listing";

const StateFilterSection = () => {
  const locale = useLocale();
  const t = useTranslations("home.state_filter");
  const tMarketplace = useTranslations("marketplace.tabs");

  const tapStyle =
    "bg-white px-6 py-2.5 md:px-8 md:py-3 shadow-none data-[state=active]:text-main-green data-[state=active]:border-b-2 data-[state=active]:border-main-green rounded-lg font-medium transition-colors";

  return (
    <section className="container py-12 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 0.6 }}
        className="triangle bg-main-light-green lg:py-10 pt-12 pb-6 lg:w-[90%] mx-auto flex items-center justify-center flex-col lg:gap-6 gap-3"
      >
        <SectionHeader>{t("success_partners")}</SectionHeader>
        <h3 className="lg:text-4xl md:text-3xl text-xl font-semibold">
          {t("choose_property")}
        </h3>
      </motion.div>
      {/* layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-main-light-gray lg:p-10 p-5 rounded-xl"
      >
        <Tabs
          dir={locale === "ar" ? "rtl" : "ltr"}
          defaultValue="brokers"
          className="space-y-6"
        >
          <div className="flex items-center justify-center mb-8">
            <TabsList className="h-full flex flex-wrap gap-2 lg:gap-4 bg-transparent">
              <TabsTrigger value="brokers" className={tapStyle}>
                {tMarketplace("brokers")}
              </TabsTrigger>
              <TabsTrigger value="owners" className={tapStyle}>
                {tMarketplace("owners")}
              </TabsTrigger>
              <TabsTrigger value="developers" className={tapStyle}>
                {tMarketplace("developers")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent className={"m-0 p-0 pt-4"} value="brokers">
            <BrokersListing />
          </TabsContent>
          <TabsContent className={"m-0 p-0 pt-4"} value="owners">
            <OwnersListing />
          </TabsContent>
          <TabsContent className={"m-0 p-0 pt-4"} value="developers">
            <DevelopersListing />
          </TabsContent>
        </Tabs>
      </motion.div>
      <Image
        src={"/images/banner.png"}
        width={200}
        height={200}
        alt="banner"
        className="static w-full object-contain rounded-e-xl"
      />
    </section>
  );
};

export default StateFilterSection;
