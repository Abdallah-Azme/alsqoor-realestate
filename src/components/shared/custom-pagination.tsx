"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CustomPaginationProps) {
  const t = useTranslations("common");

  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic for ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className="px-2 py-2">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </span>
        );
      }

      const isCurrent = page === currentPage;
      return (
        <Button
          key={`page-${page}`}
          variant={isCurrent ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-10 w-10 rounded-lg transition-all duration-200",
            isCurrent
              ? "bg-main-green hover:bg-main-green/90 text-white shadow-md shadow-main-green/20"
              : "border-gray-200 text-gray-600 hover:border-main-green hover:text-main-green",
          )}
          onClick={() => onPageChange(page as number)}
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2 py-8", className)}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-lg border-gray-200 text-gray-600 disabled:opacity-50 hover:border-main-green hover:text-main-green rtl:rotate-180"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">{renderPageButtons()}</div>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-lg border-gray-200 text-gray-600 disabled:opacity-50 hover:border-main-green hover:text-main-green rtl:rotate-180"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
