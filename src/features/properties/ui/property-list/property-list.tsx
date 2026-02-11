"use client";

import { useState } from "react";
import { useProperties } from "../../hooks/use-properties";
import { PropertyFilters } from "../../types/property.types";
import { PropertyCard } from "./property-card";
import { PropertyFiltersComponent } from "./property-filters";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export function PropertyList() {
  const t = useTranslations("properties");
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    per_page: 12,
  });

  const { data, isLoading, error } = useProperties(filters);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters({ ...newFilters, page: 1, per_page: 12 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">{t("error_loading")}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <PropertyFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {t("showing_results", {
                  count: data.data.length,
                  total: data.meta?.total || data.data.length,
                })}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.data.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {data.meta && data.meta.last_page > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={data.meta.current_page === 1}
                    onClick={() =>
                      handlePageChange(data.meta!.current_page - 1)
                    }
                  >
                    {t("pagination.previous")}
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: data.meta.last_page }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={
                          data.meta!.current_page === i + 1
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    disabled={data.meta.current_page === data.meta.last_page}
                    onClick={() =>
                      handlePageChange(data.meta!.current_page + 1)
                    }
                  >
                    {t("pagination.next")}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{t("no_properties")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
