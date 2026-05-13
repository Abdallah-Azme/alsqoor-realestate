"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useSearchProperties } from "@/features/properties/hooks/use-properties";
import StatesCard from "@/components/shared/state-card";
import { AlertCircle } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { motion } from "motion/react";
import SmartPagination from "@/components/shared/smart-pagination";
import { useState, useEffect, useMemo, useContext } from "react";
import AddAdvertisementDialog from "@/features/profile/components/dialogs/add-advertisement-dialog";
import { UserContext } from "@/context/user-context";

const AdsSearchListing = () => {
  const t = useTranslations("marketplace");
  const tPage = useTranslations("home.estates_page");
  const tProfile = useTranslations("Profile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(UserContext) || { user: null };
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleOpenAddDialog = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsAddDialogOpen(true);
  };

  // Sync page from URL if present
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) setCurrentPage(Number(page));
    else setCurrentPage(1);
  }, [searchParams]);

  // Build query params from URL, excluding internal routing params
  const filterParams = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!["page", "locale", "lang"].includes(key)) {
        obj[key] = value;
      }
    });
    return obj;
  }, [searchParams]);

  // Call /properties/search with filters extracted from URL
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useSearchProperties({
    ...filterParams,
    page: currentPage,
    per_page: 12,
  });

  // The api-client auto-unwraps `responseData.data`, so:
  // API returns: { code, data: { data: [...], meta: {...} } }
  // Hook receives: { data: [...], meta: {...} }
  const properties: any[] = useMemo(() => {
    if (!response) return [];
    // Standard paginated response unwrapped by api-client → { data: [...], meta: {...} }
    if (response.data && Array.isArray(response.data)) return response.data;
    // Already a plain array
    if (Array.isArray(response)) return response;
    return [];
  }, [response]);

  const meta = useMemo(() => response?.meta, [response]);

  // Map search API fields to the shape expected by StatesCard
  const mappedProperties = useMemo(() => {
    return properties.map((item: any) => {
      const rawPrice = item.priceMin ?? item.price;
      const formattedPrice =
        rawPrice != null ? Number(rawPrice).toLocaleString() : undefined;

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        city: item.city?.name || item.city || item.district || item.location,
        country: item.country?.name || item.country || "السعودية",
        formattedPrice: formattedPrice,
        priceHidden: item.priceHidden || false,
        area: item.area,
        first_image:
          Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : item.image || "/images/state.png",
        isFeatured: item.isFeatured || false,
      };
    });
  }, [properties]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="h-11 w-44 shrink-0 animate-pulse rounded-md bg-gray-200 max-sm:hidden" />
          <div className="h-5 w-52 max-w-[70%] animate-pulse rounded-md bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <StatesCard key={i} property={null} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-bold text-destructive">
          {tPage("error_fetch")}
        </h3>
        <Button onClick={() => refetch()} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add + results — RTL: primary action reads first on the right */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          onClick={handleOpenAddDialog}
          className="h-11 gap-2 bg-main-green px-6 text-white shadow-sm shadow-main-green/20 hover:bg-main-green/90"
        >
          <FiPlus className="size-5" />
          {tProfile("add_new_ad")}
        </Button>

        <p className="text-sm text-gray-600">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">
            {meta?.total ?? mappedProperties.length}
          </span>{" "}
          {t("opportunity")}
        </p>
      </div>

      {/* Cards grid or empty state */}
      {mappedProperties.length > 0 ? (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {mappedProperties.map((property: any) => (
              <StatesCard key={property.id} property={property} />
            ))}
          </motion.div>

          {/* Pagination — only shown if more than 1 page */}
          {meta && meta.lastPage > 1 && (
            <SmartPagination
              currentPage={currentPage}
              totalPages={meta.lastPage}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          )}
        </>
      ) : (
        <EmptyState
          title={t("no_properties")}
          description={t("no_properties_description")}
          buttonText={tProfile("add_new_ad")}
          onAction={handleOpenAddDialog}
        />
      )}

      {/* Add Advertisement Dialog */}
      <AddAdvertisementDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default AdsSearchListing;
