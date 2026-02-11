"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock, FiHome } from "react-icons/fi";
import { TbDimensions } from "react-icons/tb";
import StartMarketingDialog from "./start-marketing-dialog";
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
    status: "new" | "marketing" | "half_deal" | "limited";
  };
  index?: number;
}

const BrokerPropertyCard = ({
  property,
  index = 0,
}: BrokerPropertyCardProps) => {
  const t = useTranslations("marketplace.broker");
  const tCommon = useTranslations("marketplace");
  const [showMarketingDialog, setShowMarketingDialog] = useState(false);

  const statusColors = {
    new: "bg-main-green",
    marketing: "bg-main-green",
    half_deal: "bg-blue-500",
    limited: "bg-red-500",
  };

  const handleMarketingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMarketingDialog(true);
  };

  const handleMarketingConfirm = () => {
    toast.success("تم بدء تسويق العقار بنجاح!");
  };

  return (
    <>
      <Link
        href={`/marketplace/brokers/${property.slug || property.id}`}
        className="block"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0">
              <Image
                src={property.image || "/images/state.png"}
                alt={property.title}
                fill
                className="object-cover"
              />
              {/* Status Badge */}
              <div
                className={`absolute top-3 start-3 ${
                  statusColors[property.status]
                } text-white text-xs px-3 py-1 rounded-full`}
              >
                {t(`status.${property.status}`)}
              </div>
              {/* Image count badge */}
              <div className="absolute bottom-3 start-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <FiHome size={12} />
                <span>30</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <HiOutlineLocationMarker className="text-main-green" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <FiClock size={12} />
                    <span>{property.timePosted}</span>
                  </div>
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
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <TbDimensions className="text-main-green" />
                  <span>
                    {property.area} {tCommon("area_unit")}
                  </span>
                </div>
                {property.rooms && (
                  <div className="flex items-center gap-1">
                    <FiHome className="text-main-green" />
                    <span>
                      {property.rooms} {t("rooms")}
                    </span>
                  </div>
                )}
              </div>

              {/* Commission Info */}
              <div className="bg-main-green/5 border border-main-green/20 rounded-lg px-3 py-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-main-green">
                  <span className="text-lg">💰</span>
                  <span>
                    {t("commission_info", {
                      percentage: property.commissionPercentage,
                    })}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto flex items-center gap-3">
                <button
                  onClick={handleMarketingClick}
                  className="flex-1 bg-main-green hover:bg-main-green/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {t("start_marketing")}
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
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
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
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
