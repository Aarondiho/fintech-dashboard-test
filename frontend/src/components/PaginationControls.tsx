import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PaginationMetadata } from "../types";

interface PaginationControlsProps {
  pagination: PaginationMetadata;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  isLoading: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  isLoading,
}) => {
  const { page, limit, total_records, total_pages, has_next, has_prev } = pagination;

  const startRecord = total_records === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total_records);

  // Generate intelligent page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (total_pages <= maxVisible + 2) {
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(total_pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < total_pages - 2) {
        pages.push("...");
      }
      if (!pages.includes(total_pages)) {
        pages.push(total_pages);
      }
    }
    return pages;
  };

  return (
    <div className="relative z-10 mt-5 w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1 text-xs">
      {/* Left: Quick Page Summary */}
      <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
        <span className="font-medium">
          Page <strong className="font-bold text-[#1E293B] dark:text-[#F8FAFC]">{page}</strong> of{" "}
          <strong className="font-bold text-[#1E293B] dark:text-[#F8FAFC]">{total_pages}</strong>
        </span>
      </div>

      {/* Right: Modern Page Numbers & Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          id="btn-page-first"
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!has_prev || isLoading}
          aria-label="First page"
          className="luxe-btn p-1.5 rounded-lg border border-[#CBD5E1] dark:border-[#2E3C5C] bg-white dark:bg-[#192237] text-[#64748B] dark:text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#FFFFFF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Prev Page */}
        <button
          id="btn-page-prev"
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev || isLoading}
          aria-label="Previous page"
          className="luxe-btn p-1.5 rounded-lg border border-[#CBD5E1] dark:border-[#2E3C5C] bg-white dark:bg-[#192237] text-[#64748B] dark:text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#FFFFFF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page Numeric Badges */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-[#94A3B8] dark:text-[#64748B]"
                >
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === page;

            return (
              <button
                key={`page-btn-${pageNum}`}
                id={`btn-page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                aria-current={isActive ? "page" : undefined}
                className={`luxe-btn min-w-[32px] h-[32px] px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#690E22] via-[#831C35] to-[#A42544] text-white shadow-xs border border-white/20"
                    : "border border-[#CBD5E1] dark:border-[#2E3C5C] bg-white dark:bg-[#192237] text-[#64748B] dark:text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#FFFFFF] hover:border-[#831C35]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          id="btn-page-next"
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next || isLoading}
          aria-label="Next page"
          className="luxe-btn p-1.5 rounded-lg border border-[#CBD5E1] dark:border-[#2E3C5C] bg-white dark:bg-[#192237] text-[#64748B] dark:text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#FFFFFF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          id="btn-page-last"
          type="button"
          onClick={() => onPageChange(total_pages)}
          disabled={!has_next || isLoading}
          aria-label="Last page"
          className="luxe-btn p-1.5 rounded-lg border border-[#CBD5E1] dark:border-[#2E3C5C] bg-white dark:bg-[#192237] text-[#64748B] dark:text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#FFFFFF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
