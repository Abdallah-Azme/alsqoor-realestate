import PageHeader from "@/components/shared/page-header";
import { getTranslations } from "next-intl/server";
import { PartnersList } from "@/features/partners";
import { AnimatedSection } from "@/components/motion/animated-section";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("partners.title"),
    description: t("partners.description"),
  };
}

const PartnersPage = async (props: { params: Promise<{ locale: string }> }) => {
  const { locale } = await props.params;
  const t = await getTranslations("agents");

  return (
    <main className="space-y-12 pb-20">
      {/* <AnimatedSection>
        <PageHeader
          title={t("title")}
          breadcrumbItems={[{ label: t("title") }]}
        />
      </AnimatedSection> */}

      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-linear-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("description")}
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.2}>
          <PartnersList />
        </AnimatedSection>
      </div>
    </main>
  );
};

export default PartnersPage;
