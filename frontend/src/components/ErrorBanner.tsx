import React from "react";
import { AlertCircle, RotateCw, X } from "lucide-react";

interface ErrorBannerProps {
  message: string | null;
  onRetry: () => void;
  onDismiss: () => void;
  isRetrying?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onDismiss,
  isRetrying = false,
}) => {
  if (!message) return null;

  return (
    <div
      id="banner-api-error"
      role="alert"
      className="relative z-30 mb-6 rounded-2xl border p-4 bg-[#C7374E]/10 border-[#C7374E]/30 text-[#1E293B] dark:bg-[#C7374E]/20 dark:border-[#C7374E]/40 dark:text-[#F8FAFC] shadow-xs transition-all animate-in fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-[#C7374E]/15 text-[#C7374E] dark:text-[#E04B63] shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#C7374E] dark:text-[#E04B63]">
              Unable to load transactions
            </h4>
            <p className="text-xs mt-0.5 text-[#64748B] dark:text-[#94A3B8]">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-retry-api"
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="luxe-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C7374E] hover:bg-[#9F2945] text-white shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Retrying..." : "Retry"}</span>
          </button>
          <button
            id="btn-dismiss-error"
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error banner"
            className="luxe-btn p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
