"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { motion } from "motion/react";
import {
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import { MdApartment, MdLandscape, MdEmail } from "react-icons/md";
import { BsBookmarkDash, BsBookmarkFill, BsShare } from "react-icons/bs";
import Image from "next/image";

// Mock data for a single request - replace with API
const mockRequest = {
  id: 1,
  title: "مطلوب فيلا للبيع",
  type: "villa",
  operationType: "sale",
  city: "الرياض",
  neighborhoods: ["المحمدية", "النخيل", "الرائد", "حطين", "الملقا"],
  minArea: 300,
  maxArea: 500,
  minPrice: 1500000,
  maxPrice: 2500000,
  priceType: "fixed" as const,
  isSerious: true,
  isSubscribersOnly: false,
  description:
    "أبحث عن فيلا للبيع في أحد الأحياء المذكورة. يفضل أن تكون الفيلا جديدة أو شبه جديدة مع مسبح خاص وحديقة. التشطيب لوكس أو سوبر لوكس.",
  requirements: [
    "مسبح خاص",
    "حديقة",
    "موقف سيارات لسيارتين",
    "غرفة خادمة",
    "غرفة سائق",
  ],
  createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  user: {
    id: 1,
    name: "Sultan A",
    avatar: undefined,
    type: "عقاري",
    phone: "+966 50 123 4567",
    email: "sultan@example.com",
    memberSince: "2024-01-01",
  },
};

const getPropertyIcon = (type: string) => {
  switch (type) {
    case "villa":
      return <FaHome className="size-8" />;
    case "apartment":
      return <MdApartment className="size-8" />;
    case "land":
      return <MdLandscape className="size-8" />;
    case "building":
      return <FaBuilding className="size-8" />;
    case "warehouse":
      return <FaWarehouse className="size-8" />;
    default:
      return <FaHome className="size-8" />;
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

const RequestDetailsPage = () => {
  const t = useTranslations("propertyRequestsPage");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const locale = useLocale();
  const params = useParams();
  const requestId = params.id;

  const [request, setRequest] = useState(mockRequest);
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // TODO: Fetch request details from API
    // fetchRequestDetails(requestId);
  }, [requestId]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: request.title,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <main className="container py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-main-light-gray p-4 pb-8 space-y-4 rounded-b-xl container"
      >
        <CustomBreadcrumbs
          items={[
            { label: tBreadcrumbs("requests"), href: "/requests" },
            { label: request.title },
          ]}
        />
      </motion.div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-2 space-y-6"
          >
            {/* Request header card */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-lg p-6 space-y-6"
            >
              {/* Tags and actions */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  {request.isSerious && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="bg-main-green/10 text-main-green text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-main-green rounded-full"></span>
                      {t("tags.serious_request")}
                    </motion.span>
                  )}
                  {request.isSubscribersOnly && (
                    <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                      {t("tags.subscribers_only")}
                    </span>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-main-green transition-colors"
                  >
                    <BsShare size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFavorite}
                    className={`p-2 transition-colors ${
                      isFavorited
                        ? "text-red-500"
                        : "text-gray-400 hover:text-main-green"
                    }`}
                  >
                    {isFavorited ? (
                      <BsBookmarkFill size={20} />
                    ) : (
                      <BsBookmarkDash size={20} />
                    )}
                  </motion.button>
                </motion.div>
              </div>

              {/* Title with icon */}
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="text-main-green"
                >
                  {getPropertyIcon(request.type)}
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {request.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 mt-1"
                  >
                    {request.city} - {request.neighborhoods?.join("، ")}
                  </motion.p>
                </div>
              </div>

              {/* Specs grid with stagger */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.5 },
                  },
                }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {/* Area range */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">{t("details.area")}</p>
                  <p className="font-bold text-lg text-gray-900">
                    {request.minArea} - {request.maxArea} {t("units.sqm")}
                  </p>
                </motion.div>
                {/* Price range */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">{t("details.price")}</p>
                  <p className="font-bold text-lg text-main-green">
                    {request.minPrice?.toLocaleString()} -{" "}
                    {request.maxPrice?.toLocaleString()} {t("units.sar")}
                  </p>
                </motion.div>
                {/* Type */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">{t("details.type")}</p>
                  <p className="font-bold text-lg text-gray-900">
                    {t(`types.${request.type}_${request.operationType}`)}
                  </p>
                </motion.div>
                {/* Operation */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">
                    {t("details.operation")}
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    {t(`operations.${request.operationType}`)}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {t("details.description")}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {request.description}
              </p>
            </motion.div>

            {/* Requirements */}
            {request.requirements && request.requirements.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {t("details.requirements")}
                </h2>
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
                    },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {request.requirements.map((req, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="w-2 h-2 bg-main-green rounded-full"
                      ></motion.span>
                      {req}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar - User info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-gray-900">
                {t("details.requester_info")}
              </h2>

              {/* User profile */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200"
                >
                  {request.user.avatar ? (
                    <Image
                      src={request.user.avatar}
                      alt={request.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                      {request.user.name.charAt(0)}
                    </div>
                  )}
                </motion.div>
                <div>
                  <p className="font-bold text-gray-900">{request.user.name}</p>
                  <p className="text-sm text-gray-500">{request.user.type}</p>
                </div>
              </motion.div>

              {/* Contact buttons with stagger */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.6 },
                  },
                }}
                className="space-y-3"
              >
                <motion.a
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${request.user.phone}`}
                  className="flex items-center justify-center gap-2 bg-main-green text-white py-3 px-4 rounded-lg hover:bg-main-green/90 transition-colors"
                >
                  <FaPhone />
                  {t("details.call")}
                </motion.a>
                <motion.a
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://wa.me/${request.user.phone?.replace(
                    /\s/g,
                    "",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp />
                  {t("details.whatsapp")}
                </motion.a>
                <motion.a
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`mailto:${request.user.email}`}
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MdEmail />
                  {t("details.email")}
                </motion.a>
              </motion.div>

              {/* Member since */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100"
              >
                {t("details.member_since")}:{" "}
                {new Date(request.user.memberSince).toLocaleDateString(locale)}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default RequestDetailsPage;
