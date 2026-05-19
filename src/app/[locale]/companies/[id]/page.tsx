import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { CompanyDetailView, partnersService } from "@/features/partners";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  try {
    const company = await partnersService.getById(id, { locale });
    const description = company.description ?? t("partners.description");

    return {
      title: `${company.name} | ${t("partners.title")}`,
      description,
      openGraph: {
        images: company.logoUrl ? [company.logoUrl] : [],
      },
    };
  } catch {
    return {
      title: t("partners.title"),
      description: t("partners.description"),
    };
  }
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id, locale } = await params;
  const tBreadcrumbs = await getTranslations("breadcrumbs");
  const t = await getTranslations("company");

  let company;
  try {
    company = await partnersService.getById(id, { locale });
  } catch {
    notFound();
  }

  if (!company) {
    notFound();
  }

  return (
    <main className="min-h-screen space-y-10 pb-20">
      <div className="border-b bg-white shadow-sm">
        <div className="container space-y-4 px-4 py-8">
          <CustomBreadcrumbs
            items={[
              { label: tBreadcrumbs("home"), href: "/" },
              { label: tBreadcrumbs("partners"), href: "/" },
              { label: company.name },
            ]}
          />
        </div>
      </div>

      <div className="container px-4">
        <CompanyDetailView
          company={company}
          locale={locale}
          labels={{
            about: t("about"),
            contact: t("contact"),
            address: t("address"),
            email: t("email"),
            phone: t("phone"),
            memberSince: t("member_since"),
            call: t("call"),
            sendEmail: t("send_email"),
            chatWhatsapp: t("chat_whatsapp"),
            whatsappMessage: t("whatsapp_message"),
          }}
        />
      </div>
    </main>
  );
}
