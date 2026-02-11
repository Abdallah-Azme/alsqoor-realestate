"use client";

import React, { useState } from "react";
import RequestCard from "./request-card";
import { HiArrowPath } from "react-icons/hi2";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";
import AddRequestDialog from "./add-request-dialog";
import { PropertyRequest } from "@/features/requests/types/request.types";

interface RequestsGridProps {
  requests?: PropertyRequest[];
  loading?: boolean;
  totalResults?: number;
  pagination?: {
    currentPage?: number;
    lastPage?: number;
  };
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

const RequestsGrid = ({
  requests = [],
  loading = false,
  totalResults = 0,
  pagination = {},
  onLoadMore,
  loadingMore = false,
}: RequestsGridProps) => {
  const t = useTranslations("propertyRequestsPage");
  const [open, setOpen] = useState(false);

  const { currentPage = 1, lastPage = 1 } = pagination;
  const hasMore = currentPage < lastPage;

  return (
    <>
      {/* Header with results count and add button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl">
          {t("results_count")}:{" "}
          <span className="text-main-green font-bold">{totalResults}</span>{" "}
          {t("result")}
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-main-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-main-navy transition-colors">
            <FaPlus />
            {t("add_request")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            <AddRequestDialog setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading state */}
      {loading && requests.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <RequestCard key={index} loading />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("no_requests")}</p>
        </div>
      )}

      {/* Requests grid - 2 columns on desktop */}
      {requests.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={{
                  id: request.id,
                  title: request.details, // Using details as title since title is missing
                  type: "villa", // Defaulting to villa/home icon as propertyType is missing
                  operationType: request.requestType,
                  city: request.city?.name || "",
                  neighborhoods: [request.district],
                  area: Number(request.area),
                  price: request.budgetAmount
                    ? Number(request.budgetAmount)
                    : undefined,
                  priceType:
                    request.budgetType === "market_price" ? "market" : "fixed",
                  isSerious: request.isUrgent === "1",
                  createdAt: request.createdAt,
                  user: {
                    id: request.user.id,
                    name: request.user.name,
                    // avatar: request.user.avatar
                  },
                }}
              />
            ))}
          </div>

          {/* Load More button */}
          {hasMore && (
            <div className="flex items-center justify-center mt-8">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="border border-main-navy text-main-navy hover:bg-main-navy hover:text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <HiArrowPath
                  className={`size-5 text-main-green ${
                    loadingMore ? "animate-spin" : ""
                  }`}
                />
                {loadingMore ? t("loading") : t("load_more")}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RequestsGrid;
