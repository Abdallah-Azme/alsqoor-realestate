"use client";

import PageHeader from "@/components/shared/page-header";
import { UserContext } from "@/context/user-context";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
import BrokerPropertiesTab from "@/features/profile/components/tabs/broker-properties-tab";
import OwnerPropertiesTab from "@/features/profile/components/tabs/owner-properties-tab";
import MyPropertiesTab from "@/features/profile/components/tabs/my-properties-tab";
import AddPropertyDialog from "@/features/profile/components/dialogs/add-property-dialog";
import { useRouter } from "@/i18n/navigation";

const AdsPage = () => {
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const isBroker =
    user?.role === "agent" ||
    user?.role === "broker" ||
    user?.role === "office" ||
    user?.role === "company";

  const isOwner = user?.role === "owner" || user?.role === "user";

  const handleAddAdvertisement = () => {
    router.push("/advertisements/add");
  };

  const handleAddProperty = (property?: any) => {
    setEditingProperty(property || null);
    setAddPropertyOpen(true);
  };

  const renderContent = () => {
    if (isBroker) {
      return <BrokerPropertiesTab onAddProperty={handleAddAdvertisement} />;
    }
    if (isOwner) {
      return (
        <OwnerPropertiesTab
          onAddProperty={() => handleAddProperty()}
          onEditProperty={(prop) => handleAddProperty(prop)}
        />
      );
    }
    return <MyPropertiesTab />;
  };

  return (
    <main className="space-y-8 pb-16">
      <PageHeader
        title={tBreadcrumbs("advertisements")}
        breadcrumbItems={[{ label: tBreadcrumbs("advertisements") }]}
      />

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container"
      >
        {renderContent()}
      </motion.section>

      <AddPropertyDialog
        open={addPropertyOpen}
        onOpenChange={(open) => {
          setAddPropertyOpen(open);
          if (!open) setEditingProperty(null);
        }}
        property={editingProperty}
      />
    </main>
  );
};

export default AdsPage;
