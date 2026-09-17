import React from "react";
import {
  Building,
  RotateCw,
  Sun,
  Moon,
  Download,
  AlertTriangle,
  ShieldCheck,
  Package,
} from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  simulateError: boolean;
  onToggleSimulateError: () => void;
  onExportCsv: () => void;
  isExporting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onRefresh,
  isRefreshing,
  simulateError,
  onToggleSimulateError,
  onExportCsv,
  isExporting = false,
}) => {
  return (
    <header
      id="main-navbar"
      className="relative z-20 w-full border-t-2 border-t-[#831C35] dark:border-t-[#E58A9C] border-b border-[#CBD5E1] dark:border-[#273656] shadow-sm bg-gradient-to-r from-white via-[#F8FAFD] to-[#FCEDF2] dark:from-[#0D1424] dark:via-[#131A2D] dark:to-[#1F1526] transition-colors duration-200"
    >
      {/* Subtle top edge glow */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#831C35]/30 dark:via-[#E58A9C]/40 to-transparent" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-64 h-24 bg-[#831C35]/10 dark:bg-[#E58A9C]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* ==================== LEFT: BRAND / LOGO ==================== */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* App Icon */}
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#4A0815] via-[#701026] to-[#A31D3B] text-white shadow-md shadow-[#4A0815]/30 border border-white/25 shrink-0">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Mobile View: Clean native app abbreviation */}
            <div className="flex md:hidden items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#1E293B] dark:text-[#F8FAFC]">
                TRD
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* Desktop View: Full descriptive title & status */}
            <div className="hidden md:block">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[#1E293B] dark:text-[#F8FAFC]">
                  Transaction Reporting
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2 mt-0.5 font-medium">
                <span>Enterprise Settlement & Audit Dashboard</span>
                <span className="text-[#831C35] dark:text-[#E58A9C]">•</span>
                <span className="flex items-center gap-1 text-[#475569] dark:text-[#CBD5E1]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#831C35] dark:text-[#E58A9C]" /> 650 Indexed Records
                </span>
              </p>
            </div>
          </div>

          {/* ==================== RIGHT: CONTROLS & ACTIONS ==================== */}
          <div className="flex items-center gap-1.5 sm:gap-2">
           

      

            {/* Refresh Button */}
            <button
              id="btn-refresh-data"
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh ledger state"
              className="luxe-btn inline-flex items-center justify-center p-2 rounded-xl text-xs font-medium border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#25334D] text-[#334155] dark:text-[#F8FAFC] hover:border-[#831C35]/30 dark:hover:border-[#E58A9C]/40 shadow-2xs cursor-pointer disabled:opacity-50 transition-all"
            >
              <RotateCw className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] ${isRefreshing ? "animate-spin text-[#831C35] dark:text-[#E58A9C]" : ""}`} />
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              id="btn-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle dark / light mode"
              className="luxe-btn inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#25334D] text-[#334155] dark:text-[#F8FAFC] hover:border-[#831C35]/30 dark:hover:border-[#E58A9C]/40 shadow-2xs cursor-pointer transition-all"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-[#FBBF24]" />
                  <span className="hidden sm:inline text-xs font-semibold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#831C35]" />
                  <span className="hidden sm:inline text-xs font-semibold">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
