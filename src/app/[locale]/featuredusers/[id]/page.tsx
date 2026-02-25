import { getTranslations } from "next-intl/server";
import { featuredUsersService } from "@/features/featured-users";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  FiPhone,
  FiMessageSquare,
  FiStar,
  FiHome,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import AgentActionButtons from "@/features/featured-users/components/agent-action-buttons";
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/motion/animated-section";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("featuredUsers.title"),
    description: t("featuredUsers.description"),
  };
}

interface PageProps {
  params: {
    id: string;
  };
}

const AgentProfilePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const t = await getTranslations("agent_profile");
  const tBreadcrumbs = await getTranslations("breadcrumbs");

  // Fetch agent data
  let agent = null;
  try {
    agent = await featuredUsersService.getById(id);
  } catch (error) {
    console.error("Failed to fetch agent:", error);
  }

  // Mock data if API fails
  const agentData = agent || {
    id: id,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    mobile: "+966 50 123 4567",
    role: "broker",
    avatarUrl: "/images/avatar-placeholder.svg",
    pointsBalance: 500,
    propertiesCount: 25,
    rating: 4.8,
    reviewsCount: 45,
    memberSince: "2023-01-15",
    city: "الرياض",
    specialization: "فلل وشقق سكنية",
    bio: "وسيط عقاري معتمد مع خبرة أكثر من 10 سنوات في السوق العقاري السعودي. متخصص في الفلل والشقق السكنية في منطقة الرياض.",
  };

  return (
    <main className="space-y-8">
      {/* Header */}
      <AnimatedSection>
        <div className="bg-main-light-gray p-4 pb-8 space-y-4 rounded-b-xl container">
          <CustomBreadcrumbs
            items={[
              { label: tBreadcrumbs("featured_users"), href: "/featuredusers" },
              { label: agentData.name },
            ]}
          />
        </div>
      </AnimatedSection>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative">
                      <Image
                        src={
                          agentData.avatarUrl ||
                          "/images/avatar-placeholder.svg"
                        }
                        alt={agentData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-2xl font-bold text-main-navy">
                          {agentData.name}
                        </h1>
                        <Badge className="bg-main-green/10 text-main-green mt-1">
                          {t("verified_agent")}
                        </Badge>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-amber-500">
                        <FiStar className="fill-current" />
                        <span className="font-bold">{agentData.rating}</span>
                        <span className="text-gray-400 text-sm">
                          {agentData.reviewsCount || 0}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiHome className="text-main-green" />
                        <span>
                          {agentData.propertiesCount || 0} {t("properties")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMapPin className="text-main-green" />
                        <span>{agentData.city || "الرياض"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-main-green" />
                        <span>
                          {t("member_since")}{" "}
                          {agentData.memberSince?.split("-")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    {agentData.bio && (
                      <p className="mt-4 text-gray-600">{agentData.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Agent's Properties (Placeholder) */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-main-navy mb-4">
                  {t("agent_properties")}
                </h2>
                <div className="text-center py-8 text-gray-500">
                  {t("no_properties_yet")}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-main-navy mb-4">
                  {t("contact_agent")}
                </h3>

                {/* Action Buttons Component */}
                <AgentActionButtons agentId={id} agentName={agentData.name} />

                {/* Contact Info */}
                <div className="pt-4 border-t space-y-3">
                  <a
                    href={`tel:${agentData.mobile}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-main-green transition-colors"
                  >
                    <FiPhone className="text-main-green" />
                    <span>{agentData.mobile}</span>
                  </a>
                  <a
                    href={`https://wa.me/${agentData.mobile?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-main-green transition-colors"
                  >
                    <FiMessageSquare className="text-main-green" />
                    <span>{t("whatsapp")}</span>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AgentProfilePage;
