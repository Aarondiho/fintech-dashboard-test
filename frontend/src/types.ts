export type TransactionStatus = "SUCCESSFUL" | "COMPLETED" | "PENDING" | "FAILED";
export type TransactionChannel = "MOBILE_MONEY" | "CARD" | "BANK_TRANSFER";
export type CurrencyCode = "USD" | "BIF";
export type TimeRange = "7D" | "30D" | "ALL";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  channel: TransactionChannel;
  counterparty: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedTransactionsResponse {
  data: Transaction[];
  pagination: PaginationMetadata;
}

export interface TrendPoint {
  label: string;
  date: string;
  full_date: string;
  volume_usd: number;
  volume_bif: number;
  amount: number;
  txs: number;
  completed_txs: number;
}

export interface StatusBreakdownItem {
  count: number;
  volume_by_currency: {
    USD: number;
    BIF: number;
  };
  formatted: {
    USD: string;
    BIF: string;
  };
}

export interface TransactionSummary {
  total_count: number;
  successful_count?: number;
  completed_count: number;
  pending_count: number;
  failed_count: number;
  success_rate_percentage: number;
  time_range?: TimeRange;
  total_volume_by_currency: {
    USD: number;
    BIF: number;
    [key: string]: number;
  };
  formatted_volumes: {
    USD: string;
    BIF: string;
    [key: string]: string;
  };
  status_breakdown?: {
    SUCCESSFUL?: StatusBreakdownItem;
    PENDING?: StatusBreakdownItem;
    FAILED?: StatusBreakdownItem;
    [key: string]: StatusBreakdownItem | undefined;
  };
  total_volume_usd_cents: number;
  total_volume_bif: number;
  trend_points?: TrendPoint[];
}

export interface FilterState {
  search: string;
  status: string;
  channel: string;
  currency: string;
  timeRange: TimeRange;
  page: number;
  limit: number;
}
