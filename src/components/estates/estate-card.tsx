"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BsBookmarkDash, BsBookmarkFill } from "react-icons/bs";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { useToggleFavorite, useFavorites } from "@/features/favorites";
import { toast } from "sonner";

interface EstateCardProps {
  withBorder?: boolean;
  property?: any;
  id?: any;
  img?: any;
  title?: any;
  location?: any;
  price?: any;
  area?: any;
  isFeatured?: any;
  slug?: any;
  isFavorited?: boolean; // Force favorited state (for wishlist page)
}

const EstateCard = ({
  withBorder = true,
  property,
  id,
  img,
  title,
  location,
  price,
  area,
  isFeatured,
  slug,
  isFavorited: forceFavorited,
}: EstateCardProps) => {
  const t = useTranslations("estate_card");
  const tWishlist = useTranslations("wishlist");
  const { user } = useContext(UserContext);
  const { data: favorites = [] } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  // If no property data passed, return placeholder/skeleton
  if (!property && !title) {
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

  // Use property object if available, otherwise use individual props
  const displayData = property
    ? {
        id: property.id,
        slug: property.slug,
        title: property.title,
        city: property.city,
        country: property.country,
        formattedPrice: property.formattedPrice,
        priceHidden: property.priceHidden,
        area: property.area,
        first_image: property.first_image,
        isFeatured: property.isFeatured,
        isDeal: property.isDeal,
      }
    : {
        id,
        slug,
        title,
        city: location?.split(",")[0],
        country: location?.split(",")[1],
        formattedPrice: price,
        priceHidden: false,
        area,
        first_image: img,
        isFeatured,
        isDeal: false,
      };

  // Check if this property is in favorites (use forced value or check from API)
  const isFavorited =
    forceFavorited !== undefined
      ? forceFavorited
      : favorites.some((fav) => fav.property?.id === displayData.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(tWishlist("login_required"));
      return;
    }

    if (!displayData.id) return;

    toggleFavorite.mutate({
      propertyId: displayData.id,
      isFavorited,
    });
  };

  return (
    <Link
      href={`/estats/${displayData.slug || displayData.id}`}
      className="block h-full"
    >
      <div
        className={`${
          withBorder && "border-2 border-gray-200"
        } bg-white rounded-lg p-4 space-y-5 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer`}
      >
        {/* image and favorate */}
        <div className="h-52 rounded-xl relative overflow-hidden shrink-0">
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

          {/* tags container */}
          <div className="absolute top-4 end-4 z-10 flex flex-col gap-2 items-end">
            {/* area */}
            {displayData.area && (
              <div className="text-[.6rem] font-semibold w-fit bg-white p-2 rounded-md">
                {displayData.area}
                <sup>{t("sqm")}</sup>
              </div>
            )}
          </div>

          {/* special/featured tag */}
          {displayData.isFeatured && (
            <div className="text-xs font-semibold w-fit bg-main-green text-white p-2 rounded-t-md absolute z-10 top-1/2 -start-5 -rotate-90 shadow-md">
              {t("featured")}
            </div>
          )}

          {/* deal tag */}
          {displayData.isDeal && (
            <div className="text-xs font-semibold w-fit bg-red-500 text-white p-2 rounded-t-md absolute z-10 top-20 -start-5 -rotate-90 shadow-md">
              {t("deal")}
            </div>
          )}

          <Image
            src={displayData.first_image || "/images/state.png"}
            fill
            alt={displayData.title || "property"}
            className="static w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* content */}
        <div className="space-y-2 flex-grow flex flex-col">
          <h4
            className="font-bold text-lg line-clamp-1"
            title={displayData.title}
          >
            {displayData.title}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-1">
            {displayData.city}
            {displayData.country ? `, ${displayData.country}` : ""}
          </p>

          {/* price */}
          <div className="flex items-center gap-1 mt-auto pt-2">
            {displayData.priceHidden ? (
              <p className="text-xl font-bold text-main-green hover:underline">
                {t("price_hidden")}
              </p>
            ) : (
              <>
                <p className="text-xl font-bold text-main-green">
                  {displayData.formattedPrice?.replace(" ريال", "")}
                </p>
                <Image
                  src={"/images/ryal.svg"}
                  alt="ryal"
                  width={20}
                  height={20}
                  className="size-4 object-contain"
                />
              </>
            )}
          </div>
        </div>

        {/* link button */}
        <div className="text-sm font-medium block text-center w-3/4 mx-auto rounded-md py-2 px-3 border-1 border-main-green text-main-green hover:bg-main-green hover:text-white transition-all duration-300 mt-2">
          {t("show_details")}
        </div>
      </div>
    </Link>
  );
};

export default EstateCard;
