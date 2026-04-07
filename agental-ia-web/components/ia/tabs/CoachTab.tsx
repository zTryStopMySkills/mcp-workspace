"use client";

import { useState, useEffect, useRef } from "react";
import { Send, TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import { IAResponseBlock } from "../shared/IAResponseBlock";
import { IAErrorAlert } from "../shared/IAErrorAlert";
import { IALoadingDots } from "../shared/IALoadingDots";
import type { AgentStats, TeamStats } from "@/types/ia";

interface CoachTabProps {
  agentStats: AgentStats;
  teamStats: TeamStats;
  overdueCount: number;
}

export function CoachTab({ agentStats, teamStats, overdueCount }: CoachTabProps) {
  const [streamedText, setStreamedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const hasAutoLoaded = useRef(false);

  const fetchCoach = async (q?: string) => {
    setIsLoading(true);
    setStreamedText("");
    setError(null);

    try {
      const res = await fetch("/api/ia/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, agentStats, teamStats, overdueCount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al conectar con la IA");
      setStreamedText(data.text ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAutoLoaded.current) {
      hasAutoLoaded.current = true;
      fetchCoach();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    fetchCoach(question.trim());
    setQuestion("");
  };

  const closeRateDiff = agentStats.closeRate - teamStats.avgCloseRate;
  const pipelineDiff = agentStats.pipeline - teamStats.avgPipeline;

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Tasa de cierre"
          value={`${agentStats.closeRate}%`}
          sub={`Media equipo: ${teamStats.avgCloseRate}%`}
          positive={closeRateDiff >= 0}
          icon={closeRateDiff >= 0 ? TrendingUp : TrendingDown}
        />
        <StatCard
          label="Pipeline activo"
          value={`${(agentStats.pipeline / 1000).toFixed(1)}k€`}
          sub={`Media equipo: ${(teamStats.avgPipeline / 1000).toFixed(1)}k€`}
          positive={pipelineDiff >= 0}
          icon={pipelineDiff >= 0 ? TrendingUp : TrendingDown}
        />
        <StatCard
          label="Posición ranking"
          value={`#${agentStats.rankingPosition}`}
          sub={`de ${teamStats.totalAgents} agentes`}
          positive={agentStats.rankingPosition <= Math.ceil(teamStats.totalAgents / 2)}
          icon={Award}
        />
        <StatCard
          label="Objetivo mensual"
          value={agentStats.monthlyTarget ? `${(agentStats.monthClosedAmount / 1000).toFixed(1)}k€` : "—"}
          sub={agentStats.monthlyTarget ? `de ${(agentStats.monthlyTarget / 1000).toFixed(1)}k€` : "Sin objetivo"}
          positive={
            agentStats.monthlyTarget
              ? agentStats.monthClosedAmount >= agentStats.monthlyTarget * 0.5
              : true
          }
          icon={Target}
        />
      </div>

      {/* AI Response */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-[#00D4AA]">🧠</span>
          Análisis del Coach IA
        </h3>

        {error && <IAErrorAlert message={error} onRetry={() => fetchCoach()} />}
        {isLoading && <IALoadingDots />}
        {streamedText && <IAResponseBlock text={streamedText} />}
      </div>

      {/* Free question */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Haz una pregunta específica al coach..."
          disabled={isLoading}
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4AA]/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-[#00D4AA] text-black text-sm font-semibold hover:bg-[#2DD4BF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  positive: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-slate-500">{label}</p>
        <Icon size={14} className={positive ? "text-[#00D4AA]" : "text-red-400"} />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
}
