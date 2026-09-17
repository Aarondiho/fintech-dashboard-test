import { TransactionChannel, TransactionStatus } from "../types";

/**
 * Format currency amounts according to lowest subunits:
 * USD is in cents (divide by 100).
 * BIF is an integer currency (no fractional cents).
 */
export function formatAmount(amount: number, currency: string): string {
  if (currency === "USD") {
    const dollars = amount / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  }

  if (currency === "BIF") {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(amount)} BIF`;
  }

  return `${amount.toLocaleString()} ${currency}`;
}

/**
 * Format full date and time in a clean ISO/UTC/local format
 */
export function formatFullDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

/**
 * Relative time helper (e.g. "12m ago", "3h ago", "2d ago")
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const now = Date.now();
    const d = new Date(isoString).getTime();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400)}d ago`;
    return formatFullDate(isoString);
  } catch {
    return isoString;
  }
}

/**
 * Helper to get clean 2-line display for counterparty column:
 * Removes abbreviation and displays full name cleanly in 2 lines
 * (primary name on top, and next name / secondary details under it).
 */
export interface CounterpartyLines {
  line1: string;
  line2: string;
  fullName: string;
}

export function formatCounterpartyLines(counterparty: string): CounterpartyLines {
  if (!counterparty) {
    return { line1: "—", line2: "", fullName: "" };
  }

  const raw = counterparty.trim();

  // 1. If counterparty contains parenthesis content like phone number or branch/ticker:
  // e.g. "David O'Connor (+353 1 496 0122)" or "Banque Commerciale du Burundi (BANCOBU)"
  const parenMatch = raw.match(/^(.*?)\s*(\([^\)]+\))$/);
  if (parenMatch) {
    const main = parenMatch[1].trim();
    const sub = parenMatch[2].trim();
    return {
      line1: main || raw,
      line2: sub,
      fullName: raw,
    };
  }

  // 2. Multi-word string without parentheses:
  const words = raw.split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return {
      line1: raw,
      line2: "",
      fullName: raw,
    };
  }

  if (words.length === 2) {
    // 2-word name: first name up, next name under it
    return {
      line1: words[0],
      line2: words[1],
      fullName: raw,
    };
  }

  // Check if there is an agent/tag marker like '#1042'
  const hashIdx = words.findIndex((w) => w.startsWith("#"));
  if (hashIdx > 0) {
    return {
      line1: words.slice(0, hashIdx).join(" "),
      line2: words.slice(hashIdx).join(" "),
      fullName: raw,
    };
  }

  // 3+ words: split balanced across 2 lines (e.g. "Standard Chartered" / "Clearing NYC")
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
    fullName: raw,
  };
}

/**
 * Helper to get display info from counterparty
 */
export function getCounterpartyDetails(counterparty: string): {
  name: string;
  contact: string;
  initials: string;
  line1: string;
  line2: string;
} {
  const lines = formatCounterpartyLines(counterparty);
  const match = counterparty.match(/^(.*?)\s*(\([+0-9\s-]+\))?$/);
  const name = match ? match[1].trim() : counterparty;
  const contact = match && match[2] ? match[2].replace(/[()]/g, "").trim() : "";

  const parts = name.split(" ").filter(Boolean);
  let initials = "TX";
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase();
  }

  return { name, contact, initials, line1: lines.line1, line2: lines.line2 };
}
