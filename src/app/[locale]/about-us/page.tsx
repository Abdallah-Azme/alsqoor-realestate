import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import FAQSection from "@/components/shared/faq-section";
import { aboutService, AboutData } from "@/features/about";
import { getFaqs } from "@/lib/faq-actions";
import Image from "next/image";
import React from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("about.title"),
    description: t("about.description"),
  };
}

const AboutUsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("breadcrumbs");

  // Robust data fetching with error handling
  let data: AboutData | null = null;
  try {
    data = await aboutService.getAboutData();
  } catch (error) {
    console.error("Failed to fetch about data:", error);
  }

  // Ensure sections is always an array
  const sections = Array.isArray(data?.sections) ? data.sections : [];

  // Robust helper to handle messy data (strings, objects, nulls, undefined)
  const getVal = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      const localizedVal = val[locale] || val["ar"] || val["en"];
      if (typeof localizedVal === "string") return localizedVal;
      // Fallback to any string property found in the object
      const firstString = Object.values(val).find((v) => typeof v === "string");
      return typeof firstString === "string" ? firstString : "";
    }
    return String(val || "");
  };

  // Fetch FAQs with fallback
  let faqs = [];
  try {
    faqs = (await getFaqs()) || [];
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
  }

  // First section (with image at top)
  const firstSection = sections.length > 0 ? sections[0] : null;
  // Remaining sections (alternating layout)
  const remainingSections = sections.length > 1 ? sections.slice(1) : [];

  return (
    <main className="space-y-12">
      {/* Header */}
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("about_us") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("about_us")}</h1>
      </div>

      {/* First Section - with top image */}
      {firstSection && (
        <div className="container border border-main-gray p-4 space-y-8">
          {firstSection.image && (
            <Image
              src={firstSection.image}
              alt={getVal(firstSection.title)}
              width={1000}
              height={1000}
              className="w-full h-96 object-cover"
              priority
            />
          )}
          <div className="*:leading-8 space-y-6">
            <h1
              className="text-main-navy lg:text-4xl md:text-2xl text-xl font-bold! leading-12!"
              dangerouslySetInnerHTML={{
                __html: getVal(firstSection.title)
                  .replace(/\n/g, "<br />")
                  .replace(
                    /حلول العقارية|الحلول العقارية/g,
                    '<span class="text-main-green">الصقور العقارية</span>',
                  ),
              }}
            />
            {getVal(firstSection.content)
              .split("\n\n")
              .filter(Boolean)
              .map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
          </div>
        </div>
      )}

      {/* Remaining Sections - alternating layout */}
      {remainingSections.length > 0 && (
        <div className="container space-y-10">
          {remainingSections.map((section, index) => {
            if (!section) return null;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex items-center justify-between gap-8 ${
                  index < remainingSections.length - 1 ? "pb-10 border-b" : ""
                } max-md:flex-col ${isEven ? "max-md:flex-col-reverse" : ""}`}
              >
                {/* Text Content */}
                <div
                  className={`flex-1 *:text-sm *:leading-6 space-y-6 ${
                    isEven ? "order-1" : "order-2"
                  }`}
                >
                  <h3
                    className="text-main-navy lg:text-3xl text-2xl! lg:max-w-xl font-bold leading-12!"
                    dangerouslySetInnerHTML={{
                      __html: getVal(section.title)
                        .replace(
                          /العقارات/g,
                          '<span class="text-main-green">العقارات</span>',
                        )
                        .replace(
                          /الحلول العقارية|حلول العقارية/g,
                          '<span class="text-main-green">الصقور العقارية</span>',
                        ),
                    }}
                  />
                  {/* Check if content has line breaks for list items */}
                  {getVal(section.content).includes("\n") ? (
                    <ul className="list-disc space-y-6">
                      {getVal(section.content)
                        .split("\n")
                        .map((line: string) => line.trim())
                        .filter(Boolean)
                        .map((line: string, idx: number) => (
                          <li key={idx}>{line}</li>
                        ))}
                    </ul>
                  ) : (
                    <p>{getVal(section.content)}</p>
                  )}
                </div>

                {/* Image */}
                {section.image && (
                  <div className={`lg:w-1/3 ${isEven ? "order-2" : "order-1"}`}>
                    <Image
                      src={section.image}
                      alt={getVal(section.title)}
                      width={1000}
                      height={1000}
                      className="w-full lg:h-96 object-contain"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State if no sections at all */}
      {!firstSection && remainingSections.length === 0 && (
        <div className="container py-20 text-center text-gray-400">
          <p>
            {locale === "ar" ? "لا يوجد محتوى لعرضه" : "No content to display"}
          </p>
        </div>
      )}

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
    </main>
  );
};

export default AboutUsPage;
