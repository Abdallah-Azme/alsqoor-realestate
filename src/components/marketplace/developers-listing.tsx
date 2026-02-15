"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import DeveloperProjectCard from "./developer-project-card";
import SmartPagination from "@/components/shared/smart-pagination";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { propertiesService } from "@/features/properties/services/properties.service";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 6;

const DevelopersListing = () => {
  const t = useTranslations("marketplace.developer");
  const router = useRouter();
  const tTypes = useTranslations("advertisements.property_types");
  const [activePropertyType, setActivePropertyType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["marketplace-developers", activePropertyType, currentPage],
    queryFn: () =>
      propertiesService.getMarketplaceProperties({
        type: "developer",
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
        property_type:
          activePropertyType !== "all" ? activePropertyType : undefined,
      }),
  });

  const properties = response?.data || [];
  const meta = response?.meta;
  const loading = isLoading;
  const totalPages = meta?.last_page || 1;

  // Map API data to component props
  const currentProjects = properties.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    developerName: p.developerName || "Developer", // fallback
    developerLogo: p.developerLogo,
    startingPrice: Number(p.startingPrice || 0),
    formattedStartingPrice: Number(p.startingPrice || 0).toLocaleString(),
    location: p.location || p.city || "",
    city: p.city || "",
    image: p.image || "",
    brokerCommission: p.brokerCommission || 0,
    timePosted:
      p.timePosted ||
      (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""),
    isBrokerOpportunity: p.isBrokerOpportunity || false,
    propertyType: p.propertyType || "",
    totalUnits: p.totalUnits || 0,
    availableUnits: p.availableUnits || 0,
  }));

  const propertyTypeTabs = [
    { id: "all", label: t("filter.all") },
    { id: "villa", label: tTypes("villa") },
    { id: "land", label: tTypes("residential_land") },
    { id: "apartment", label: tTypes("apartment") },
    { id: "floor", label: tTypes("floor") },
    { id: "building", label: tTypes("building") },
    { id: "shop", label: tTypes("shop") },
    { id: "rest_house", label: tTypes("rest_house") },
    { id: "farm", label: tTypes("farm") },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Property Type Filter */}
      <div className="space-y-4">
        {/* Property Type Tabs */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex items-center gap-2 pb-2">
            {propertyTypeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActivePropertyType(tab.id);
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activePropertyType === tab.id
                    ? "bg-main-navy text-white border-main-navy"
                    : "bg-white text-gray-600 border-gray-300 hover:border-main-green"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">{meta?.total || 0}</span>{" "}
          {t("project")}
        </p>

        <Button
          onClick={() => router.push("/advertisements/add")}
          className="bg-main-green hover:bg-main-green/90 text-white gap-2 h-9 px-4 text-sm"
        >
          <FiPlus />
          {t("add_property")}
        </Button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-80 animate-pulse"
            />
          ))}
        </div>
      ) : currentProjects.length > 0 ? (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentProjects.map((project, index) => (
              <DeveloperProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </motion.div>

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
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">{t("no_projects")}</p>
        </div>
      )}
    </div>
  );
};

export default DevelopersListing;
