"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { BsBookmarkDash, BsBookmarkFill, BsThreeDots } from "react-icons/bs";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { toast } from "sonner";
import { FaHome, FaBuilding, FaWarehouse } from "react-icons/fa";
import { MdApartment, MdLandscape } from "react-icons/md";
import Image from "next/image";

interface RequestCardProps {
  request?: {
    id: number;
    title: string;
    type: string; // villa, apartment, land, etc.
    operationType: string; // sale, rent
    city: string;
    neighborhoods?: string[];
    area?: number;
    price?: number;
    priceType?: "fixed" | "market"; // market = سعر السوق
    isSerious?: boolean; // طلب جاد
    isSubscribersOnly?: boolean; // للمشتركين فقط
    createdAt: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
      type?: string; // باحث عن عقار
    };
  };
  loading?: boolean;
}

const getPropertyIcon = (type: string) => {
  switch (type) {
    case "villa":
      return <FaHome className="size-5" />;
    case "apartment":
      return <MdApartment className="size-5" />;
    case "land":
      return <MdLandscape className="size-5" />;
    case "building":
      return <FaBuilding className="size-5" />;
    case "warehouse":
      return <FaWarehouse className="size-5" />;
    default:
      return <FaHome className="size-5" />;
  }
};

const getTimeAgo = (dateString: string, t: any) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return t("time.minutes_ago", { count: diffMins });
  } else if (diffHours < 24) {
    return t("time.hours_ago", { count: diffHours });
  } else {
    return t("time.days_ago", { count: diffDays });
  }
};

const RequestCard = ({ request, loading = false }: RequestCardProps) => {
  const t = useTranslations("propertyRequestsPage");
  const { user } = useContext(UserContext);

  // Loading skeleton
  if (loading || !request) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error(t("login_required"));
      return;
    }
    // TODO: Implement bookmark functionality
    toast.success(t("bookmarked"));
  };

  return (
    <Link href={`/requests/${request.id}`} className="block h-full">
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Header row with tags and time */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Serious request tag */}
            {request.isSerious && (
              <span className="bg-main-green/10 text-main-green text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-main-green rounded-full"></span>
                {t("tags.serious_request")}
              </span>
            )}
            {/* Subscribers only tag */}
            {request.isSubscribersOnly && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {t("tags.subscribers_only")}
              </span>
            )}
          </div>
          {/* Time ago */}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            {getTimeAgo(request.createdAt, t)}
          </span>
        </div>

        {/* Title with icon */}
        <div className="flex items-start gap-3">
          <div className="text-gray-500 mt-1">
            {getPropertyIcon(request.type)}
          </div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
            {request.title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
          <span>
            {request.city}
            {request.neighborhoods && request.neighborhoods.length > 0 && (
              <span className="text-gray-400">
                {" "}
                - {request.neighborhoods.slice(0, 3).join("، ")}
                {request.neighborhoods.length > 3 &&
                  ` +${request.neighborhoods.length - 3}`}
              </span>
            )}
          </span>
        </div>

        {/* Area and Price row */}
        <div className="flex items-center gap-6 text-sm">
          {/* Area */}
          {request.area && (
            <div className="flex items-center gap-1 text-gray-600">
              <span className="text-xs">📐</span>
              <span>
                {request.area} {t("units.sqm")}
              </span>
            </div>
          )}
          {/* Price */}
          <div className="flex items-center gap-1">
            {request.priceType === "market" || !request.price ? (
              <span className="text-gray-600">{t("price.market_price")}</span>
            ) : (
              <span className="text-main-green font-bold">
                {request.price.toLocaleString()} {t("units.sar")}
              </span>
            )}
          </div>
        </div>

        {/* User info and actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {request.user.avatar ? (
                <Image
                  src={request.user.avatar}
                  alt={request.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
                  {request.user.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {request.user.name}
              </p>
              {request.user.type && (
                <p className="text-xs text-gray-400">{request.user.type}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <BsThreeDots size={18} />
            </button>
            <button
              onClick={handleBookmarkClick}
              className="p-2 text-gray-400 hover:text-main-green transition-colors"
            >
              <BsBookmarkDash size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RequestCard;
