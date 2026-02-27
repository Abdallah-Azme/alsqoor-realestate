"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { FaStar, FaCamera } from "react-icons/fa";
import { User } from "@/types";
import { useRef, useContext } from "react";
import { useUpdateProfile } from "../../hooks/use-profile";
import { toast } from "sonner";
import { UserContext } from "@/context/user-context";

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  const locale = useLocale();
  const t = useTranslations("Profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const context = useContext(UserContext);
  const fetchUserProfile = context?.fetchUserProfile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(t("updating") || "Updating...");

    updateProfile(
      {
        name: user.name,
        email: user.email,
        phone: user.mobile || user.phone || "",
        avatar: file,
      },
      {
        onSuccess: async () => {
          toast.success(t("updated_successfully") || "Updated successfully", {
            id: toastId,
          });
          if (fetchUserProfile) {
            await fetchUserProfile();
          }
        },
        onError: () => {
          toast.error(t("update_failed") || "Update failed", { id: toastId });
        },
        onSettled: () => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      },
    );
  };

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
          <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
            <Image
              src={user.avatar || "/images/avatar-placeholder.svg"}
              alt={user.name}
              width={96}
              height={96}
              className={`object-cover w-full h-full ${isPending ? "opacity-50" : ""}`}
            />
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-6 h-6 border-2 border-main-green border-t-transparent rounded-full animate-spin"></span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="absolute bottom-0 end-0 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-main-green transition-colors border border-gray-100 disabled:opacity-50 cursor-pointer"
          >
            <FaCamera size={12} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
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
