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
        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Content Section */}
          <div className="flex-1">
            {/* Header with Tags */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                {/* Tags Row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {property.isUnread && (
                    <span className="bg-main-green/10 text-main-green text-xs px-2 py-0.5 rounded">
                      {t("unread")}
                    </span>
                  )}
                  {property.isSubscribersOnly && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                      {t("subscribers_only")}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900">
                  {property.title}
                </h3>

                {/* Location & Specs */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <TbDimensions className="text-main-green" size={14} />
                    <span>
                      {property.area} {tCommon("area_unit")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineLocationMarker
                      className="text-main-green"
                      size={14}
                    />
                    <span>{property.location}</span>
                  </div>
                </div>

                {/* Verified Badge */}
                {property.isVerified && (
                  <div className="flex items-center gap-1 text-main-green text-sm mt-2">
                    <FiCheckCircle size={14} />
                    <span>{t("verified")}</span>
                  </div>
                )}
              </div>

              {/* Time Posted */}
              <div className="flex items-center gap-1 text-gray-400 text-xs shrink-0">
                <FiClock size={12} />
                <span>{property.timePosted}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-main-navy">
                {property.formattedPrice}
              </span>
              <span className="text-gray-500 text-sm">
                {tCommon("currency")}
              </span>
            </div>

            {/* Offers Count */}
            {property.offersCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit mb-4">
                <BsEnvelope size={14} />
                <span>
                  {t("offers_count", { count: property.offersCount })}
                </span>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex flex-col gap-2 md:items-end md:justify-between shrink-0">
            {/* Submit Offer Button */}
            <button
              onClick={handleSubmitOffer}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:border-main-green hover:text-main-green text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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

            {/* Reject Button */}
            <button
              onClick={handleReject}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm transition-colors"
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
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{t("reject")}</span>
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
