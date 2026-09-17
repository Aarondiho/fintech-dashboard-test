import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "./components/Header";
import { CosmicBackground } from "./components/CosmicBackground";
import { SummaryCards } from "./components/SummaryCards";
import { VolumeTrendChart } from "./components/VolumeTrendChart";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { PaginationControls } from "./components/PaginationControls";
import { ErrorBanner } from "./components/ErrorBanner";
import { TransactionModal } from "./components/TransactionModal";
import {
  Transaction,
  TransactionSummary,
  PaginationMetadata,
  FilterState,
  PaginatedTransactionsResponse,
  TimeRange,
} from "./types";

export default function App() {
  // Theme state: default to clean light background
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("fintech_theme_mode");
    if (saved === "dark") {
      localStorage.setItem("fintech_theme_mode", "light");
      return false;
    }
    return false;
  });

  // Apply dark mode class and data-theme attribute to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("fintech_theme_mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("fintech_theme_mode", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<FilterState>(() => {
    const params = new URLSearchParams(window.location.search);
    const rawTimeRange = params.get("timeRange") || params.get("range");
    const validTimeRange: TimeRange =
      rawTimeRange === "7D" || rawTimeRange === "30D" ? rawTimeRange : "ALL";

    return {
      search: params.get("search") || "",
      status: params.get("status") || "ALL",
      channel: params.get("channel") || "ALL",
      currency: params.get("currency") || "ALL",
      timeRange: validTimeRange,
      page: parseInt(params.get("page") || "1", 10) || 1,
      limit: parseInt(params.get("limit") || "10", 10) || 10,
    };
  });

  // Synchronize URL query params whenever filters change
  const updateUrlParams = useCallback((currentFilters: FilterState) => {
    const params = new URLSearchParams();
    if (currentFilters.search) params.set("search", currentFilters.search);
    if (currentFilters.status && currentFilters.status !== "ALL")
      params.set("status", currentFilters.status);
    if (currentFilters.channel && currentFilters.channel !== "ALL")
      params.set("channel", currentFilters.channel);
    if (currentFilters.currency && currentFilters.currency !== "ALL")
      params.set("currency", currentFilters.currency);
    if (currentFilters.timeRange && currentFilters.timeRange !== "ALL")
      params.set("timeRange", currentFilters.timeRange);
    if (currentFilters.page > 1) params.set("page", currentFilters.page.toString());
    if (currentFilters.limit !== 10) params.set("limit", currentFilters.limit.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const rawTimeRange = params.get("timeRange") || params.get("range");
      const validTimeRange: TimeRange =
        rawTimeRange === "7D" || rawTimeRange === "30D" ? rawTimeRange : "ALL";

      setFilters({
        search: params.get("search") || "",
        status: params.get("status") || "ALL",
        channel: params.get("channel") || "ALL",
        currency: params.get("currency") || "ALL",
        timeRange: validTimeRange,
        page: parseInt(params.get("page") || "1", 10) || 1,
        limit: parseInt(params.get("limit") || "10", 10) || 10,
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // API Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total_records: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const [summary, setSummary] = useState<TransactionSummary | null>(null);

  // Status & Loading Flags
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [simulateError, setSimulateError] = useState<boolean>(false);

  // Detail Modal State
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Fetch transactions and summary from server
  const fetchData = useCallback(
    async (currentFilters: FilterState, isRetry = false) => {
      if (isRetry) setIsRetrying(true);
      setIsLoading(true);
      setIsSummaryLoading(true);
      updateUrlParams(currentFilters);

      try {
        // If error simulation is enabled by user to test offline requirement
        if (simulateError) {
          throw new Error("HTTP 503: Simulated upstream network gateway timeout (API offline test mode).");
        }

        const effectiveTimeRange = currentFilters.timeRange || "7D";

        const queryParams = new URLSearchParams({
          page: currentFilters.page.toString(),
          limit: currentFilters.limit.toString(),
          status: currentFilters.status,
          channel: currentFilters.channel,
          currency: currentFilters.currency,
          search: currentFilters.search,
          timeRange: effectiveTimeRange,
        });

        // 1. Fetch Paginated Transactions
        const txPromise = fetch(`/api/transactions?${queryParams.toString()}`);

        // 2. Fetch Aggregated Summary
        const summaryQueryParams = new URLSearchParams({
          status: currentFilters.status,
          channel: currentFilters.channel,
          currency: currentFilters.currency,
          search: currentFilters.search,
          timeRange: effectiveTimeRange,
        });
        const summaryPromise = fetch(`/api/transactions/summary?${summaryQueryParams.toString()}`);

        const [txRes, summaryRes] = await Promise.all([txPromise, summaryPromise]);

        if (!txRes.ok) {
          throw new Error(`Failed to fetch transactions (HTTP ${txRes.status}: ${txRes.statusText})`);
        }
        if (!summaryRes.ok) {
          throw new Error(`Failed to fetch summary metrics (HTTP ${summaryRes.status}: ${summaryRes.statusText})`);
        }

        const txData: PaginatedTransactionsResponse = await txRes.json();
        const summaryData: TransactionSummary = await summaryRes.json();

        setTransactions(txData.data);
        setPagination(txData.pagination);
        setSummary(summaryData);
        setErrorMessage(null);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setErrorMessage(err.message || "An unexpected network error occurred while reaching the transaction ledger.");
      } finally {
        setIsLoading(false);
        setIsSummaryLoading(false);
        setIsRetrying(false);
      }
    },
    [simulateError, updateUrlParams]
  );

  // Trigger fetch when filters or simulateError changes
  useEffect(() => {
    fetchData(filters);
  }, [filters, simulateError, fetchData]);

  // Handler for filter updates
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Handler for resetting filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      channel: "ALL",
      currency: "ALL",
      timeRange: "ALL",
      page: 1,
      limit: filters.limit,
    });
  };

  // Handler to export current filtered view as CSV
  const handleExportCsv = async () => {
    try {
      // Fetch all records under current filter (up to 1000)
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "1000",
        status: filters.status,
        channel: filters.channel,
        currency: filters.currency,
        search: filters.search,
        timeRange: filters.timeRange || "ALL",
      });

      const res = await fetch(`/api/transactions?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Could not export transactions");
      const data: PaginatedTransactionsResponse = await res.json();

      const headers = ["ID", "Date", "Amount", "Currency", "Status", "Channel", "Counterparty"];
      const rows = data.data.map((t) => [
        `"${t.id}"`,
        `"${t.date}"`,
        t.amount,
        `"${t.currency}"`,
        `"${t.status}"`,
        `"${t.channel}"`,
        `"${t.counterparty.replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `fintech_transactions_${filters.timeRange || "7D"}_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert("Error exporting CSV: " + err.message);
    }
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.status !== "ALL" ? 1 : 0) +
    (filters.channel !== "ALL" ? 1 : 0) +
    (filters.currency !== "ALL" ? 1 : 0) +
    (filters.timeRange && filters.timeRange !== "7D" ? 1 : 0);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Cosmic Nebula & Particle Canvas */}
      <CosmicBackground darkMode={darkMode} />

      {/* Top Navigation Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onRefresh={() => fetchData(filters)}
        isRefreshing={isLoading}
        simulateError={simulateError}
        onToggleSimulateError={() => setSimulateError((prev) => !prev)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Dashboard Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Banner / Toast for API Disruption */}
        <ErrorBanner
          message={errorMessage}
          onRetry={() => fetchData(filters, true)}
          onDismiss={() => setErrorMessage(null)}
          isRetrying={isRetrying}
        />

        {/* Dynamic Summary Cards Header */}
        <SummaryCards
          summary={summary}
          isLoading={isSummaryLoading}
          activeFilterCount={activeFilterCount}
          timeRange={filters.timeRange || "7D"}
        />

        {/* Interactive Settlement Velocity & Volume Chart */}
        <VolumeTrendChart
          summary={summary}
          isLoading={isSummaryLoading}
          currency={filters.currency === "ALL" ? "USD" : filters.currency}
          timeRange={filters.timeRange || "7D"}
          onTimeRangeChange={(newRange) => handleFilterChange({ timeRange: newRange, page: 1 })}
        />

        {/* Search & Filter Controls */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isDebouncing={isDebouncing}
          totalFilteredRecords={pagination.total_records}
        />

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          onResetFilters={handleResetFilters}
          currentPage={pagination.page}
          pageSize={pagination.limit}
          totalRecords={pagination.total_records}
          onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit, page: 1 })}
        />

        {/* Pagination Controls */}
        {transactions.length > 0 && (
          <PaginationControls
            pagination={pagination}
            onPageChange={(newPage) => handleFilterChange({ page: newPage })}
            onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit, page: 1 })}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Audit Detail Modal Drawer */}
      <TransactionModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
