import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import MyPropertiesTab from "./my-properties-tab"; // Fallback
import StatisticsTab from "./statistics-tab";
import FinancialsTab from "./financials-tab";
import PackagesTab from "./packages-tab";
import BrokerPropertiesTab from "./broker-properties-tab";
import OwnerPropertiesTab from "./owner-properties-tab";
import OffersTab from "./offers-tab";
import { User } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import AddPropertyDialog from "../dialogs/add-property-dialog";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ProfileTabs = ({
  isEditing,
  user,
}: {
  isEditing?: boolean;
  user: User | null;
}) => {
  const t = useTranslations("Profile");
  const router = useRouter();
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const tabFromUrl = searchParams.get("tab");

  useEffect(() => {
    if (action === "add-property") {
      setAddPropertyOpen(true);
    }
  }, [action]);

  const tabs = [
    { value: "financials", label: t("financials") },
    { value: "statistics", label: t("statistics") },
    { value: "my-properties", label: t("my_ads") },
    { value: "my-offers", label: t("my_offers") },
    // { value: "payment-methods", label: t("payment_methods") },
    { value: "packages", label: t("packages") },
  ];

  const handleAddAdvertisement = () => {
    router.push("/advertisements/add");
  };

  const handleAddProperty = (property?: any) => {
    setEditingProperty(property || null);
    setAddPropertyOpen(true);
  };

  const isBroker =
    user?.role === "agent" ||
    user?.role === "broker" ||
    user?.role === "office" ||
    user?.role === "company";
  const isOwner = user?.role === "owner" || user?.role === "user"; // Assuming 'user' might also act as owner for now, or just 'owner'

  return (
    <div className="min-h-[500px]">
      {/* Tabs component now auto-detects RTL via useDirection hook */}
      <Tabs defaultValue={tabFromUrl || "financials"} className="w-full">
        <div className="mb-6 overflow-visible">
          <TabsList className="bg-transparent gap-3 p-0 h-auto w-full flex flex-wrap justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-white border border-gray-200 text-gray-600 rounded-lg px-6 py-3 h-12 whitespace-nowrap
                data-[state=active]:bg-main-green/10 data-[state=active]:text-main-green data-[state=active]:border-main-green data-[state=active]:shadow-sm data-[state=active]:font-bold"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="p-0">
          <TabsContent value="financials" className="mt-0">
            <FinancialsTab />
          </TabsContent>

          <TabsContent value="statistics" className="mt-0">
            <StatisticsTab />
          </TabsContent>

          <TabsContent value="my-properties" className="mt-0">
            {isBroker ? (
              <BrokerPropertiesTab onAddProperty={handleAddAdvertisement} />
            ) : isOwner ? (
              <OwnerPropertiesTab
                onAddProperty={() => handleAddProperty()}
                onEditProperty={(prop) => handleAddProperty(prop)}
              />
            ) : (
              <MyPropertiesTab />
            )}
          </TabsContent>

          <TabsContent value="my-offers" className="mt-0">
            <OffersTab />
          </TabsContent>

          {/* <TabsContent value="payment-methods" className="mt-0">
            <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              {t("payment_methods")} - {t("no_properties")}
            </div>
          </TabsContent> */}

          <TabsContent value="packages" className="mt-0">
            <PackagesTab />
          </TabsContent>
        </div>
      </Tabs>

      <AddPropertyDialog
        open={addPropertyOpen}
        onOpenChange={(open) => {
          setAddPropertyOpen(open);
          if (!open) setEditingProperty(null);
        }}
        property={editingProperty}
      />
    </div>
  );
};

export default ProfileTabs;
