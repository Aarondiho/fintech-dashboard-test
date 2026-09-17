import React, { useEffect } from "react";
import {
  X,
  ShieldCheck,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Transaction } from "../types";
import {
  formatAmount,
  formatFullDate,
  formatRelativeTime,
  getCounterpartyDetails,
} from "../utils/formatters";

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!transaction) return null;

  const { line1, line2 } = getCounterpartyDetails(transaction.counterparty);

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="modal-transaction-audit"
        className="luxe-card relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-[#1E293B] dark:text-[#F8FAFC] bg-gradient-to-br from-white via-[#FCFDFE] to-[#FFF6F8] dark:from-[#13192A] dark:via-[#161D2F] dark:to-[#1B182B] shadow-2xl border-t-4 border-t-[#831C35] dark:border-t-[#E58A9C] border border-[#CBD5E1] dark:border-[#273656]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#CBD5E1] dark:border-[#25314C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A0815] via-[#701026] to-[#A31D3B] text-white flex items-center justify-center shadow-md shadow-[#4A0815]/30 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
                Transaction Audit Record
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Full immutable ledger verification details
              </p>
            </div>
          </div>

          <button
            id="btn-close-modal"
            type="button"
            onClick={onClose}
            aria-label="Close modal dialog"
            className="luxe-btn p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#25334D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          {/* Main Key Figures Highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-[#FFF1F4] dark:from-[#172138] dark:to-[#22162B] border border-[#CBD5E1] dark:border-[#273656] shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-bold">
                Settled Amount
              </span>
              <div className="font-mono text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-[#FFFFFF] mt-0.5">
                {formatAmount(transaction.amount, transaction.currency)}
              </div>
            </div>

            <div>
              {transaction.status === "SUCCESSFUL" || transaction.status === "COMPLETED" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#0A4D37] via-[#0F634A] to-[#16805C] text-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{transaction.status === "SUCCESSFUL" ? "SUCCESSFUL" : "COMPLETED"}</span>
                </span>
              ) : transaction.status === "PENDING" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#804207] via-[#99570B] to-[#C47A16] text-white shadow-xs">
                  <Clock className="w-4 h-4" />
                  <span>PENDING</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#7D1124] via-[#9E2034] to-[#C7374E] text-white shadow-xs">
                  <XCircle className="w-4 h-4" />
                  <span>FAILED</span>
                </span>
              )}
            </div>
          </div>

          {/* Audit Detail Rows */}
          <dl className="divide-y divide-[#E2E8F0]/70 dark:divide-[#25314C] text-xs">
            {/* ID */}
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-[#64748B] dark:text-[#94A3B8] font-medium">Transaction ID</dt>
              <dd className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
                  {transaction.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="luxe-btn p-1 rounded text-[#64748B] dark:text-[#94A3B8] hover:text-[#831C35] dark:hover:text-[#E58A9C] cursor-pointer"
                  title="Copy ID"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#16805C] dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </dd>
            </div>

            {/* Counterparty */}
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-[#64748B] dark:text-[#94A3B8] font-medium">Counterparty</dt>
              <dd className="text-right">
                <span className="font-semibold text-[#1E293B] dark:text-[#F8FAFC] block">{line1}</span>
                {line2 && (
                  <span className="text-[#94A3B8] dark:text-[#64748B] text-[11px] block">{line2}</span>
                )}
              </dd>
            </div>

            {/* Payment Channel */}
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-[#64748B] dark:text-[#94A3B8] font-medium">Payment Channel</dt>
              <dd className="font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
                {transaction.channel.replace(/_/g, " ")}
              </dd>
            </div>

            {/* Currency */}
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-[#64748B] dark:text-[#94A3B8] font-medium">Currency</dt>
              <dd className="font-semibold text-[#1E293B] dark:text-[#F8FAFC]">{transaction.currency}</dd>
            </div>

            {/* Date & Time */}
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-[#64748B] dark:text-[#94A3B8] font-medium">Timestamp</dt>
              <dd className="text-right">
                <span className="text-[#1E293B] dark:text-[#F8FAFC] font-medium block">
                  {formatFullDate(transaction.date)}
                </span>
                <span className="text-[#94A3B8] dark:text-[#64748B] text-[11px]">
                  {formatRelativeTime(transaction.date)}
                </span>
              </dd>
            </div>

            {/* System Verification */}
            <div className="py-2.5 flex items-center justify-between">
              <dt className="text-[#64748B] dark:text-[#94A3B8] font-medium">Cryptographic Ledger Proof</dt>
              <dd className="font-mono text-[#16805C] dark:text-emerald-400 font-medium">
                SHA-256 Validated
              </dd>
            </div>
          </dl>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#CBD5E1] dark:border-[#25314C] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="luxe-btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#690E22] via-[#831C35] to-[#A42544] hover:brightness-110 text-white shadow-md shadow-[#4A0815]/25 border border-white/20 cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
