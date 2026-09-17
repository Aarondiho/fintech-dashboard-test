import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { FilterState } from "../types";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isDebouncing: boolean;
  totalFilteredRecords: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isDebouncing,
  totalFilteredRecords: _totalFilteredRecords,
}) => {
  // Local state for immediate typing feedback
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [isTypingDebounce, setIsTypingDebounce] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state if external filters change (e.g. from URL popstate or reset)
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  // Debounce search inputs by 400ms to avoid spamming the backend API while typing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsTypingDebounce(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setIsTypingDebounce(false);
      onFilterChange({ search: val, page: 1 });
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setIsTypingDebounce(false);
      onFilterChange({ search: searchTerm, page: 1 });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsTypingDebounce(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onFilterChange({ search: "", page: 1 });
  };

  const isFilterActive =
    Boolean(filters.search) ||
    filters.status !== "ALL" ||
    filters.channel !== "ALL" ||
    filters.currency !== "ALL";

  return (
    <div
      id="filter-bar-container"
      className="luxe-card relative z-10 w-full mb-6 p-4.5 bg-gradient-to-br from-white via-[#FAFBFD] to-[#FFF6F8] dark:from-[#131A2D] dark:via-[#111727] dark:to-[#1B1425] border border-[#CBD5E1] dark:border-[#273656]"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Left Side: Search Bar with Debouncing */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
              {isDebouncing || isTypingDebounce ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#831C35] dark:text-[#E58A9C]" />
              ) : (
                <Search className="w-4 h-4 text-[#831C35] dark:text-[#E58A9C]" />
              )}
            </div>
            <input
              id="input-transaction-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search by ID or Counterparty (e.g., tx_... or name)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border bg-[#F8FAFC] dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#1E293B] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#831C35]/25 focus:border-[#831C35] transition-all"
            />
            {searchTerm && (
              <button
                id="btn-clear-search"
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search text"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#5A0B1B] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Clean Dropdowns (Status, Channel, Currency) & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="select-status-filter"
              className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hidden sm:inline"
            >
              Status:
            </label>
            <div className="relative">
              <select
                id="select-status-filter"
                value={filters.status}
                onChange={(e) =>
                  onFilterChange({ status: e.target.value, page: 1 })
                }
                className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-semibold border bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#831C35]/20 focus:border-[#831C35] cursor-pointer shadow-2xs transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#64748B] dark:text-[#94A3B8]">
                <Filter className="w-3 h-3 opacity-70" />
              </div>
            </div>
          </div>

          {/* Channel Filter */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="select-channel-filter"
              className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hidden sm:inline"
            >
              Channel:
            </label>
            <div className="relative">
              <select
                id="select-channel-filter"
                value={filters.channel}
                onChange={(e) =>
                  onFilterChange({ channel: e.target.value, page: 1 })
                }
                className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-semibold border bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#831C35]/20 focus:border-[#831C35] cursor-pointer shadow-2xs transition-all"
              >
                <option value="ALL">All Channels</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#64748B] dark:text-[#94A3B8]">
                <SlidersHorizontal className="w-3 h-3 opacity-70" />
              </div>
            </div>
          </div>

          {/* Currency Filter */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="select-currency-filter"
              className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hidden sm:inline"
            >
              Currency:
            </label>
            <div className="relative">
              <select
                id="select-currency-filter"
                value={filters.currency}
                onChange={(e) =>
                  onFilterChange({ currency: e.target.value, page: 1 })
                }
                className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-semibold border bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#831C35]/20 focus:border-[#831C35] cursor-pointer shadow-2xs transition-all"
              >
                <option value="ALL">All (USD / BIF)</option>
                <option value="USD">USD ($)</option>
                <option value="BIF">BIF (FBu)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#64748B] dark:text-[#94A3B8]">
                <SlidersHorizontal className="w-3 h-3 opacity-70" />
              </div>
            </div>
          </div>

          {/* Reset Filters Action Button */}
          {isFilterActive && (
            <button
              id="btn-reset-filters"
              type="button"
              onClick={onResetFilters}
              title="Reset all search queries and dropdown filters"
              className="luxe-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#690E22] via-[#831C35] to-[#A42544] hover:brightness-110 border border-white/20 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Smart Preset Chips */}
      <div className="mt-3.5 pt-3 border-t border-[#CBD5E1]/70 dark:border-[#273656] flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mr-1">
          Quick Views:
        </span>

        {/* All Settlements */}
        <button
          type="button"
          onClick={() => onFilterChange({ status: "ALL", channel: "ALL", currency: "ALL", page: 1 })}
          className={`luxe-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.status === "ALL" && filters.channel === "ALL" && filters.currency === "ALL"
              ? "bg-gradient-to-r from-[#1E293B] to-[#334155] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#64748B] dark:text-[#94A3B8] hover:border-[#831C35]"
          }`}
        >
          All Activity
        </button>

        {/* Completed only */}
        <button
          id="chip-completed"
          type="button"
          onClick={() => onFilterChange({ status: "COMPLETED", page: 1 })}
          className={`luxe-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.status === "SUCCESSFUL" || filters.status === "COMPLETED"
              ? "bg-gradient-to-r from-[#0A4D37] via-[#0F634A] to-[#16805C] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#16805C] dark:text-emerald-400 hover:border-[#16805C]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Completed</span>
        </button>

        {/* Pending only */}
        <button
          id="chip-pending"
          type="button"
          onClick={() => onFilterChange({ status: "PENDING", page: 1 })}
          className={`luxe-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.status === "PENDING"
              ? "bg-gradient-to-r from-[#804207] via-[#99570B] to-[#C47A16] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#B25E09] dark:text-amber-400 hover:border-[#B25E09]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Pending</span>
        </button>

        {/* Failed only */}
        <button
          id="chip-failed"
          type="button"
          onClick={() => onFilterChange({ status: "FAILED", page: 1 })}
          className={`luxe-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.status === "FAILED"
              ? "bg-gradient-to-r from-[#7D1124] via-[#9E2034] to-[#C7374E] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#C7374E] dark:text-rose-400 hover:border-[#C7374E]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>Failed</span>
        </button>

        {/* Mobile Money Only */}
        <button
          id="chip-channel-mobile-money"
          type="button"
          onClick={() => onFilterChange({ channel: "MOBILE_MONEY", page: 1 })}
          className={`luxe-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.channel === "MOBILE_MONEY"
              ? "bg-gradient-to-r from-[#5A0B1B] via-[#831C35] to-[#B83A56] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#64748B] dark:text-[#94A3B8] hover:border-[#831C35]"
          }`}
        >
          Mobile Money
        </button>

        {/* Card Only */}
        <button
          id="chip-channel-card"
          type="button"
          onClick={() => onFilterChange({ channel: "CARD", page: 1 })}
          className={`luxe-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.channel === "CARD"
              ? "bg-gradient-to-r from-[#5A0B1B] via-[#831C35] to-[#B83A56] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#64748B] dark:text-[#94A3B8] hover:border-[#831C35]"
          }`}
        >
          Card
        </button>

        {/* Bank Transfer Only */}
        <button
          id="chip-channel-bank-transfer"
          type="button"
          onClick={() => onFilterChange({ channel: "BANK_TRANSFER", page: 1 })}
          className={`luxe-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.channel === "BANK_TRANSFER"
              ? "bg-gradient-to-r from-[#5A0B1B] via-[#831C35] to-[#B83A56] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#64748B] dark:text-[#94A3B8] hover:border-[#831C35]"
          }`}
        >
          Bank Transfer
        </button>

        {/* USD Only */}
        <button
          type="button"
          onClick={() => onFilterChange({ currency: "USD", page: 1 })}
          className={`luxe-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.currency === "USD"
              ? "bg-gradient-to-r from-[#0D224A] via-[#153B82] to-[#2563EB] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#64748B] dark:text-[#94A3B8] hover:border-[#831C35]"
          }`}
        >
          USD ($)
        </button>

        {/* BIF Only */}
        <button
          type="button"
          onClick={() => onFilterChange({ currency: "BIF", page: 1 })}
          className={`luxe-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filters.currency === "BIF"
              ? "bg-gradient-to-r from-[#0D224A] via-[#153B82] to-[#2563EB] text-white border-transparent shadow-xs"
              : "bg-white dark:bg-[#192237] border-[#CBD5E1] dark:border-[#2E3C5C] text-[#64748B] dark:text-[#94A3B8] hover:border-[#831C35]"
          }`}
        >
          BIF (FBu)
        </button>
      </div>
    </div>
  );
};
