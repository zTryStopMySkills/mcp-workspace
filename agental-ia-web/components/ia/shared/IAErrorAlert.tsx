"use client";

import { AlertCircle } from "lucide-react";

interface IAErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function IAErrorAlert({ message, onRetry }: IAErrorAlertProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs underline hover:no-underline opacity-80 hover:opacity-100"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
