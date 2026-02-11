import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import PropertiesCarousel from "@/components/shared/properties-carousel";
import { featuredUsersService } from "@/features/featured-users";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, Phone, Star, User, Calendar } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const user = await featuredUsersService.getById(id);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: user?.name
      ? `${user.name} | ${t("partners.title")}`
      : t("partners.title"),
    description: t("partners.description"),
    openGraph: {
      images: user?.avatarUrl ? [user.avatarUrl] : [],
    },
  };
}

const SinglePartner = async ({ params }) => {
  // Await params for Next.js 15+ calls if needed, though simpler here
  const { id } = await params;
  const t = await getTranslations("breadcrumbs");

  // Fetch featured user details
  const user = await featuredUsersService.getById(id);

  if (!user) {
    notFound();
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <main className="space-y-12 min-h-screen pb-12 container mx-auto px-4">
      {/* Header */}
      <div className="bg-white p-4 pb-8 shadow-sm">
        <div className="space-y-4">
          <CustomBreadcrumbs
            items={[
              { label: t("partners"), href: "/partners" },
              { label: user.name },
            ]}
          />
          <h1 className="text-main-navy text-3xl font-bold">{user.name}</h1>
        </div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Avatar Card - Takes less width */}
        <div className="lg:col-span-4 order-1">
          <div className="bg-gradient-to-br from-main-green to-emerald-500 rounded-xl p-8 flex items-center justify-center aspect-square shadow-lg sticky top-24">
            <div className="relative w-40 h-40">
              <Image
                src={user.avatarUrl || "/placeholder-avatar.png"}
                alt={user.name}
                fill
                className="object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content (Info) - Takes more width */}
        <div className="lg:col-span-8 order-2 space-y-8">
          {/* User Name & Role */}
          <div className="text-right space-y-2">
            <h2 className="text-3xl font-bold text-main-navy">{user.name}</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-main-green/10 rounded-full">
              <User className="w-4 h-4 text-main-green" />
              <p className="text-main-green text-lg font-medium capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-main-navy mb-4">
              {t("contact_info") || "Contact Information"}
            </h3>

            {/* Email */}
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-lg bg-main-green/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-main-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("email") || "Email"}</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-lg bg-main-green/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-main-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("phone") || "Phone"}</p>
                <p className="text-sm font-medium">{user.mobile}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-lg bg-main-green/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-main-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {t("member_since") || "Member Since"}
                </p>
                <p className="text-sm font-medium">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Points Card */}
          {user.pointsBalance > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">
                    {user.pointsBalance}
                  </p>
                  <p className="text-sm text-amber-600">
                    {t("points_balance") || "Points Balance"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Properties Section */}
          {user.properties && user.properties.length > 0 && (
            <>
              <div className="pt-8">
                <div className="inline-block px-6 py-2 bg-[#F5FBF9] text-main-green font-bold rounded-lg text-sm">
                  {user.name} {t("properties") || "Properties"}
                </div>
              </div>
              <PropertiesCarousel properties={user.properties} />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default SinglePartner;
