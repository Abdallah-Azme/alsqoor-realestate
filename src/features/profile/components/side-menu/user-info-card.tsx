"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { FaStar, FaCamera } from "react-icons/fa";
import { User } from "@/types";

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  const locale = useLocale();
  const t = useTranslations("Profile");
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(
        locale === "ar" ? "ar-EG" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "";

  return (
    <Card className="shadow-sm border-gray-100 rounded-xl">
      <CardContent className="p-6 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={user.avatar || "/images/avatar-placeholder.png"}
              alt={user.name}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <button
            type="button"
            className="absolute bottom-0 end-0 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-main-green transition-colors border border-gray-100"
          >
            <FaCamera size={12} />
          </button>
        </div>

        {/* Name & Badge */}
        <h3 className="font-bold text-main-navy text-lg text-center">
          {user.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {user.role || t("featured_client")}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-gray-400 text-xs me-1">
            <span className="mx-0.5">(</span>
            {user.reviews_count || 33}
            <span className="mx-0.5">)</span>
          </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={
                star <= (user.rating || 5) ? "text-yellow-400" : "text-gray-200"
              }
              size={14}
            />
          ))}
        </div>

        {/* Join Date & Status */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-gray-400">{t("join_date")}</p>
          <p className="text-xs font-medium text-gray-500">{joinedDate}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-main-green">
            <span className="size-1.5 rounded-full bg-main-green"></span>
            {t("active_status")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
