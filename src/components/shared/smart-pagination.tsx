"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface SmartPaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Maximum visible page numbers (default: 5) */
  maxVisiblePages?: number;
  /** Show previous/next buttons (default: true) */
  showPrevNext?: boolean;
  /** Additional className for the container */
  className?: string;
}

/**
 * Smart Pagination Component
 * A reusable, dynamic pagination component with smart page number display
 */
export default function SmartPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showPrevNext = true,
  className,
}: SmartPaginationProps) {
  // Don't render if only 1 page or less
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Add ellipsis if current page is far from start
      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div dir="ltr" className={cn("flex justify-center", className)}>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          {showPrevNext && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={cn(
                  isFirstPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer",
                )}
                aria-disabled={isFirstPage}
              />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {/* Next Button */}
          {showPrevNext && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={cn(
                  isLastPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer",
                )}
                aria-disabled={isLastPage}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

/**
 * Hook to manage pagination state
 * Returns current page, total pages, and handlers
 */
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageItems = (currentPage: number): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return {
    totalPages,
    totalItems,
    itemsPerPage,
    getPageItems,
  };
}
