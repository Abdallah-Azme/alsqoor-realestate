"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import type { PropertyRequestFilters } from "@/features/requests/types/request.types";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

const RequestsPage = () => {
  const t = useTranslations("propertyRequestsPage");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Build filters from search params
  const filters: PropertyRequestFilters = {
    details: searchParams.get("details") || undefined,
    country_id: searchParams.get("country_id")
      ? Number(searchParams.get("country_id"))
      : undefined,
    city_id: searchParams.get("city_id")
      ? Number(searchParams.get("city_id"))
      : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  };

  // Fetch requests using the hook
  // const { data, isLoading, error } = useRequests(filters);
  const data = null;
  const isLoading = false;
  const error = null;

  // Handle filter submission
  const handleFilterSubmit = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all"
      ) {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
  };

  // Handle load more (pagination)
  const handleLoadMore = () => {
    const nextPage = (filters.page || 1) + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Extract data from the response
  const requests = []; // data?.data?.data || [];
  const totalResults = 0; // data?.data?.meta?.total || 0;
  const currentPage = 1; // data?.data?.meta?.current_page || 1;
  const lastPage = 1; // data?.data?.meta?.total_pages || 1;

  return (
    <main className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container"
      >
        <CustomBreadcrumbs items={[{ label: tBreadcrumbs("requests") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("page_title")}</h1>
      </motion.div>

      {/* Filter and content section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container space-y-8"
      >
        {/* <RequestsFilterPanel onSubmit={handleFilterSubmit} /> */}
        <div className="text-center py-12 text-muted-foreground">
          {tBreadcrumbs("no_properties")}
        </div>

        {/* {error && (
          <div className="text-center py-4 text-red-500">
            {t("messages.error_fetch")}
          </div>
        )}

        <RequestsGrid
          requests={requests}
          loading={isLoading}
          totalResults={totalResults}
          pagination={{
            currentPage,
            lastPage,
          }}
          onLoadMore={handleLoadMore}
          loadingMore={false}
        /> */}
      </motion.section>
    </main>
  );
};

export default RequestsPage;
