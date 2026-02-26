"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MyPropertyCard from "./my-property-card";
import SmartPagination, {
  usePagination,
} from "@/components/shared/smart-pagination";
import { PropertyStatus } from "@/features/properties/types/property.types";
import StartMarketingDialog from "../dialogs/start-marketing-dialog";

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
    },
  ],
  deleted: [],
};

const ITEMS_PER_PAGE = 6;

interface BrokerPropertiesTabProps {
  onAddProperty?: () => void;
}

const BrokerPropertiesTab = ({ onAddProperty }: BrokerPropertiesTabProps) => {
  const t = useTranslations("Profile");
  const tBroker = useTranslations("broker_properties");
  const [activeStatus, setActiveStatus] = useState<PropertyStatus>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [marketingDialogOpen, setMarketingDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );

  // Get properties for active status
  const properties = mockPropertiesByStatus[activeStatus] || [];

  // Filter by search query
  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination
  const { totalPages, getPageItems } = usePagination(
    filteredProperties,
    ITEMS_PER_PAGE,
  );
  const currentProperties = getPageItems(currentPage);

  // Get counts for each status
  const statusCounts = {
    new: mockPropertiesByStatus.new.length,
    marketing: mockPropertiesByStatus.marketing.length,
    sold: mockPropertiesByStatus.sold.length,
    deleted: mockPropertiesByStatus.deleted.length,
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
      {/* Search and Add Action */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Input
            placeholder={t("search_ad_placeholder")}
            className="ps-10 h-11 bg-white border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute start-3 top-3.5 text-gray-400" />
        </div>

        {/* Add New Property Button */}
        <Button
          onClick={onAddProperty}
          className="w-full md:w-auto bg-white hover:bg-gray-50 text-main-green border border-main-green/30 h-11 gap-2"
        >
          <FiPlus />
          {t("add_new_ad")}
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
            {currentProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProperties.map((property) => (
                    <div key={property.id} className="h-full">
                      <MyPropertyCard property={property} />
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
              <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                {tBroker("no_properties")}
              </div>
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
