import { getTranslations } from "next-intl/server";
import AddAdvertisementWizard from "@/features/advertisements/components/add-advertisement/add-advertisement-wizard";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("advertisements.add.title"),
    description: t("advertisements.add.description"),
  };
}

const AddAdvertisementPage = () => {
  return <AddAdvertisementWizard />;
};

export default AddAdvertisementPage;
