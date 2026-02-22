"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock, FiCheckCircle } from "react-icons/fi";
import { TbDimensions } from "react-icons/tb";
import { BsEnvelope } from "react-icons/bs";
import SubscriptionDialog from "./subscription-dialog";

interface OwnerPropertyCardProps {
  property: {
    id: string;
    title: string;
    propertyType: string;
    operationType: "sale" | "rent";
    price: number;
    formattedPrice: string;
    area: number;
    image?: string;
    location: string;
    city: string;
    timePosted: string;
    offersCount: number;
    isVerified: boolean;
    isSubscribersOnly: boolean;
    isUnread: boolean;
  };
  index?: number;
  isSubscribed?: boolean;
}

const OwnerPropertyCard = ({
  property,
  index = 0,
  isSubscribed = false,
}: OwnerPropertyCardProps) => {
  const t = useTranslations("marketplace.owner");
  const tCommon = useTranslations("marketplace");
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

  const handleCardClick = () => {
    if (property.isSubscribersOnly && !isSubscribed) {
      setShowSubscriptionDialog(true);
    }
  };

  const handleSubmitOffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.isSubscribersOnly && !isSubscribed) {
      setShowSubscriptionDialog(true);
    } else {
      // Handle submit offer logic
      console.log("Submit offer for property:", property.id);
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle reject logic
    console.log("Reject property:", property.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-white rounded-lg p-4 space-y-5 border-2 border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="h-52 rounded-xl relative overflow-hidden group shrink-0">
          <img
            src={
              property.image && property.image.startsWith("http")
                ? property.image
                : "/images/state.png"
            }
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Tags Top Left */}
          <div className="absolute top-3 start-3 flex flex-col gap-1 z-10">
            {property.isUnread && (
              <div className="bg-main-green text-white text-[0.65rem] px-2 py-1 rounded-full shadow-md font-medium w-fit">
                {t("unread")}
              </div>
            )}
            {property.isSubscribersOnly && (
              <div className="bg-red-500 text-white text-[0.65rem] px-2 py-1 rounded-full shadow-md font-medium w-fit">
                {t("subscribers_only")}
              </div>
            )}
            {property.isVerified && (
              <div className="bg-blue-500 text-white text-[0.65rem] px-2 py-1 rounded-full shadow-md font-medium w-fit flex items-center gap-1">
                <FiCheckCircle size={10} />
                {t("verified")}
              </div>
            )}
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
            <h4 className="font-bold text-lg line-clamp-1">{property.title}</h4>

            <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
              <HiOutlineLocationMarker className="text-main-green size-3" />
              {property.location}
            </p>

            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-main-green">
                {property.formattedPrice}
              </span>
              <img src="/images/ryal.svg" alt="SAR" className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            {/* Offers Count */}
            {property.offersCount > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-md px-2 py-1.5 flex items-center justify-center text-xs text-blue-600 font-medium">
                <BsEnvelope size={12} className="me-1" />
                {t("offers_count", { count: property.offersCount })}
              </div>
            )}

            {/* Specs Grid (Time) */}
            <div className="flex items-center justify-between text-[0.65rem] text-gray-400 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <FiClock size={10} />
                <span>{property.timePosted}</span>
              </div>

              <button
                onClick={handleReject}
                className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 font-medium bg-red-50 px-2 py-1 rounded"
              >
                {t("reject")}
              </button>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSubmitOffer}
              className="w-full text-sm font-medium text-center rounded-md py-2 px-3 border border-main-green text-main-green hover:bg-main-green hover:text-white transition-all duration-300 mt-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{t("submit_offer")}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Subscription Dialog */}
      <SubscriptionDialog
        open={showSubscriptionDialog}
        onOpenChange={setShowSubscriptionDialog}
        onSubscribe={() => {
          // Navigate to subscription page or handle subscription
          window.location.href = "/packages";
        }}
      />
    </>
  );
};

export default OwnerPropertyCard;
