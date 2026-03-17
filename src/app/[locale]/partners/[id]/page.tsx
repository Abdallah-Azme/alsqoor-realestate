import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { featuredUsersService } from "@/features/featured-users";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, Phone, Star, User, Calendar, ShieldOff } from "lucide-react";
import { UserDataTabs } from "@/features/partners";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  try {
    const user = await featuredUsersService.getById(id);
    return {
      title: user?.name
        ? `${user.name} | ${t("partners.title")}`
        : t("partners.title"),
      description: t("partners.description"),
      openGraph: {
        images: user?.avatarUrl ? [user.avatarUrl] : [],
      },
    };
  } catch {
    return {
      title: t("partners.title"),
      description: t("partners.description"),
    };
  }
}

const SinglePartner = async ({ params }) => {
  // Await params for Next.js 15+ calls if needed, though simpler here
  const { id } = await params;
  const t = await getTranslations("breadcrumbs");

  // Fetch featured user details — may throw if partner is not subscribed
  let user: Awaited<ReturnType<typeof featuredUsersService.getById>> | null = null;
  let notSubscribed = false;

  try {
    user = await featuredUsersService.getById(id);
    if (!user) notFound();
  } catch {
    // API returned success: false (e.g. partner not found / not subscribed)
    notSubscribed = true;
  }

  if (notSubscribed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-6 py-20">
          <div className="w-24 h-24 rounded-full bg-main-green/10 flex items-center justify-center mx-auto">
            <ShieldOff className="w-12 h-12 text-main-green" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-main-navy">
              هذا المطور لم يشترك في هذه الميزة بعد
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              صفحة الملف الشخصي المميز غير متاحة لهذا المطور حالياً.
            </p>
          </div>
          <a
            href="/ar/partners"
            className="inline-flex items-center gap-2 px-6 py-3 bg-main-green text-white rounded-xl font-semibold hover:bg-main-green/90 transition-colors"
          >
            العودة إلى قائمة الشركاء
          </a>
        </div>
      </main>
    );
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
    <main className="space-y-12 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8 space-y-4">
          <CustomBreadcrumbs
            items={[
              { label: t("partners"), href: "/partners" },
              { label: user.name },
            ]}
          />
          <h1 className="text-main-navy text-3xl font-bold">{user.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
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
          </div>
        </div>

        {/* User Data Tabs (Marketed Properties, Regular Properties, Requests) */}
        <UserDataTabs userId={user.id} />
      </div>
    </main>
  );
};

export default SinglePartner;
