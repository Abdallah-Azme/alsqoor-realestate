"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import { Link, useRouter } from "@/i18n/navigation";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock, FiHome } from "react-icons/fi";
import { TbDimensions } from "react-icons/tb";
import StartMarketingDialog from "./start-marketing-dialog";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { toast } from "sonner";

interface BrokerPropertyCardProps {
  property: {
    id: string;
    slug?: string;
    title: string;
    price: number;
    formattedPrice: string;
    area: number;
    rooms?: number;
    location: string;
    city: string;
    image: string;
    commissionPercentage: number;
    timePosted: string;
    status: "new" | "marketing" | "under_marketing" | "half_deal" | "limited";
  };
  index?: number;
}

const BrokerPropertyCard = ({
  property,
  index = 0,
}: BrokerPropertyCardProps) => {
  const t = useTranslations("marketplace.broker");
  const tCommon = useTranslations("marketplace");
  const router = useRouter();
  const { data: user } = useProfile();
  const [showMarketingDialog, setShowMarketingDialog] = useState(false);

  const statusColors = {
    new: "bg-main-green",
    marketing: "bg-main-green",
    under_marketing: "bg-main-green",
    half_deal: "bg-blue-500",
    limited: "bg-red-500",
    deleted: "bg-gray-500",
  };

  const handleMarketingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isLogged =
      typeof window !== "undefined" && !!localStorage.getItem("token");

    if (!isLogged) {
      router.push("/auth/login");
      return;
    }

    setShowMarketingDialog(true);
  };

  const handleMarketingConfirm = () => {
    toast.success("تم بدء تسويق الإعلان بنجاح!");
  };

  return (
    <>
      <Link
        href={`/ads/brokers/${property.slug || property.id}`}
        className="block"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 space-y-5 border-2 border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
        >
          {/* Image Section */}
          <div className="h-52 rounded-xl relative overflow-hidden group shrink-0">
            <Image
              src={
                property.image && property.image.startsWith("http")
                  ? property.image
                  : "/images/state.png"
              }
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Status Badge */}
            <div
              className={`absolute top-3 start-3 ${
                statusColors[property.status] || "bg-main-green"
              } text-white text-xs px-3 py-1 rounded-full z-10`}
            >
              {t(`status.${property.status}`)}
            </div>
            {/* Area Badge at right top like state-card */}
            {property.area && (
              <div className="text-[.6rem] font-semibold flex items-center bg-white p-2 rounded-md absolute z-10 top-3 end-3 shadow-md">
                <TbDimensions className="mr-1 text-main-green" size={12} />
                {property.area}
                <sup className="ms-1">{tCommon("area_unit")}</sup>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-lg line-clamp-1">
                {property.title}
              </h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
                <HiOutlineLocationMarker className="text-main-green size-3" />
                {property.location}
              </p>

              {/* Price */}
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-main-green">
                  {property.formattedPrice}
                </span>
                <Image
                  src="/images/ryal.svg"
                  alt="SAR"
                  width={16}
                  height={16}
                  className="size-4"
                />
              </div>
            </div>

            <div className="space-y-3">
              {/* Commission Info */}
              <div className="bg-main-green/5 border border-main-green/20 rounded-md px-2 py-1.5 flex items-center justify-center text-xs text-main-green font-medium">
                💰{" "}
                {t("commission_info", {
                  percentage: property.commissionPercentage,
                })}
              </div>

              {/* Specs Grid */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <FiClock size={12} />
                  <span>{property.timePosted}</span>
                </div>
                {property.rooms && (
                  <div className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-1 rounded">
                    <FiHome className="text-main-green" size={12} />
                    <span>
                      {property.rooms} {t("rooms")}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleMarketingClick}
                className="w-full text-sm font-medium text-center rounded-md py-2 px-3 border border-main-green text-main-green hover:bg-main-green hover:text-white transition-all duration-300 mt-2"
              >
                {t("start_marketing")}
              </button>
            </div>
          </div>
        </motion.div>
      </Link>

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
    </>
  );
};

export default BrokerPropertyCard;
