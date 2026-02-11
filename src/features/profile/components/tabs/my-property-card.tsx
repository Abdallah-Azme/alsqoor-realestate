"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock, FiHome } from "react-icons/fi";
import { TbDimensions, TbBath } from "react-icons/tb";
import { FaCar } from "react-icons/fa";
import { Link } from "@/i18n/navigation";

interface MyPropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    formattedPrice: string;
    area: number;
    rooms: number;
    bathrooms: number;
    garages: number;
    location: string;
    city: string;
    image: string;
    timePosted: string;
    isSerious: boolean;
  };
}

const MyPropertyCard = ({ property }: MyPropertyCardProps) => {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("marketplace");

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={property.image || "/images/state.png"}
          alt={property.title}
          fill
          className="object-cover"
        />
        {/* Serious Request Badge */}
        {property.isSerious && (
          <div className="absolute bottom-3 end-3 bg-main-navy text-white text-xs px-3 py-1 rounded-md font-medium">
            {t("serious_request")}
          </div>
        )}

        {/* Area Badge/Overlay - matching design mockup style if needed, 
            but for now just keeping it clean or adding specific badges as seen 
        */}
        <div className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-main-navy dir-ltr">
          {property.area}m²
        </div>

        <div className="absolute top-3 end-3 text-white drop-shadow-md cursor-pointer">
          {/* Bookmark icon placeholder if needed */}
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
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price & Time */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-main-green font-bold text-lg">
            <span>{property.formattedPrice}</span>
            <Image
              src="/images/ryal.svg"
              alt="SAR"
              width={14}
              height={14}
              className="w-3.5 h-3.5"
            />
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <FiClock size={12} />
            <span>{property.timePosted}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <HiOutlineLocationMarker className="text-main-green" />
          <span>
            {property.city}، {property.location}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 border-t border-b border-gray-50 py-3">
          <div className="flex items-center gap-1">
            <TbDimensions className="text-main-green text-lg" />
            <span>
              {property.area} {tCommon("area_unit")}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1">
            <FiHome className="text-main-green text-lg" />
            <span>{property.rooms}</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1">
            <TbBath className="text-main-green text-lg" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1">
            <FaCar className="text-main-green text-lg" />
            <span>{property.garages}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex-1 border border-main-green text-main-green hover:bg-main-green hover:text-white font-medium py-2 rounded-lg transition-colors text-sm">
            {t("view_price")}
          </button>
          <button className="flex-1 bg-main-green text-white hover:bg-main-green/90 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
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
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            {t("upgrade_ad")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPropertyCard;
