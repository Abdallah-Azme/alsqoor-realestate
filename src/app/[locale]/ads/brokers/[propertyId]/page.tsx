"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import StartMarketingDialog from "@/components/marketplace/start-marketing-dialog";
import { HiOutlineLocationMarker, HiArrowLeft } from "react-icons/hi";
import { FiClock, FiMapPin, FiHome, FiShare2 } from "react-icons/fi";
import { TbDimensions } from "react-icons/tb";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { toast } from "sonner";
import PropertyChat from "@/components/estates/property-chat";

// Mock property data - In real implementation, fetch from API
const mockPropertyData = {
  id: "1",
  slug: "villa-for-sale-riyadh",
  title: "فيلا للبيع",
  description: `فيلا فاخرة للبيع في حي الرياض بجدة
  
مواصفات العقار:
- 9 غرف نوم واسعة
- 5 حمامات
- صالة استقبال كبيرة
- مطبخ مجهز بالكامل
- موقف سيارات خاص
- حديقة خارجية

الموقع:
تقع الفيلا في موقع استراتيجي قريب من جميع الخدمات والمرافق الحيوية.`,
  price: 1850000,
  formattedPrice: "1,850,000",
  area: 360,
  rooms: 9,
  bathrooms: 5,
  location: "حي الرياض",
  city: "جدة",
  country: "السعودية",
  mainImage: "/images/state.png",
  images: [
    "/images/state.png",
    "/images/state.png",
    "/images/state.png",
    "/images/state.png",
  ],
  commissionPercentage: 50,
  timePosted: "منذ 24 دقيقة",
  status: "new" as const,
  propertyType: "villa",
  operationType: "sale",
  coordinates: {
    lat: 21.5433,
    lng: 39.1728,
  },
  advertiser: {
    name: "محمد أحمد",
    phone: "+966500000000",
    image: "/images/logo.jpg",
    id: 4, // Added ID for chat system
  },
};

const BrokerPropertyDetailsPage = () => {
  const t = useTranslations("marketplace.broker");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const tProperty = useTranslations("property_details");
  const params = useParams();
  const [property, setProperty] = useState(mockPropertyData);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showMarketingDialog, setShowMarketingDialog] = useState(false);

  const handleMarketingConfirm = () => {
    toast.success("تم بدء تسويق العقار بنجاح!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} - ${property.formattedPrice} ريال`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط!");
    }
  };

  return (
    <main className="space-y-8 pb-4">
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
            src={property.images[activeImageIndex] || property.mainImage}
            alt={property.title}
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
                Math.min(property.images.length - 1, prev + 1),
              )
            }
            className="absolute end-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            disabled={activeImageIndex === property.images.length - 1}
          >
            <HiArrowLeft className="text-xl rotate-180 rtl:rotate-0" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 start-4 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
          >
            <FiShare2 size={20} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 start-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
            <FiHome size={14} />
            <span>
              {activeImageIndex + 1} / {property.images.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="container mt-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {/* Breadcrumbs */}
            <div className="shrink-0 me-4">
              <CustomBreadcrumbs
                items={[
                  {
                    label: tBreadcrumbs("advertisements"),
                    href: "/ads?tab=brokers",
                  },
                  { label: property.title },
                ]}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 ms-auto">
              {property.images.map((img, index) => (
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
            className="lg:col-span-2 space-y-6"
          >
            {/* Title & Price Section */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-main-navy mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1 text-gray-500">
                  <HiOutlineLocationMarker className="text-main-green" />
                  <span>
                    {property.location}، {property.city}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                  <FiClock size={12} />
                  <span>{property.timePosted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-main-green">
                    {property.formattedPrice}
                  </span>
                  <Image
                    src="/images/ryal.svg"
                    alt="SAR"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                </div>
              </div>
            </div>

            {/* Property Specs */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600">
                <TbDimensions className="text-main-green text-xl" />
                <div>
                  <p className="text-sm text-gray-400">المساحة</p>
                  <p className="font-semibold">{property.area} م²</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-600">
                <IoBedOutline className="text-main-green text-xl" />
                <div>
                  <p className="text-sm text-gray-400">الغرف</p>
                  <p className="font-semibold">{property.rooms}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-600">
                <LuBath className="text-main-green text-xl" />
                <div>
                  <p className="text-sm text-gray-400">الحمامات</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
            </div>

            {/* Commission Info */}
            <div className="bg-main-green/5 border border-main-green/20 rounded-xl p-4">
              <div className="flex items-center gap-3 text-main-green">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold">
                    {t("commission_info", {
                      percentage: property.commissionPercentage,
                    })}
                  </p>
                  <p className="text-sm text-main-green/80 mt-1">
                    ابدأ بتسويق العقار الآن واحصل على عمولتك عند إتمام الصفقة
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-main-navy">وصف العقار</h2>
              <div className="prose prose-gray max-w-none">
                {property.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-main-navy">الموقع</h2>
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FiMapPin className="text-4xl mx-auto mb-2 text-main-green" />
                  <p>خريطة الموقع</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Marketing CTA */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 sticky top-4">
              <button
                onClick={() => setShowMarketingDialog(true)}
                className="w-full bg-main-green hover:bg-main-green/90 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
              >
                {t("start_marketing")}
              </button>

              <p className="text-center text-sm text-gray-500">
                عند النقر ستبدأ بتسويق هذا العقار
              </p>
            </div>

            {/* Chat Section */}
            <PropertyChat
              propertyId={property.id}
              ownerId={property.advertiser.id}
              owner={{
                name: property.advertiser.name,
                location: `${property.city}، ${property.location}`,
                image: property.advertiser.image,
              }}
            />

            {/* Back Link */}
            <Link
              href="/ads?tab=brokers"
              className="flex items-center gap-2 text-main-green hover:underline"
            >
              <HiArrowLeft className="rtl:rotate-180" />
              العودة للعقارات
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Marketing Dialog */}
      <StartMarketingDialog
        open={showMarketingDialog}
        onOpenChange={setShowMarketingDialog}
        property={{
          id: property.id,
          title: property.title,
          commissionPercentage: property.commissionPercentage,
        }}
        onConfirm={handleMarketingConfirm}
      />
    </main>
  );
};

export default BrokerPropertyDetailsPage;
