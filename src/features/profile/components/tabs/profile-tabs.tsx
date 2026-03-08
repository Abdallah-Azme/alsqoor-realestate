import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import MyPropertiesTab from "./my-properties-tab"; // Fallback
import StatisticsTab from "./statistics-tab";
import FinancialsTab from "./financials-tab";
import PackagesTab from "./packages-tab";
import BrokerPropertiesTab from "./broker-properties-tab";
import OwnerPropertiesTab from "./owner-properties-tab";
import OffersTab from "./offers-tab";
import RealEstateTab from "./real-estate-tab";
import MyRequestsTab from "./my-requests-tab";
import { MySiteOffersList } from "@/features/offers/property-offers-index";
import { DirectDealsList } from "@/features/direct-deals";
import { User } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import AddAdvertisementDialog from "../dialogs/add-advertisement-dialog";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAdLimit } from "@/hooks/use-ad-limit";

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
    { value: "real-estate", label: "عقارات" },
    { value: "my-properties", label: t("my_ads") },
    { value: "my-requests", label: t("my_requests") || "طلباتي" },
    { value: "site-offers", label: t("my_offers") || "عروضي" },
    // {
    //   value: "my-offers",
    //   label: t("my_offers_legacy") || "عروض العقارات",
    // },
    { value: "direct-deals", label: t("direct_deals") || "الصفقات المباشرة" },
    // { value: "payment-methods", label: t("payment_methods") },
    { value: "packages", label: t("packages") },
  ];

  const { checkCanAddAd } = useAdLimit();

  const handleAddProperty = (property?: any) => {
    // Editing existing — skip limit check
    if (property) {
      setEditingProperty(property);
      setAddPropertyOpen(true);
      return;
    }
    if (!checkCanAddAd()) return;
    setEditingProperty(null);
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

          <TabsContent value="real-estate" className="mt-0">
            <RealEstateTab />
          </TabsContent>

          <TabsContent value="my-properties" className="mt-0">
            {isBroker ? (
              <BrokerPropertiesTab
                onAddProperty={() => handleAddProperty()}
                onEditProperty={(prop) => handleAddProperty(prop)}
              />
            ) : isOwner ? (
              <OwnerPropertiesTab
                onAddProperty={() => handleAddProperty()}
                onEditProperty={(prop) => handleAddProperty(prop)}
              />
            ) : (
              <MyPropertiesTab
                onAddProperty={() => handleAddProperty()}
                onEditProperty={(prop) => handleAddProperty(prop)}
              />
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="mt-0">
            <MyRequestsTab />
          </TabsContent>

          <TabsContent value="site-offers" className="mt-0">
            <MySiteOffersList />
          </TabsContent>

          {/* <TabsContent value="my-offers" className="mt-0">
            <OffersTab />
          </TabsContent> */}

          <TabsContent value="direct-deals" className="mt-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <DirectDealsList />
            </div>
          </TabsContent>

          <TabsContent value="packages" className="mt-0">
            <PackagesTab />
          </TabsContent>
        </div>
      </Tabs>

      <AddAdvertisementDialog
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
