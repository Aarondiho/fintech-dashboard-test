import React from "react";
import {
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { TransactionSummary, TimeRange } from "../types";

interface SummaryCardsProps {
  summary: TransactionSummary | null;
  isLoading: boolean;
  activeFilterCount: number;
  timeRange?: TimeRange;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  isLoading,
  activeFilterCount,
  timeRange = "ALL",
}) => {
  const successRate = summary?.success_rate_percentage ?? 0;
  const totalCount = summary?.total_count ?? 0;
  const successfulCount = summary?.successful_count ?? summary?.completed_count ?? 0;
  const pendingCount = summary?.pending_count ?? 0;
  const failedCount = summary?.failed_count ?? 0;

  const formattedUsd = summary?.formatted_volumes?.USD ?? "$0.00";
  const formattedBif = summary?.formatted_volumes?.BIF ?? "0 BIF";

  const timeRangeLabel =
    timeRange === "7D" ? "Past 7 Days" : timeRange === "30D" ? "Past 30 Days" : "All Time";

  return (
    <section aria-label="Transaction performance summary" className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
      {/* Metric 1: HERO KPI CARD - Solid Deep Imperial Ruby Gradient */}
      <div
        id="card-summary-volume"
        className="solid-gradient-ruby p-6 flex flex-col justify-between"
      >
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white shadow-xs flex items-center justify-center border border-white/25 backdrop-blur-xs">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Total Volume
              </span>
              <p className="text-xs text-white/70 font-medium">
                {timeRangeLabel} settlement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/25 shadow-2xs">
              {timeRange}
            </span>
            {activeFilterCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                Filtered
              </span>
            ) : (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20">
                Live Net
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-9 w-44 bg-white/20 rounded-xl animate-pulse" />
            <div className="h-5 w-32 bg-white/15 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-2.5">
                <span className="kpi-value text-white drop-shadow-xs">
                  {formattedUsd}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30">
                  USD
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-semibold text-rose-100 font-mono">
                  {formattedBif}
                </span>
                <span className="text-xs font-medium text-white/70">
                  BIF
                </span>
              </div>
            </div>

            {/* Sparkline visual accent */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-rose-200" />
                Dual-Currency Ledger
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-200 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
                Settled
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Metric 2: Success Rate Card - Solid Deep Emerald Forest Gradient */}
      <div
        id="card-summary-success-rate"
        className="solid-gradient-emerald p-6 flex flex-col justify-between"
      >
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white border border-white/25 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Success Rate
              </span>
              <p className="text-xs text-white/70 font-medium">
                Successful vs total
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
              successRate >= 70
                ? "bg-emerald-400/20 text-emerald-100 border-emerald-300/40"
                : successRate >= 50
                ? "bg-amber-400/20 text-amber-100 border-amber-300/40"
                : "bg-rose-400/20 text-rose-100 border-rose-300/40"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{successRate >= 70 ? "Healthy" : "Needs Review"}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-9 w-28 bg-white/20 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-white/15 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-baseline gap-2.5">
              <span className="kpi-value text-white drop-shadow-xs">
                {successRate.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-emerald-100/90">
                ({successfulCount} of {totalCount} successful)
              </span>
            </div>

            {/* Visual Multi-Segment Gauge Bar */}
            <div className="mt-4 w-full h-2.5 rounded-full bg-black/30 overflow-hidden flex border border-white/10 shadow-inner">
              <div
                className="h-full bg-emerald-400 transition-all duration-500 shadow-xs"
                style={{ width: `${totalCount > 0 ? (successfulCount / totalCount) * 100 : 0}%` }}
                title={`Successful: ${successfulCount}`}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (pendingCount / totalCount) * 100 : 0}%` }}
                title={`Pending: ${pendingCount}`}
              />
              <div
                className="h-full bg-rose-400 transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (failedCount / totalCount) * 100 : 0}%` }}
                title={`Failed: ${failedCount}`}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-200" title={summary?.status_breakdown?.SUCCESSFUL ? `Vol: ${summary.status_breakdown.SUCCESSFUL.formatted.USD} / ${summary.status_breakdown.SUCCESSFUL.formatted.BIF}` : undefined}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>{successfulCount} ok</span>
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-200" title={summary?.status_breakdown?.PENDING ? `Vol: ${summary.status_breakdown.PENDING.formatted.USD} / ${summary.status_breakdown.PENDING.formatted.BIF}` : undefined}>
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>{pendingCount} pend</span>
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-rose-200" title={summary?.status_breakdown?.FAILED ? `Vol: ${summary.status_breakdown.FAILED.formatted.USD} / ${summary.status_breakdown.FAILED.formatted.BIF}` : undefined}>
                <XCircle className="w-3.5 h-3.5 text-rose-300" />
                <span>{failedCount} fail</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Metric 3: Total Records Card - Solid Midnight Sapphire Gradient */}
      <div
        id="card-summary-total-count"
        className="solid-gradient-sapphire p-6 flex flex-col justify-between"
      >
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white border border-white/25 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Total Records
              </span>
              <p className="text-xs text-white/70 font-medium">
                Enterprise ledger audit
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/25 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
            Audited
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-9 w-24 bg-white/20 rounded-xl animate-pulse" />
            <div className="h-4 w-36 bg-white/15 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="kpi-value text-white drop-shadow-xs">
                {totalCount.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-blue-100/80">
                entries indexed
              </span>
            </div>

            <p className="text-xs text-white/80 mt-2 font-medium">
              {activeFilterCount > 0
                ? "Showing filtered record subset"
                : "Complete enterprise ledger dataset"}
            </p>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1 font-medium">
                <Percent className="w-3 h-3 text-sky-300" />
                Active Filters: <strong className="font-bold text-white ml-0.5">{activeFilterCount}</strong>
              </span>
              <span className="text-sky-200 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                100% In Sync
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
