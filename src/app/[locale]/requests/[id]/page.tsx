"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { requestsService } from "@/features/requests/services/requests.service";
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
    case "buy":
    case "sale":
      return <FaHome className="size-8" />;
    case "rent":
      return <FaBuilding className="size-8" />;
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

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestId) return;

      try {
        setLoading(true);
        const response = await requestsService.getById(Number(requestId));
        // The API might return { success: true, data: { ... } } or just the data
        // Based on service it returns api.get<PropertyRequest> which usually returns the data directly or wrapped depending on axios interceptors
        // In this project, it seems it returns the data directly if it uses a common pattern
        setRequest(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("Failed to load request details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
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

  if (error || !request) {
    return (
      <main className="container py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">
          {error || t("messages.error_fetch")}
        </h1>
        <Link href="/requests" className="text-main-green hover:underline">
          {tBreadcrumbs("requests")}
        </Link>
      </main>
    );
  }

  const title = `${request.requestTypeLabel} - ${request.requestNumber}`;

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
            { label: title },
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
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1 ${
                      request.status === "accepted"
                        ? "bg-main-green/10 text-main-green"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        request.status === "accepted"
                          ? "bg-main-green"
                          : "bg-orange-500"
                      }`}
                    ></span>
                    {request.statusLabel}
                  </motion.span>
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
                  {getPropertyIcon(request.requestType)}
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 mt-1"
                  >
                    {request.city?.name} - {request.district}
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Area */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">{t("fields.area")}</p>
                  <p className="font-bold text-lg text-gray-900">
                    {request.area} {t("units.sqm")}
                  </p>
                </motion.div>
                {/* Property Age */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">
                    {t("fields.property_age")}
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    {request.propertyAge} {t("time.years") || "سنة"}
                  </p>
                </motion.div>
                {/* Budget */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">
                    {t("fields.budget_amount")}
                  </p>
                  <p className="font-bold text-lg text-main-green">
                    {request.budgetType === "market_price"
                      ? request.budgetTypeLabel
                      : `${Number(request.budgetAmount).toLocaleString()} ${t(
                          "units.sar",
                        )}`}
                  </p>
                </motion.div>
                {/* Payment method */}
                <motion.div
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-gray-500 text-sm">
                    {t("fields.payment_method")}
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    {request.paymentMethodLabel}
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
              <p className="text-gray-600 leading-relaxed">{request.details}</p>
            </motion.div>

            {/* Offer/Requirements */}
            {request.offer && (
              <motion.div
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {t("fields.offer")}
                </h2>
                <div className="text-gray-600 leading-relaxed">
                  {request.offer}
                </div>
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
                  className="relative w-16 h-16 rounded-full overflow-hidden bg-main-green/10 flex items-center justify-center text-main-green text-2xl font-bold border border-main-green/20"
                >
                  {request.user.name.charAt(0)}
                </motion.div>
                <div>
                  <p className="font-bold text-gray-900">{request.user.name}</p>
                  <p className="text-sm text-gray-500">{request.user.email}</p>
                </div>
              </motion.div>

              {/* Contact buttons */}
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
                {request.whatsapp && (
                  <motion.a
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${request.whatsapp.replace(
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
                )}
                <motion.a
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`mailto:${request.user.email}`}
                  className="flex items-center justify-center gap-2 bg-main-green text-white py-3 px-4 rounded-lg hover:bg-main-green/90 transition-colors"
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
                {new Date(request.createdAt).toLocaleDateString(locale)}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default RequestDetailsPage;
