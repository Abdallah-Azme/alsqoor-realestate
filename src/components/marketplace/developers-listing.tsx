"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import DeveloperProjectCard from "./developer-project-card";
import SmartPagination, {
  usePagination,
} from "@/components/shared/smart-pagination";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Mock data for development
const mockDeveloperProjects = [
  {
    id: "1",
    slug: "al-jadah-luxury-apartments",
    title: "الجادة الأولى شقق فاخرة بحي المحمدية",
    developerName: "مكين العقارية",
    developerLogo: "/images/logo.svg",
    startingPrice: 1660000,
    formattedStartingPrice: "1,660,000",
    location: "الرياض، المحمدية",
    city: "الرياض",
    image: "/images/state.png",
    brokerCommission: 1,
    timePosted: "منذ 8 أيام",
    isBrokerOpportunity: true,
    propertyType: "apartment",
    totalUnits: 45,
    availableUnits: 18,
  },
  {
    id: "2",
    slug: "tamr-residence-townhouse",
    title: "مشروع تمر ريزيدنس - تاون هاوس",
    developerName: "نجمة التمر للإستثمار والتطوير العقاري",
    developerLogo: "/images/logo.svg",
    startingPrice: 690000,
    formattedStartingPrice: "690,000",
    location: "الرياض، حراء",
    city: "الرياض",
    image: "/images/state.png",
    brokerCommission: 2.5,
    timePosted: "منذ 8 أيام",
    isBrokerOpportunity: true,
    propertyType: "villa",
    totalUnits: 25,
    availableUnits: 10,
  },
  {
    id: "3",
    slug: "seel-35-luxury-units",
    title: "مشروع سيل 35 وحدات فاخرة بحي النرجس",
    developerName: "عقار ماب",
    developerLogo: "/images/logo.svg",
    startingPrice: 2500000,
    formattedStartingPrice: "2,500,000",
    location: "الرياض، النرجس",
    city: "الرياض",
    image: "/images/state.png",
    brokerCommission: 1.5,
    timePosted: "منذ 8 أيام",
    isBrokerOpportunity: false,
    propertyType: "villa",
    totalUnits: 35,
    availableUnits: 22,
  },
  {
    id: "4",
    slug: "ajdal-jeddah-land",
    title: "أراضي مخطط أجدال جدة بحي التعاون",
    developerName: "أجدال",
    developerLogo: "/images/logo.svg",
    startingPrice: 450000,
    formattedStartingPrice: "450,000",
    location: "جدة، التعاون",
    city: "جدة",
    image: "/images/state.png",
    brokerCommission: 2,
    timePosted: "منذ 8 أيام",
    isBrokerOpportunity: true,
    propertyType: "land",
    totalUnits: 100,
    availableUnits: 65,
  },
];

const ITEMS_PER_PAGE = 6;

const DevelopersListing = () => {
  const t = useTranslations("marketplace.developer");
  const router = useRouter();
  const tTypes = useTranslations("advertisements.property_types");
  const [projects] = useState(mockDeveloperProjects);
  const [loading] = useState(false);
  const [activePropertyType, setActivePropertyType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesType =
      activePropertyType === "all" ||
      project.propertyType === activePropertyType;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.developerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Pagination
  const { totalPages, getPageItems } = usePagination(
    filteredProjects,
    ITEMS_PER_PAGE,
  );
  const currentProjects = getPageItems(currentPage);

  return (
    <div className="space-y-6">
      {/* Search and Property Type Filter */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-lg">
          <Input
            placeholder={t("search_placeholder")}
            className="ps-10 h-11 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute start-3 top-3.5 text-gray-400" />
        </div>

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
          <span className="font-bold text-main-navy">
            {filteredProjects.length}
          </span>{" "}
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
