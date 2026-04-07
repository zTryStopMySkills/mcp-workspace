"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { IALoadingDots } from "./IALoadingDots";

interface IAResponseBlockProps {
  text: string;
  isStreaming?: boolean;
  compact?: boolean;
  extraActions?: React.ReactNode;
}

export function IAResponseBlock({ text, isStreaming, compact, extraActions }: IAResponseBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!text && isStreaming) {
    return <IALoadingDots />;
  }

  if (!text) return null;

  return (
    <div className={`relative group rounded-xl border border-[#00D4AA]/20 bg-[#00D4AA]/5 ${compact ? "p-3" : "p-4"}`}>
      {/* Teal left accent */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-[#00D4AA]/40" />

      <div className={`pl-3 ${compact ? "text-xs" : "text-sm"} text-slate-200 leading-relaxed whitespace-pre-wrap`}>
        {text}
        {isStreaming && (
          <span className="inline-block w-0.5 h-4 ml-0.5 bg-[#00D4AA] animate-pulse align-middle" />
        )}
      </div>

      {!isStreaming && text && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/8">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-[#8B95A9] hover:text-[#00D4AA] transition-colors"
          >
            {copied ? <Check size={13} className="text-[#00D4AA]" /> : <Copy size={13} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          {extraActions}
        </div>
      )}
    </div>
  );
}
