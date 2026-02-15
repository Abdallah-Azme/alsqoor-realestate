"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FiMapPin,
  FiHome,
  FiSquare,
  FiDollarSign,
  FiPhone,
  FiMessageSquare,
  FiCheckCircle,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import Image from "next/image";
import type {
  CreateAdvertisementData,
  ContactMethod,
} from "../../types/advertisement.types";

interface StepPreviewProps {
  values: Partial<CreateAdvertisementData>;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const StepPreview = ({
  values,
  onSubmit,
  onBack,
  isSubmitting = false,
}: StepPreviewProps) => {
  const t = useTranslations("advertisements.wizard.preview");
  const tTypes = useTranslations("advertisements.property_types");
  const tAmenities = useTranslations("advertisements.amenities");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const images = values.images || [];
  const videos = values.videos || [];
  const contactMethods = values.contactMethods || [];

  const formatPrice = (price?: string) => {
    if (!price) return "-";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "-";
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const hasContactMethod = (method: ContactMethod) => {
    return contactMethods.includes(method);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="py-6 px-4 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-main-green/10 rounded-full flex items-center justify-center">
          <FiCheckCircle className="w-8 h-8 text-main-green" />
        </div>
        <h2 className="text-xl font-bold text-main-navy mb-2">{t("title")}</h2>
        <p className="text-gray-500 text-sm">{t("description")}</p>
      </div>

      {/* Preview Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Image */}
        {images.length > 0 && (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={URL.createObjectURL(images[0])}
              alt="Property"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 end-2 flex gap-2">
              {images.length > 0 && (
                <Badge className="bg-black/50 text-white">
                  <FiImage className="w-3 h-3 me-1" />
                  {images.length}
                </Badge>
              )}
              {videos.length > 0 && (
                <Badge className="bg-black/50 text-white">
                  <FiVideo className="w-3 h-3 me-1" />
                  {videos.length}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Property Type & Ad Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-main-green/10 text-main-green">
              {values.propertyType ? tTypes(values.propertyType) : "-"}
            </Badge>
            <Badge className="bg-gray-100 text-gray-700">
              {values.adType === "sale" ? t("sale") : t("rent")}
            </Badge>
            {values.housingType && (
              <Badge className="bg-gray-100 text-gray-600">
                {values.housingType === "families" ? t("family") : t("singles")}
              </Badge>
            )}
          </div>

          {/* Description */}
          {values.description && (
            <p className="text-gray-700 text-sm line-clamp-2">
              {values.description}
            </p>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Area */}
            <div className="flex items-center gap-2 text-gray-600">
              <FiSquare className="text-main-green" />
              <span className="text-sm">
                {values.area ? `${values.area} ${tCommon("sqm")}` : "-"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 text-gray-600">
              <FiDollarSign className="text-main-green" />
              <span className="text-sm font-medium">
                {formatPrice(values.totalPrice)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 col-span-2">
              <FiMapPin className="text-main-green" />
              <span className="text-sm">
                {values.city && values.neighborhood
                  ? `${values.city} - ${values.neighborhood}`
                  : "-"}
              </span>
            </div>
          </div>

          {/* Amenities */}
          {values.amenities && values.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {values.amenities.slice(0, 4).map((amenity) => (
                <Badge
                  key={amenity}
                  className="bg-gray-100 text-gray-600 text-xs"
                >
                  {tAmenities(amenity)}
                </Badge>
              ))}
              {values.amenities.length > 4 && (
                <Badge className="bg-gray-100 text-gray-600 text-xs">
                  +{values.amenities.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Contact Methods */}
          <div className="pt-3 border-t">
            <p className="text-sm text-gray-500 mb-2">{t("contact_methods")}</p>
            <div className="flex gap-3">
              {hasContactMethod("phone") && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FiPhone className="text-main-green" />
                  <span>{t("phone")}</span>
                </div>
              )}
              {hasContactMethod("whatsapp") && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FiMessageSquare className="text-main-green" />
                  <span>{t("whatsapp")}</span>
                </div>
              )}
              {hasContactMethod("chat") && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FiMessageSquare className="text-main-green" />
                  <span>{t("chat")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advertiser Info */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-3">
          {t("advertiser_info")}
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-main-green/10 flex items-center justify-center">
            <FiHome className="text-main-green" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{t("your_name")}</p>
            <p className="text-sm text-gray-500">
              {values.hasLicense ? t("licensed") : t("pending_license")}
            </p>
          </div>
        </div>
      </div>

      {/* Terms Notice */}
      <div className="bg-main-light-green border border-main-green p-4 rounded-xl text-sm text-main-navy">
        {t("terms_notice")}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-6"
        >
          {t("back")}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-main-green hover:bg-main-green/90 text-white font-semibold py-6"
        >
          {isSubmitting ? t("publishing") : t("publish")}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepPreview;
