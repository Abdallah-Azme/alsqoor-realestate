import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import FAQSection from "@/components/shared/faq-section";
import { aboutService } from "@/features/about";
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

const AboutUsPage = async () => {
  const t = await getTranslations("breadcrumbs");
  const data = await aboutService.getAboutData();
  const sections = data?.sections || [];

  // Fetch FAQs
  const faqs = await getFaqs();

  // First section (with image at top)
  const firstSection = sections[0];
  // Remaining sections (alternating layout)
  const remainingSections = sections.slice(1);

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
              alt={firstSection.title}
              width={1000}
              height={1000}
              className="w-full h-96 object-cover"
            />
          )}
          <div className="*:leading-8 space-y-6">
            <h1
              className="text-main-navy lg:text-4xl md:text-2xl text-xl font-bold! leading-12!"
              dangerouslySetInnerHTML={{
                __html: firstSection.title
                  .replace(/\n/g, "<br />")
                  .replace(
                    /حلول العقارية|الحلول العقارية/g,
                    '<span class="text-main-green">الصقور العقارية</span>',
                  ),
              }}
            />
            {firstSection.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Sections - alternating layout */}
      {remainingSections.length > 0 && (
        <div className="container space-y-10">
          {remainingSections.map((section, index) => {
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
                  className={`*:text-sm *:leading-6 space-y-6 ${
                    isEven ? "order-1" : "order-2"
                  }`}
                >
                  <h3
                    className="text-main-navy lg:text-3xl text-2xl! lg:max-w-xl font-bold leading-12!"
                    dangerouslySetInnerHTML={{
                      __html: section.title
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
                  {section.content.includes("\n") ? (
                    <ul className="list-disc space-y-6">
                      {section.content
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>

                {/* Image */}
                {section.image && (
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={1000}
                    height={1000}
                    className={`lg:w-1/3 lg:h-96 object-contain ${
                      isEven ? "order-2" : "order-1"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
    </main>
  );
};

export default AboutUsPage;
