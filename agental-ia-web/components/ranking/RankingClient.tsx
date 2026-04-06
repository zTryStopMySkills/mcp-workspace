"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, CheckCircle2, Target } from "lucide-react";
import type { RankingEntry } from "@/types";

const MEDAL = [
  { color: "#C9A84C", label: "1°", bg: "bg-[#C9A84C]/15 border-[#C9A84C]/30" },
  { color: "#94a3b8", label: "2°", bg: "bg-slate-500/15 border-slate-500/30" },
  { color: "#b45309", label: "3°", bg: "bg-amber-700/15 border-amber-700/30" },
];

interface Props {
  entries: RankingEntry[];
  currentAgentId: string;
}

export function RankingClient({ entries, currentAgentId }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium mb-1">Sin propuestas aún</p>
        <p className="text-sm">El ranking aparecerá cuando el equipo genere propuestas.</p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Podium top 3 */}
      {top3.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          {top3.map((entry, i) => {
            const m = MEDAL[i];
            const isMe = entry.agentId === currentAgentId;
            return (
              <div
                key={entry.agentId}
                className={`relative p-5 rounded-2xl border text-center transition-all ${m.bg} ${isMe ? "ring-2 ring-[#00D4AA]" : ""}`}
              >
                {i === 0 && <Trophy size={20} className="mx-auto mb-2" style={{ color: m.color }} />}
                {i === 1 && <Medal size={20} className="mx-auto mb-2" style={{ color: m.color }} />}
                {i === 2 && <Medal size={20} className="mx-auto mb-2" style={{ color: m.color }} />}
                <p className="text-xs font-bold mb-0.5" style={{ color: m.color }}>{m.label}</p>
                <p className="font-bold text-white text-sm truncate">{entry.name}</p>
                <p className="text-xs text-slate-500 mb-3">@{entry.nick}</p>
                <p className="text-2xl font-bold text-white">{entry.closed}</p>
                <p className="text-xs text-slate-400">cerradas</p>
                <p className="text-xs mt-1" style={{ color: m.color }}>
                  {entry.pipeline.toLocaleString("es-ES")} € pipeline
                </p>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {entries.map((entry, i) => {
          const isMe = entry.agentId === currentAgentId;
          const posColor = i === 0 ? "text-[#C9A84C]" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-600";

          return (
            <motion.div
              key={entry.agentId}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isMe
                  ? "bg-[#00D4AA]/8 border-[#00D4AA]/25 ring-1 ring-[#00D4AA]/30"
                  : "bg-white/[0.03] border-white/8"
              }`}
            >
              <span className={`text-lg font-bold w-7 text-center shrink-0 ${posColor}`}>
                {entry.position}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
                  {isMe && <span className="text-[10px] text-[#00D4AA] bg-[#00D4AA]/15 px-1.5 py-0.5 rounded-full border border-[#00D4AA]/25">Tú</span>}
                </div>
                <p className="text-xs text-slate-500">@{entry.nick}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center hidden sm:block">
                  <p className="text-sm font-bold text-white">{entry.total}</p>
                  <p className="text-[10px] text-slate-500">propuestas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <CheckCircle2 size={12} className="text-[#00D4AA]" />
                    <p className="text-sm font-bold text-white">{entry.closed}</p>
                  </div>
                  <p className="text-[10px] text-slate-500">cerradas</p>
                </div>
                <div className="text-center hidden md:block">
                  <div className="flex items-center gap-1 justify-center">
                    <TrendingUp size={12} className="text-[#C9A84C]" />
                    <p className="text-sm font-bold text-[#C9A84C]">{entry.pipeline.toLocaleString("es-ES")} €</p>
                  </div>
                  <p className="text-[10px] text-slate-500">pipeline</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Target size={12} className="text-slate-400" />
                    <p className="text-sm font-bold text-white">{entry.closeRate}%</p>
                  </div>
                  <p className="text-[10px] text-slate-500">cierre</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
