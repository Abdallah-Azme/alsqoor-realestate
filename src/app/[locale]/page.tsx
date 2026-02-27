import AboutSection from "@/components/home/about-section";
import BlogSection from "@/components/home/blog-section";
import ClientReviews from "@/components/home/client-reviews";
import HeroSection from "@/components/home/hero-section";
import PartnerSection from "@/components/home/partner-section";
import ServicesSection from "@/components/home/services-section";
import StateFilterSection from "@/components/home/state-filter";
import StatesSection from "@/components/home/states-section";
import { homeService } from "@/features/home";
import { propertiesService } from "@/features/properties";
import { getSettings } from "@/lib/settings-actions";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}

interface HomeData {
  contentSections?: any[];
  coreValues?: any[];
  statistics?: any[];
  platformRating?: string;
  video?: string | null;
  [key: string]: any;
}

export default async function Home() {
  let homeData: HomeData = {};
  try {
    homeData = (await homeService.getHomeData()) || {};
  } catch (error) {
    console.error("Error fetching home data:", error);
    // Continue with empty homeData
  }

  const {
    contentSections = [],
    coreValues = [],
    statistics = [],
    platformRating = "4.8",
    video = null,
    media = {},
  } = homeData;

  // Fetch featured properties
  let featuredProperties = [];
  try {
    featuredProperties = await propertiesService.getFeaturedProperties();
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    // Continue with empty featuredProperties
  }

  // Fetch settings for phone number
  const settings = await getSettings();

  return (
    <>
      <HeroSection
        video={video}
        settings={settings}
        heroContent={contentSections[0]}
      />
      <ServicesSection coreValues={coreValues} />

      <AboutSection
        sections={contentSections}
        platformRating={platformRating}
        statistics={statistics}
        bannerImage={media?.bannerImage}
      />
      <StateFilterSection />
      {/* <StatesSection properties={featuredProperties} /> */}
      <ClientReviews />
      <BlogSection />
      <PartnerSection />
    </>
  );
}
