import React, { useState } from "react";
import {
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  ChevronRight,
  Inbox,
  SearchX,
} from "lucide-react";
import { Transaction, TransactionChannel, TransactionStatus } from "../types";
import {
  formatAmount,
  formatFullDate,
  formatRelativeTime,
  getCounterpartyDetails,
} from "../utils/formatters";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onSelectTransaction: (tx: Transaction) => void;
  onResetFilters: () => void;
  currentPage?: number;
  pageSize?: number;
  totalRecords?: number;
  onLimitChange?: (newLimit: number) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  onSelectTransaction,
  onResetFilters,
  currentPage = 1,
  pageSize = 10,
  totalRecords,
  onLimitChange,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const total = totalRecords ?? transactions.length;
  const startRecord = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, total);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const renderChannelBadge = (channel: TransactionChannel) => {
    switch (channel) {
      case "MOBILE_MONEY":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#C47A16]/10 text-[#C47A16] border border-[#C47A16]/20 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-700/40 shadow-2xs">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Money</span>
          </span>
        );
      case "CARD":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4969B2]/10 text-[#4969B2] border border-[#4969B2]/20 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-700/40 shadow-2xs">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card</span>
          </span>
        );
      case "BANK_TRANSFER":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#831C35]/10 text-[#831C35] border border-[#831C35]/20 dark:bg-[#E58A9C]/15 dark:text-[#E58A9C] dark:border-[#E58A9C]/30 shadow-2xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Transfer</span>
          </span>
        );
      default:
        return <span>{channel}</span>;
    }
  };

  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "SUCCESSFUL":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#16805C]/10 text-[#16805C] border border-[#16805C]/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/60 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16805C] dark:bg-emerald-400 animate-pulse" />
            <span>{status === "SUCCESSFUL" ? "Successful" : "Completed"}</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C47A16]/10 text-[#C47A16] border border-[#C47A16]/30 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/60 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C47A16] dark:bg-amber-400 animate-ping opacity-75" />
            <span>Pending</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C7374E]/10 text-[#C7374E] border border-[#C7374E]/30 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700/60 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7374E] dark:bg-rose-400" />
            <span>Failed</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="luxe-card relative z-10 w-full overflow-hidden bg-gradient-to-br from-white via-[#FCFDFE] to-[#FAF6F8] dark:from-[#161D2F] dark:via-[#13192A] dark:to-[#111726] shadow-sm border border-[#CBD5E1] dark:border-[#273656]">
      {/* ===================== TOP TABLE CONTROLS ===================== */}
      <div className="p-4 sm:px-6 sm:py-3.5 border-b border-[#CBD5E1] dark:border-[#25314C] bg-gradient-to-r from-[#FAFBFD] via-[#FFFFFF] to-[#FFF6F8] dark:from-[#151D30] dark:via-[#121827] dark:to-[#171F33] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Showing 1 to 10 of 107 entries & Rows: [10] */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span>
            Showing <strong className="font-semibold text-[#1E293B] dark:text-[#F8FAFC]">{startRecord}</strong> to{" "}
            <strong className="font-semibold text-[#1E293B] dark:text-[#F8FAFC]">{endRecord}</strong> of{" "}
            <strong className="font-semibold text-[#1E293B] dark:text-[#F8FAFC]">{total.toLocaleString()}</strong> entries
          </span>
          <span className="hidden sm:inline text-[#CBD5E1] dark:text-[#334155]">|</span>
          <div className="flex items-center gap-1.5">
            <label htmlFor="top-table-page-limit" className="text-[#64748B] dark:text-[#94A3B8] font-medium">
              Rows:
            </label>
            <select
              id="top-table-page-limit"
              value={pageSize}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] py-1 px-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#831C35]/20 focus:border-[#831C35] dark:focus:border-[#E58A9C] cursor-pointer shadow-2xs transition-all"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE VIEW (< md) ===================== */}
      <div className="block md:hidden p-3.5 sm:p-4 space-y-3.5 bg-[#F8FAFC]/70 dark:bg-[#0E1524]/60">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`skeleton-m-${idx}`}
              className="p-4 rounded-2xl bg-white dark:bg-[#151D30] border border-[#CBD5E1]/90 dark:border-[#273656] shadow-xs space-y-3 animate-pulse"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-[#F1F5F9] dark:border-[#202B42]">
                <div className="h-5 w-24 bg-[#E2E8F0] dark:bg-[#25314C] rounded-md" />
                <div className="h-5 w-20 bg-[#E2E8F0] dark:bg-[#25314C] rounded-full" />
              </div>
              <div className="space-y-1.5 py-1">
                <div className="h-4 w-40 bg-[#E2E8F0] dark:bg-[#25314C] rounded-md" />
                <div className="h-3 w-28 bg-[#E2E8F0] dark:bg-[#25314C] rounded-md" />
              </div>
              <div className="h-8 w-full bg-[#E2E8F0] dark:bg-[#25314C] rounded-xl" />
              <div className="flex justify-between items-center pt-2 border-t border-[#F1F5F9] dark:border-[#202B42]">
                <div className="h-3 w-16 bg-[#E2E8F0] dark:bg-[#25314C] rounded-md" />
                <div className="h-5 w-28 bg-[#E2E8F0] dark:bg-[#25314C] rounded-md" />
              </div>
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="py-10 px-4 text-center rounded-2xl bg-white dark:bg-[#151D30] border border-[#CBD5E1]/90 dark:border-[#273656] shadow-xs">
            <div className="w-12 h-12 mb-3 rounded-2xl flex items-center justify-center bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
              No matching records
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="luxe-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#831C35] bg-[#831C35]/10 dark:text-[#E58A9C] dark:bg-[#E58A9C]/10 cursor-pointer shadow-xs"
            >
              <SearchX className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const { line1, line2 } = getCounterpartyDetails(tx.counterparty);
            const rowNumber = (currentPage - 1) * pageSize + idx + 1;
            const isEven = rowNumber % 2 === 0;

            return (
              <div
                key={`mob-${tx.id}`}
                id={`mob-tx-${tx.id}`}
                onClick={() => onSelectTransaction(tx)}
                className={`group relative p-4 rounded-2xl border shadow-xs hover:shadow-md hover:border-[#831C35]/50 dark:hover:border-[#E58A9C]/50 transition-all duration-150 cursor-pointer active:scale-[0.995] ${
                  isEven
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FBFDFF] to-[#FFF1F4] dark:from-[#151D30] dark:via-[#182137] dark:to-[#221A2C] border-[#CBD5E1] dark:border-[#2D3C5E]"
                    : "bg-white dark:bg-[#151D30] border-[#CBD5E1]/90 dark:border-[#273656]"
                }`}
              >
                {/* Card Header: Sequential Number, Channel Badge, and Status Badge */}
                <div className={`flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b ${
                  isEven
                    ? "border-[#F1E5EA]/80 dark:border-[#262438]"
                    : "border-[#F1F5F9] dark:border-[#202B42]"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold shrink-0 ${
                      isEven
                        ? "bg-[#831C35]/15 text-[#831C35] border border-[#831C35]/30 dark:bg-[#E58A9C]/20 dark:text-[#E58A9C] dark:border-[#E58A9C]/35"
                        : "bg-[#831C35]/10 text-[#831C35] border border-[#831C35]/20 dark:bg-[#E58A9C]/15 dark:text-[#E58A9C] dark:border-[#E58A9C]/30"
                    }`}>
                      #{rowNumber}
                    </span>
                    {renderChannelBadge(tx.channel)}
                  </div>
                  <div className="shrink-0">
                    {renderStatusBadge(tx.status)}
                  </div>
                </div>

                {/* Counterparty & Timestamp Details */}
                <div className="mb-2.5">
                  <h4 className="text-sm font-bold text-[#1E293B] dark:text-[#F8FAFC] leading-snug group-hover:text-[#831C35] dark:group-hover:text-[#E58A9C] transition-colors">
                    {line1}
                  </h4>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] truncate">
                      {line2 || formatRelativeTime(tx.date)}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B] shrink-0 font-mono">
                      {formatFullDate(tx.date).split(",")[0]}
                    </span>
                  </div>
                </div>

                {/* Transaction ID with Monospace Copy Pill */}
                <div className={`flex items-center justify-between gap-2 py-1.5 px-2.5 mb-2.5 rounded-xl border text-xs ${
                  isEven
                    ? "bg-white/90 dark:bg-[#13192B]/90 border-[#E2E8F0] dark:border-[#2B3854]"
                    : "bg-[#F8FAFC] dark:bg-[#1C253B] border-[#E2E8F0] dark:border-[#2D3A55]"
                }`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">ID</span>
                    <span className="font-mono text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] truncate select-all" title={tx.id}>
                      {tx.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(tx.id, e)}
                    title="Copy full transaction ID"
                    aria-label={`Copy transaction ID ${tx.id}`}
                    className="p-1 rounded-md text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#E58A9C] hover:bg-white dark:hover:bg-[#25334D] transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedId === tx.id ? (
                      <Check className="w-3.5 h-3.5 text-[#16805C] dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Card Footer: Amount & View Audit Detail */}
                <div className={`flex items-center justify-between pt-2.5 border-t ${
                  isEven
                    ? "border-[#F1E5EA]/80 dark:border-[#262438]"
                    : "border-[#F1F5F9] dark:border-[#202B42]"
                }`}>
                  <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                    Settled Amount
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-[#1E293B] dark:text-[#FFFFFF] tracking-tight">
                      {formatAmount(tx.amount, tx.currency)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#831C35] dark:group-hover:text-[#E58A9C] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===================== DESKTOP VIEW (>= md) ===================== */}
      <div className="hidden md:block overflow-x-auto min-w-full">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-[#334155] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-xs font-bold text-white shadow-xs">
              <th scope="col" className="py-3.5 px-2 text-center w-10 font-bold text-[11px] text-white/90 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 whitespace-nowrap text-white font-bold text-[11px] uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 whitespace-nowrap text-white font-bold text-[11px] uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 text-white font-bold text-[11px] uppercase tracking-wider">
                Counterparty
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 text-right whitespace-nowrap text-white font-bold text-[11px] uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 text-center whitespace-nowrap text-white font-bold text-[11px] uppercase tracking-wider">
                Channel
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 text-center whitespace-nowrap text-white font-bold text-[11px] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="py-3.5 px-2.5 lg:px-3.5 text-right whitespace-nowrap text-white font-bold text-[11px] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-sm">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className={`animate-pulse ${idx % 2 === 0 ? "bg-white dark:bg-[#13192A]" : "bg-gradient-to-r from-[#FAFBFD] to-[#F8F9FB] dark:from-[#0F1422] dark:to-[#111726]"}`}>
                  <td className="py-3.5 px-2 text-center">
                    <div className="h-5 w-6 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-md mx-auto" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5">
                    <div className="h-4 w-28 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-md" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5">
                    <div className="h-4 w-20 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-md" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5">
                    <div className="h-4 w-32 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-md" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5 text-right">
                    <div className="h-4 w-20 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-md ml-auto" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5 text-center">
                    <div className="h-6 w-20 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-full mx-auto" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5 text-center">
                    <div className="h-6 w-20 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-full mx-auto" />
                  </td>
                  <td className="py-3.5 px-2.5 lg:px-3.5 text-right">
                    <div className="h-6 w-12 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              // Clean Empty state
              <tr>
                <td colSpan={8} className="py-16 px-4 text-center bg-white dark:bg-[#13192A]">
                  <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                    <div className="w-14 h-14 mb-3.5 rounded-2xl flex items-center justify-center bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]">
                      <Inbox className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
                      No matching transactions found
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 mb-4 leading-relaxed">
                      No records matched your search query or filter parameters. Try adjusting or clearing your criteria.
                    </p>
                    <button
                      id="btn-empty-reset"
                      type="button"
                      onClick={onResetFilters}
                      className="luxe-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#831C35] dark:text-[#E58A9C] bg-[#831C35]/10 dark:bg-[#E58A9C]/15 hover:bg-[#831C35]/15 dark:hover:bg-[#E58A9C]/25 transition-all cursor-pointer shadow-2xs"
                    >
                      <SearchX className="w-3.5 h-3.5" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              // Actual Transaction Rows with Pair / Odd differentiation
              transactions.map((tx, idx) => {
                const { line1, line2 } = getCounterpartyDetails(tx.counterparty);
                const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                const isPair = idx % 2 === 0;

                return (
                  <tr
                    key={tx.id}
                    id={`tx-row-${tx.id}`}
                    onClick={() => onSelectTransaction(tx)}
                    className={`relative transition-all duration-150 cursor-pointer group ${
                      isPair ? "bg-white dark:bg-[#13192A]" : "bg-gradient-to-r from-[#FAFBFD] to-[#F8F9FB] dark:from-[#0F1422] dark:to-[#111726]"
                    } hover:bg-gradient-to-r hover:from-[#FFF6F8] hover:to-[#FFF0F3] dark:hover:from-[#231A28] dark:hover:to-[#1B1D36]`}
                  >
                    {/* First Column: Sequential Row Index */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-md font-mono text-[11px] font-bold bg-gradient-to-br from-[#4A0815] to-[#831C35] text-white shadow-2xs border border-white/20">
                        {rowNumber}
                      </span>
                    </td>

                    {/* Transaction ID: Only tx_... string with Copy */}
                    <td className="py-3 px-2.5 lg:px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-mono text-xs font-medium text-[#1E293B] dark:text-[#F8FAFC] select-all tracking-tight"
                          title={`Transaction ID: ${tx.id}`}
                        >
                          {tx.id}
                        </span>
                        <button
                          id={`btn-copy-${tx.id}`}
                          type="button"
                          onClick={(e) => handleCopy(tx.id, e)}
                          title="Copy transaction ID"
                          aria-label={`Copy transaction ID ${tx.id}`}
                          className="p-1 rounded text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#E58A9C] hover:bg-[#F1F5F9] dark:hover:bg-[#25334D] transition-colors cursor-pointer shrink-0"
                        >
                          {copiedId === tx.id ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16805C] dark:text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Copied</span>
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-2.5 lg:px-3.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#1E293B] dark:text-[#F8FAFC]">
                          {formatRelativeTime(tx.date)}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B]" title={tx.date}>
                          {formatFullDate(tx.date)}
                        </span>
                      </div>
                    </td>

                    {/* Counterparty: Clean 2-line display without abbreviation */}
                    <td className="py-3 px-2.5 lg:px-3.5">
                      <div className="flex flex-col min-w-[130px] max-w-[220px]">
                        <span
                          className="text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] leading-snug"
                          title={tx.counterparty}
                        >
                          {line1}
                        </span>
                        {line2 && (
                          <span
                            className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5"
                            title={tx.counterparty}
                          >
                            {line2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-2.5 lg:px-3.5 whitespace-nowrap text-right">
                      <span className="font-mono text-xs lg:text-sm font-bold tracking-tight text-[#1E293B] dark:text-[#FFFFFF]">
                        {formatAmount(tx.amount, tx.currency)}
                      </span>
                    </td>

                    {/* Channel */}
                    <td className="py-3 px-2.5 lg:px-3.5 whitespace-nowrap text-center">
                      {renderChannelBadge(tx.channel)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-2.5 lg:px-3.5 whitespace-nowrap text-center">
                      {renderStatusBadge(tx.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-2.5 lg:px-3.5 whitespace-nowrap text-right">
                      <button
                        id={`btn-view-${tx.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        aria-label={`View audit details for ${tx.id}`}
                        className="luxe-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#831C35] dark:text-[#E58A9C] bg-[#831C35]/10 dark:bg-[#E58A9C]/15 hover:bg-gradient-to-r hover:from-[#690E22] hover:via-[#831C35] hover:to-[#A42544] hover:text-white dark:hover:text-white border border-[#831C35]/20 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
