"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock, FiHome, FiTrendingUp, FiShare2 } from "react-icons/fi";
import { TbDimensions, TbBath } from "react-icons/tb";
import { FaCar } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import {
  useConvertToAdvertisement,
  useStartMarketing,
} from "@/features/properties/hooks/use-properties";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Property } from "@/features/properties/types/property.types";

interface MyPropertyCardProps {
  property: Partial<Property>;
}

const MyPropertyCard = ({ property }: MyPropertyCardProps) => {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("marketplace");
  const tProps = useTranslations("properties");

  const convertMutation = useConvertToAdvertisement();
  const marketMutation = useStartMarketing();

  const handleUpgrade = async () => {
    if (!property.id) return;
    try {
      // For demo/simple conversion, we passing empty data or basic license if required by API
      await convertMutation.mutateAsync({
        propertyId: property.id as number,
        data: {
          license_number: property.license_number || "AUTO-UPGRADE",
          license_expiry_date: new Date().toISOString(),
        } as any,
      });
      toast.success(t("upgrade_success") || "Ad upgraded successfully!");
    } catch (error) {
      toast.error(t("upgrade_error") || "Failed to upgrade ad.");
    }
  };

  const handleStartMarketing = async () => {
    if (!property.id) return;
    try {
      await marketMutation.mutateAsync(property.id as number);
      toast.success(
        t("marketing_success") || "Marketing started successfully!",
      );
    } catch (error) {
      toast.error(t("marketing_error") || "Failed to start marketing.");
    }
  };

  const formattedPrice = property.price_min
    ? Number(property.price_min).toLocaleString()
    : property.price
      ? Number(property.price).toLocaleString()
      : "0";

  const cityName =
    typeof property.city === "string"
      ? property.city
      : property.city?.name || "";

  const locationLabel = property.district
    ? `${cityName}، ${property.district}`
    : cityName || property.location || "";

  // Calculate relative time or use created_at
  const timePosted = property.created_at
    ? new Date(property.created_at).toLocaleDateString("ar-SA")
    : t("loading");

  const mainImage = property.images?.[0] || "/images/state.png";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 w-full group">
        <Image
          src={mainImage}
          alt={property.title || ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Serious Request / Featured Badge */}
        {(property.is_featured || property.isFeatured) && (
          <div className="absolute bottom-3 end-3 bg-main-navy text-white text-xs px-3 py-1 rounded-md font-medium shadow-md">
            {t("featured_label") || "Featured"}
          </div>
        )}

        {/* Area Badge */}
        <div className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-main-navy shadow-sm dir-ltr">
          {property.area}م²
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Price & Time */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-main-green font-bold text-lg">
            <span>{formattedPrice}</span>
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
            <span>{timePosted}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 min-h-6">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4 min-h-5">
          <HiOutlineLocationMarker className="text-main-green shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </div>

        {/* Specs Grid */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 border-t border-b border-gray-50 py-3 mt-auto">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <TbDimensions className="text-main-green text-lg" />
              <span className="font-semibold">{property.area}</span>
            </div>
            <span className="text-[10px] text-gray-400 capitalize">
              {tCommon("area_unit")}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-100"></div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <FiHome className="text-main-green text-lg" />
              <span className="font-semibold">
                {property.rooms || property.bedrooms || 0}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 capitalize">
              {tProps("rooms")}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-100"></div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <TbBath className="text-main-green text-lg" />
              <span className="font-semibold">{property.bathrooms || 0}</span>
            </div>
            <span className="text-[10px] text-gray-400 capitalize">
              {tProps("bathrooms")}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-100"></div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <FaCar className="text-main-green text-lg" />
              <span className="font-semibold">{property.garages || 0}</span>
            </div>
            <span className="text-[10px] text-gray-400 capitalize">
              {tProps("garages")}
            </span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={`/ads/${property.slug || property.id}`}
            className="col-span-1 border border-main-green text-main-green hover:bg-main-green hover:text-white font-medium py-2 rounded-lg transition-all text-sm text-center flex items-center justify-center gap-1.5"
          >
            <FiShare2 size={14} />
            {t("view_price")}
          </Link>

          <button
            onClick={handleUpgrade}
            disabled={convertMutation.isPending}
            className="col-span-1 bg-main-green text-white hover:bg-main-green/90 disabled:bg-gray-300 font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {convertMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FiTrendingUp size={16} />
            )}
            {t("upgrade_ad")}
          </button>

          <button
            onClick={handleStartMarketing}
            disabled={marketMutation.isPending}
            className="col-span-2 bg-main-navy text-white hover:bg-main-navy/90 disabled:bg-gray-300 font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {marketMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FiTrendingUp size={16} />
            )}
            {t("market_now") || "قم بالتسويق للعقار"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPropertyCard;
