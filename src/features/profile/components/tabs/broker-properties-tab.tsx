"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MyPropertyCard from "./my-property-card";
import SmartPagination from "@/components/shared/smart-pagination";
import { PropertyStatus } from "@/features/properties/types/property.types";
import { useUserProperties } from "@/features/properties/hooks/use-properties";
import StartMarketingDialog from "../dialogs/start-marketing-dialog";
import EmptyState from "@/components/shared/empty-state";

// Status tab configuration
const STATUS_TABS: { value: PropertyStatus; colorClass: string }[] = [
  { value: "new", colorClass: "bg-blue-100 text-blue-700" },
  { value: "marketing", colorClass: "bg-green-100 text-green-700" },
  { value: "sold", colorClass: "bg-purple-100 text-purple-700" },
  { value: "deleted", colorClass: "bg-red-100 text-red-700" },
];

// Mock data - will be replaced with API calls
const mockPropertiesByStatus: Record<PropertyStatus, any[]> = {
  new: [
    {
      id: "1",
      title: "فيلا جديدة في جدة",
      price: 788000,
      formattedPrice: "788,000",
      area: 224,
      rooms: 5,
      bathrooms: 2,
      garages: 2,
      location: "جدة، السعودية",
      city: "جدة",
      image: "/images/state.png",
      timePosted: "منذ 4 أيام",
      isSerious: false,
      status: "new",
      slug: "villa-new-jeddah",
    },
    {
      id: "2",
      title: "شقة حديثة في الرياض",
      price: 450000,
      formattedPrice: "450,000",
      area: 150,
      rooms: 3,
      bathrooms: 2,
      garages: 1,
      location: "الرياض، السعودية",
      city: "الرياض",
      image: "/images/state.png",
      timePosted: "منذ يومين",
      isSerious: false,
      status: "new",
      slug: "modern-apartment-riyadh",
    },
  ],
  marketing: [
    {
      id: "3",
      title: "فيلا فاخرة في الدمام",
      price: 1200000,
      formattedPrice: "1,200,000",
      area: 400,
      rooms: 7,
      bathrooms: 4,
      garages: 3,
      location: "الدمام، السعودية",
      city: "الدمام",
      image: "/images/state.png",
      timePosted: "منذ أسبوع",
      isSerious: true,
      status: "marketing",
      slug: "luxury-villa-dammam",
    },
  ],
  sold: [
    {
      id: "4",
      title: "شقة تم بيعها",
      price: 320000,
      formattedPrice: "320,000",
      area: 120,
      rooms: 2,
      bathrooms: 1,
      garages: 1,
      location: "جدة، السعودية",
      city: "جدة",
      image: "/images/state.png",
      timePosted: "منذ شهر",
      isSerious: false,
      status: "sold",
      slug: "sold-apartment-jeddah",
    },
  ],
  deleted: [],
};

const ITEMS_PER_PAGE = 6;

interface BrokerPropertiesTabProps {
  onEditProperty?: (property: any) => void;
  onAddProperty?: () => void;
}

const BrokerPropertiesTab = ({
  onEditProperty,
  onAddProperty,
}: BrokerPropertiesTabProps) => {
  const t = useTranslations("Profile");
  const tBroker = useTranslations("broker_properties");
  const [activeStatus, setActiveStatus] = useState<PropertyStatus>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [marketingDialogOpen, setMarketingDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );

  const { data: propertiesData, isLoading } = useUserProperties({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
  });

  const properties =
    propertiesData?.data ||
    (Array.isArray(propertiesData) ? propertiesData : []);
  const meta = (propertiesData as any)?.meta;
  const totalPages = meta?.lastPage || 1;

  const statusCounts = {
    new: properties.length,
    marketing: properties.filter((p) => p.status === "marketing").length,
    sold: properties.filter((p) => p.status === "sold").length,
    deleted: properties.filter((p) => p.status === "deleted").length,
  };

  // Handle status tab change
  const handleStatusChange = (value: string) => {
    setActiveStatus(value as PropertyStatus);
    setCurrentPage(1);
  };

  // Handle start marketing click
  const handleStartMarketing = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setMarketingDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Add New Property Button */}
      <div className="flex justify-end items-center">
        <Button
          onClick={onAddProperty}
          className="w-full md:w-auto bg-main-green hover:bg-main-green/90 text-white h-11 px-6 rounded-lg transition-all font-bold flex items-center justify-center gap-2 shadow-sm shadow-main-green/20"
        >
          <FiPlus className="w-5 h-5" />
          <span>{t("add_new_ad")}</span>
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeStatus} onValueChange={handleStatusChange}>
        <TabsList className="bg-transparent gap-2 p-0 h-auto w-full flex flex-wrap justify-start">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="bg-white border border-gray-200 text-gray-600 rounded-lg px-4 py-2.5 h-auto whitespace-nowrap gap-2
                data-[state=active]:bg-main-green/10 data-[state=active]:text-main-green data-[state=active]:border-main-green data-[state=active]:shadow-sm data-[state=active]:font-bold"
            >
              {tBroker(`status.${tab.value}`)}
              <Badge
                variant="secondary"
                className={`${tab.colorClass} text-xs px-2 py-0.5 rounded-full`}
              >
                {statusCounts[tab.value]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Properties Grid for each status */}
        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="h-full">
                      <MyPropertyCard
                        property={property}
                        onEdit={() => onEditProperty?.(property)}
                        viewHref={`/ads/${property.slug}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <SmartPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-8"
                  />
                )}
              </>
            ) : (
              <EmptyState
                title={tBroker("no_properties")}
                description={
                  t("no_properties_description") ||
                  "بادر بإضافة إعلانك الأول الآن بكل سهولة من خلال الضغط على الزر أدناه."
                }
                buttonText={t("add_new_ad")}
                onAction={onAddProperty}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Start Marketing Dialog */}
      <StartMarketingDialog
        open={marketingDialogOpen}
        onOpenChange={setMarketingDialogOpen}
        propertyId={selectedPropertyId}
      />
    </div>
  );
};

export default BrokerPropertiesTab;
