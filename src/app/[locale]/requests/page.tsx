"use client";

import PageHeader from "@/components/shared/page-header";
import { RequestsFilterPanel, RequestsGrid } from "@/components/requests";
import { useRequests } from "@/features/requests/hooks/use-requests";
import type { PropertyRequestFilters } from "@/features/requests/types/request.types";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { ServiceDescription } from "@/features/service-descriptions";

const RequestsPage = () => {
  const t = useTranslations("propertyRequestsPage");
  const tBreadcrumbs = useTranslations("breadcrumbs");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Build filters from search params
  const filters: PropertyRequestFilters = {
    /** search: keyword/details search */
    search: searchParams.get("search") || undefined,
    /** request_type: filter by buy/rent */
    request_type: (searchParams.get("request_type") as any) || undefined,
    /** sort_by: ordering of results */
    sort_by: searchParams.get("sort_by") || undefined,
    /** country_id: geographical filter by country */
    country_id: searchParams.get("country_id")
      ? Number(searchParams.get("country_id"))
      : undefined,
    /** city_id: geographical filter by city */
    city_id: searchParams.get("city_id")
      ? Number(searchParams.get("city_id"))
      : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  };

  // Fetch requests using the hook
  const { data: response, isLoading, error } = useRequests(filters);

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
  const requests = response?.data || [];
  const totalResults = response?.meta?.total || 0;
  const currentPage = response?.meta?.current_page || 1;
  const lastPage = response?.meta?.total_pages || 1;

  return (
    <main className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageHeader
          title={t("page_title")}
          breadcrumbItems={[{ label: tBreadcrumbs("requests") }]}
        >
          <ServiceDescription type="requests" />
        </PageHeader>
      </motion.div>

      {/* Filter and content section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container space-y-8"
      >
        <RequestsFilterPanel onSubmit={handleFilterSubmit} />

        {error && (
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
          loadingMore={isLoading && requests.length > 0}
        />
      </motion.section>
    </main>
  );
};

export default RequestsPage;
