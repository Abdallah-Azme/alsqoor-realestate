"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { BsBookmarkDash, BsBookmarkFill } from "react-icons/bs";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { UserContext } from "@/context/user-context";
import { useToggleFavorite, useFavorites } from "@/features/favorites";
import { toast } from "sonner";

const StatesCard = ({ withBorder = true, property = null }) => {
  const t = useTranslations("estate_card");
  const tWishlist = useTranslations("wishlist");
  const { user } = useContext(UserContext);
  const { data: favorites = [] } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  // Check if this property is in favorites
  const isFavorited = favorites.some(
    (fav) => fav.property?.id === property?.id
  );

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(tWishlist("login_required"));
      return;
    }

    if (!property?.id) return;

    toggleFavorite.mutate({
      propertyId: property.id,
      isFavorited,
    });
  };

  // If no property data, show placeholder
  if (!property) {
    return (
      <div
        className={`${
          withBorder && "border-2 border-gray-200"
        } bg-white rounded-lg p-4 space-y-5`}
      >
        <div className="h-52 rounded-xl relative overflow-hidden bg-gray-200 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const {
    id,
    slug,
    title,
    city,
    country,
    formattedPrice,
    area,
    first_image,
    isFeatured,
  } = property;

  return (
    <Link href={`/estats/${slug || id}`} className="block">
      <div
        className={`${
          withBorder && "border-2 border-gray-200"
        } bg-white rounded-lg p-4 space-y-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
      >
        {/* image and favorate */}
        <div className="h-52 rounded-xl relative overflow-hidden">
          {/* favorate */}
          <button
            onClick={handleFavoriteClick}
            disabled={toggleFavorite.isPending}
            className={`group bg-white p-2 rounded-md absolute z-10 top-4 start-4 transition-all duration-300 ${
              isFavorited ? "text-red-500" : "text-main-green"
            } ${toggleFavorite.isPending ? "opacity-50" : "hover:scale-110"}`}
          >
            {isFavorited ? (
              <BsBookmarkFill size={20} />
            ) : (
              <BsBookmarkDash size={20} />
            )}
          </button>
          {/* space */}
          {area && (
            <div className="text-[.6rem] font-semibold w-fit bg-white p-2 rounded-md absolute z-10  top-4 end-4">
              {area}
              <sup>{t("sqm")}</sup>
            </div>
          )}
          {/* special */}
          {isFeatured && (
            <div className="text-xs font-semibold w-fit bg-main-green text-white p-2 rounded-t-md absolute z-10  top-1/2 -start-5  -rotate-90">
              {t("featured")}
            </div>
          )}
          <Image
            src={first_image || "/images/state.png"}
            fill
            alt={title || "property"}
            className="static w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* content */}
        <div className="space-y-2">
          <h4 className=" font-bold text-lg line-clamp-1">{title}</h4>
          <p className="text-xs text-gray-400">
            {city}, {country}
          </p>
          {/* price */}
          <div className="flex items-center gap-1">
            <p className="text-xl font-bold text-main-green">
              {formattedPrice}
            </p>
            {!property.priceHidden && (
              <Image
                src={"/images/ryal.svg"}
                alt="ryal"
                width={20}
                height={20}
                className="size-4 object-contain"
              />
            )}
          </div>
        </div>
        {/* link */}
        <div className="text-sm font-medium block text-center w-3/4 mx-auto  rounded-md  py-2 px-3 border-1 border-main-green text-main-green hover:bg-main-green hover:text-white transition-all duration-300">
          {t("show_details")}
        </div>
      </div>
    </Link>
  );
};

export default StatesCard;
