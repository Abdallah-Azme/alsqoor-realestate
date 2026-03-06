"use client";

import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchProperties } from "@/features/properties/hooks/use-properties";
import StatesCard from "@/components/shared/state-card";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { motion } from "motion/react";
import SmartPagination from "@/components/shared/smart-pagination";
import { useState, useEffect, useMemo } from "react";
import AddAdvertisementDialog from "@/features/profile/components/dialogs/add-advertisement-dialog";

const AdsSearchListing = () => {
  const t = useTranslations("marketplace");
  const tPage = useTranslations("home.estates_page");
  const tProfile = useTranslations("Profile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-main-green" />
        <p className="text-gray-500 font-medium">{tPage("loading")}</p>
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
      {/* Results count & Add Action */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">
          {t("results_count")}:{" "}
          <span className="font-bold text-main-navy">
            {meta?.total ?? mappedProperties.length}
          </span>{" "}
          {t("opportunity")}
        </p>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-main-green hover:bg-main-green/90 text-white h-11 gap-2 px-6 shadow-sm shadow-main-green/20"
        >
          <FiPlus className="w-5 h-5" />
          {tProfile("add_new_ad")}
        </Button>
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
          onAction={() => setIsAddDialogOpen(true)}
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
