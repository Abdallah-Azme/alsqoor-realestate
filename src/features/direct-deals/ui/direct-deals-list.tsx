"use client";

import { useState } from "react";
import { useDirectDeals } from "../hooks/use-direct-deals";
import { DirectDealCard } from "./direct-deal-card";
import { DirectDealDialog } from "./direct-deal-dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { DirectDeal } from "../types";
import { CustomPagination } from "@/components/shared/custom-pagination";

export function DirectDealsList() {
  const t = useTranslations("deals_page");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: response,
    isLoading,
    error,
  } = useDirectDeals({ page: currentPage });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<DirectDeal | null>(null);

  const handleAdd = () => {
    setSelectedDeal(null);
    setDialogOpen(true);
  };

  const handleEdit = (deal: DirectDeal) => {
    setSelectedDeal(deal);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">{t("error_fetch")}</p>
      </div>
    );
  }

  const deals = response?.data || [];
  const meta = response?.meta;
  const hasDeals = deals.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-main-navy">{t("title")}</h2>
        <Button
          onClick={handleAdd}
          className="bg-main-green hover:bg-main-green/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("add_deal")}
        </Button>
      </div>

      {!hasDeals ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">{t("no_deals")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DirectDealCard key={deal.id} deal={deal} onEdit={handleEdit} />
            ))}
          </div>

          {meta && meta.lastPage > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={meta.lastPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <DirectDealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={selectedDeal}
      />
    </div>
  );
}
