"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import EstateCard from "@/components/estates/estate-card";
import React, { useContext } from "react";
import { useTranslations } from "next-intl";
import { UserContext } from "@/context/user-context";
import { useFavorites } from "@/features/favorites";
import { Link } from "@/i18n/navigation";

const WishListPage = () => {
  const t = useTranslations("wishlist");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const { user, loading: userLoading } = useContext(UserContext);
  const { data: favorites = [], isLoading } = useFavorites();

  // Show login prompt if not logged in
  if (!userLoading && !user) {
    return (
      <main className="space-y-8">
        <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
          <CustomBreadcrumbs items={[{ label: tBreadcrumbs("favorite") }]} />
          <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
        </div>
        <div className="container text-center py-16">
          <p className="text-gray-500 mb-4">{t("login_required")}</p>
          <Link
            href="/auth/login"
            className="inline-block bg-main-green text-white px-6 py-2 rounded-md hover:bg-main-green/90 transition-colors"
          >
            {t("login_button")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: tBreadcrumbs("favorite") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* Loading state */}
      {(isLoading || userLoading) && (
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <EstateCard key={index} withBorder={true} property={null} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !userLoading && favorites.length === 0 && (
        <div className="container text-center py-16">
          <p className="text-gray-500">{t("no_favorites")}</p>
        </div>
      )}

      {/* Favorites grid */}
      {!isLoading && !userLoading && favorites.length > 0 && (
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <EstateCard
              key={favorite.id}
              withBorder={true}
              property={favorite.property}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default WishListPage;
