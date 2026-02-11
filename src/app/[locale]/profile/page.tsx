import ProfileLayout from "@/features/profile/components/profile-layout";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("profile.title"),
    description: t("profile.description"),
  };
}

const ProfilePage = () => {
  return <ProfileLayout />;
};

export default ProfilePage;
