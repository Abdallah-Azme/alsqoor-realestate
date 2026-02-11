"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import ProjectUnitsList from "@/components/marketplace/project-units-list";
import { HiOutlineLocationMarker, HiArrowLeft } from "react-icons/hi";
import { FiMapPin, FiInfo } from "react-icons/fi";

// Mock project data
const mockProjectData = {
  id: "1",
  slug: "al-jadah-luxury-apartments",
  title: "الجادة الأولى شقق فاخرة بحي المحمدية",
  developerName: "مكين العقارية",
  developerLogo: "/images/logo.svg",
  startingPrice: 1660000,
  formattedStartingPrice: "1,660,000",
  location: "الرياض، المحمدية",
  city: "الرياض",
  mainImage: "/images/state.png",
  images: [
    "/images/state.png",
    "/images/state.png",
    "/images/state.png",
    "/images/state.png",
  ],
  brokerCommission: 1,
  description: `الجادة الأولى – شقق فاخرة بحي المحمدية
أسلوب حياة راقي في قلب الرياض

مشروع سكني فاخر يجمع بين التصميم العصري والراحة الذكية ضمن بيئة متكاملة تمنحك تجربة معيشية استثنائية.

تفاصيل المشروع:
يتألف المشروع من 52 وحدة سكنية بتصاميم أنيقة ومساحات متنوعة تناسب العائلات، مع واجهات حديثة وإطلالات طبيعية توفر الخصوصية والأناقة.

موقع استراتيجي مميز:
يقع في حي المحمدية بالرياض بالقرب من الطرق الحيوية مثل طريق الملك سلمان، طريق الملك فهد، وطريق التخصصي، وعلى بعد دقائق من ذا زون، محطة المترو، مستشفى داله، ومستشفى الحبيب، ليجمع بين الهدوء والقرب من جميع الخدمات.`,
  coordinates: {
    lat: 24.7136,
    lng: 46.6753,
  },
  units: [
    {
      id: "u1",
      code: "A-103",
      image: "/images/state.png",
      availability: 1,
      area: 203,
      rooms: 3,
      bathrooms: 3,
      price: 2303000,
      formattedPrice: "2,303,000",
    },
    {
      id: "u2",
      code: "A-304",
      image: "/images/state.png",
      availability: 1,
      area: 255,
      rooms: 3,
      bathrooms: 3,
      price: 2187000,
      formattedPrice: "2,187,000",
    },
    {
      id: "u3",
      code: "C-204",
      image: "/images/state.png",
      availability: 1,
      area: 178,
      rooms: 3,
      bathrooms: 3,
      price: 2151000,
      formattedPrice: "2,151,000",
    },
    {
      id: "u4",
      code: "C-301",
      image: "/images/state.png",
      availability: 1,
      area: 206,
      rooms: 2,
      bathrooms: 3,
      price: 1986000,
      formattedPrice: "1,986,000",
    },
  ],
};

const ProjectDetailsPage = () => {
  const t = useTranslations("marketplace.developer");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const params = useParams();
  const [project, setProject] = useState(mockProjectData);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // In real implementation, fetch project data based on params.projectId
  // useEffect(() => {
  //   fetchProject(params.projectId);
  // }, [params.projectId]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-8 pb-12">
      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Main Image */}
        <div className="relative h-[400px] md:h-[500px] w-full">
          <Image
            src={project.images[activeImageIndex] || project.mainImage}
            alt={project.title}
            fill
            className="object-cover"
          />
          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveImageIndex((prev) => Math.max(0, prev - 1))}
            className="absolute start-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            disabled={activeImageIndex === 0}
          >
            <HiArrowLeft className="text-xl rtl:rotate-180" />
          </button>
          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                Math.min(project.images.length - 1, prev + 1),
              )
            }
            className="absolute end-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            disabled={activeImageIndex === project.images.length - 1}
          >
            <HiArrowLeft className="text-xl rotate-180 rtl:rotate-0" />
          </button>
          {/* Share Button */}
          <button className="absolute top-4 start-4 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="container mt-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {/* Breadcrumbs */}
            <div className="shrink-0 me-4">
              <CustomBreadcrumbs
                items={[
                  {
                    label: tBreadcrumbs("marketplace"),
                    href: "/marketplace?tab=developers",
                  },
                  { label: project.title },
                ]}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 ms-auto">
              {project.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImageIndex === index
                      ? "border-main-green"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title Section */}
            <div className="flex items-start gap-4">
              {/* Developer Logo */}
              {project.developerLogo && (
                <div className="shrink-0 bg-gray-100 rounded-lg p-3">
                  <Image
                    src={project.developerLogo}
                    alt={project.developerName}
                    width={60}
                    height={40}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-main-navy mb-1">
                  {project.title}
                </h1>
                <p className="text-gray-500">{project.developerName}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("starting_from")}</span>
              <span className="text-2xl font-bold text-main-green">
                {project.formattedStartingPrice}
              </span>
              <Image
                src="/images/ryal.svg"
                alt="SAR"
                width={20}
                height={20}
                className="size-5"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <HiOutlineLocationMarker className="text-main-green text-xl" />
              <span>{project.location}</span>
            </div>

            {/* About Project */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-main-navy flex items-center gap-2">
                <FiInfo className="text-main-green" />
                {t("about_project")}
              </h2>
              <div className="prose prose-gray max-w-none">
                {project.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-600">
                  انظر الموقع على الخريطة
                </h2>
                <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                  <FiMapPin className="text-main-green" />
                  الموقع على الخريطة
                </button>
              </div>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FiMapPin className="text-4xl mx-auto mb-2 text-main-green" />
                  <p>خريطة الموقع</p>
                </div>
              </div>
            </div>

            {/* Available Units */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-main-navy flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-main-green"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {t("available_units")}
              </h2>
              <ProjectUnitsList units={project.units} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Broker Commission Card */}
            {project.brokerCommission > 0 && (
              <div className="bg-main-green/5 border border-main-green/20 rounded-xl p-4">
                <div className="flex items-center gap-3 text-main-green">
                  <span className="text-2xl">💰</span>
                  <p className="text-sm">
                    {t("broker_commission", {
                      percentage: project.brokerCommission,
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Back Link */}
            <Link
              href="/marketplace?tab=developers"
              className="flex items-center gap-2 text-main-green hover:underline"
            >
              <HiArrowLeft className="rtl:rotate-180" />
              {t("back_to_projects")}
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetailsPage;
