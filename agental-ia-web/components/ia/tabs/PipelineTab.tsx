"use client";

import { useState } from "react";
import { BarChart3, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { IAErrorAlert } from "../shared/IAErrorAlert";
import { IALoadingDots } from "../shared/IALoadingDots";
import type { PipelineAnalysisResponse, ScoredQuotation } from "@/types/ia";

export function PipelineTab() {
  const [analysis, setAnalysis] = useState<PipelineAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/ia/pipeline", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error analizando pipeline");
      setAnalysis(data as PipelineAnalysisResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-[#00D4AA] bg-[#00D4AA]/15 border-[#00D4AA]/30";
    if (score >= 5) return "text-amber-400 bg-amber-400/15 border-amber-400/30";
    return "text-red-400 bg-red-400/15 border-red-400/30";
  };

  return (
    <div className="space-y-5">
      {/* Header + trigger */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <BarChart3 size={16} className="text-[#00D4AA]" />
              Análisis de pipeline con IA
            </h3>
            <p className="text-xs text-slate-400">
              Evalúa cada propuesta abierta y detecta las de mayor probabilidad de cierre.
            </p>
          </div>
          <Link
            href="/tarificador/pipeline"
            className="shrink-0 text-xs text-slate-400 hover:text-[#00D4AA] flex items-center gap-1 transition-colors"
          >
            <ExternalLink size={12} />
            Ver Kanban
          </Link>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="mt-4 w-full py-2.5 rounded-xl bg-[#00D4AA] text-black text-sm font-semibold hover:bg-[#2DD4BF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <BarChart3 size={15} />
          {isLoading ? "Analizando..." : analysis ? "Actualizar análisis" : "Analizar pipeline"}
        </button>
      </div>

      {error && <IAErrorAlert message={error} onRetry={handleAnalyze} />}
      {isLoading && <SkeletonList />}

      {analysis && !isLoading && (
        <>
          {/* Scored quotations */}
          <div className="space-y-2">
            {analysis.quotations.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No hay propuestas abiertas para analizar.</p>
            ) : (
              analysis.quotations
                .sort((a, b) => b.score - a.score)
                .map((q) => (
                  <QuotationScoreCard
                    key={q.id}
                    quotation={q}
                    expanded={expanded.has(q.id)}
                    onToggle={() => toggleExpanded(q.id)}
                    scoreColor={scoreColor(q.score)}
                  />
                ))
            )}
          </div>

          {/* Summary */}
          {analysis.summary && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Resumen del pipeline</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis.summary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function QuotationScoreCard({
  quotation,
  expanded,
  onToggle,
  scoreColor,
}: {
  quotation: ScoredQuotation;
  expanded: boolean;
  onToggle: () => void;
  scoreColor: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
      >
        <span
          className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg border ${scoreColor}`}
        >
          {quotation.score}/10
        </span>
        <span className="flex-1 text-sm text-white font-medium truncate">{quotation.client_name}</span>
        {expanded ? (
          <ChevronUp size={14} className="shrink-0 text-slate-500" />
        ) : (
          <ChevronDown size={14} className="shrink-0 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/8 pt-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">Razón</p>
            <p className="text-sm text-slate-300">{quotation.reason}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Acción recomendada</p>
            <p className="text-sm text-[#00D4AA]">{quotation.recommended_action}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-6 rounded-lg bg-white/10 animate-pulse shrink-0" />
          <div className="flex-1 h-4 rounded bg-white/10 animate-pulse" />
          <IALoadingDots />
        </div>
      ))}
    </div>
  );
}
