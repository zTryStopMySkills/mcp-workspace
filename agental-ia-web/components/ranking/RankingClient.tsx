"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, CheckCircle2, Target, Calendar, Clock, Settings, Loader2, Check } from "lucide-react";
import type { RankingEntry } from "@/types";

const MEDAL = [
  { color: "#C9A84C", label: "1°", bg: "bg-[#C9A84C]/15 border-[#C9A84C]/30" },
  { color: "#94a3b8", label: "2°", bg: "bg-slate-500/15 border-slate-500/30" },
  { color: "#b45309", label: "3°", bg: "bg-amber-700/15 border-amber-700/30" },
];

interface Target {
  target_closed: number;
  target_amount: number;
}

interface HistoricalMonth {
  month: string;
  label: string;
  entries: RankingEntry[];
}

interface Props {
  allEntries: RankingEntry[];
  monthEntries: RankingEntry[];
  historicalMonths?: HistoricalMonth[];
  currentAgentId: string;
  isAdmin: boolean;
  target: Target | null;
  monthClosed: number;
  monthAmount: number;
}

export function RankingClient({ allEntries, monthEntries, historicalMonths, currentAgentId, isAdmin, target: initialTarget, monthClosed, monthAmount }: Props) {
  const [period, setPeriod] = useState<"month" | "all" | string>("month");
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  const entries = period === "all"
    ? allEntries
    : period === "month"
    ? monthEntries
    : (historicalMonths?.find(m => m.month === period)?.entries ?? []);

  const monthName = new Date().toLocaleDateString("es-ES", { month: "long" });

  // Target state
  const [target, setTarget] = useState<Target | null>(initialTarget);
  const [editingTarget, setEditingTarget] = useState(false);
  const [tClosed, setTClosed] = useState(String(initialTarget?.target_closed ?? ""));
  const [tAmount, setTAmount] = useState(String(initialTarget?.target_amount ?? ""));
  const [savingTarget, setSavingTarget] = useState(false);

  async function saveTarget() {
    setSavingTarget(true);
    const res = await fetch("/api/admin/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_closed: Number(tClosed) || 0, target_amount: Number(tAmount) || 0 }),
    });
    if (res.ok) {
      const data = await res.json();
      setTarget(data);
      setEditingTarget(false);
    }
    setSavingTarget(false);
  }

  const progressClosed = target && target.target_closed > 0
    ? Math.min(100, Math.round((monthClosed / target.target_closed) * 100))
    : null;
  const progressAmount = target && target.target_amount > 0
    ? Math.min(100, Math.round((monthAmount / target.target_amount) * 100))
    : null;

  if (entries.length === 0) {
    return (
      <div>
        <PeriodToggle period={period} setPeriod={setPeriod} monthName={monthName} historicalMonths={historicalMonths} currentMonthKey={currentMonthKey} />
        <div className="text-center py-20 text-slate-500 mt-6">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">Sin propuestas {period === "month" ? `en ${monthName}` : "aún"}</p>
          <p className="text-sm">El ranking aparecerá cuando el equipo genere propuestas.</p>
        </div>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-5">
      <PeriodToggle period={period} setPeriod={setPeriod} monthName={monthName} historicalMonths={historicalMonths} currentMonthKey={currentMonthKey} />

      {/* Objetivo mensual */}
      {(target || isAdmin) && period === "month" && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#C9A84C]" />
              <p className="text-sm font-semibold text-white">
                Objetivo de {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
              </p>
            </div>
            {isAdmin && !editingTarget && (
              <button
                onClick={() => { setEditingTarget(true); setTClosed(String(target?.target_closed ?? "")); setTAmount(String(target?.target_amount ?? "")); }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Settings size={12} />
                {target ? "Editar" : "Configurar objetivo"}
              </button>
            )}
          </div>

          {/* Edit form */}
          {editingTarget && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#00D4AA]" />
                <span className="text-xs text-slate-400">Webs cerradas:</span>
                <input
                  type="number"
                  value={tClosed}
                  onChange={e => setTClosed(e.target.value)}
                  min={0}
                  placeholder="ej. 10"
                  className="w-20 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00D4AA]/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={13} className="text-[#C9A84C]" />
                <span className="text-xs text-slate-400">Facturación (€):</span>
                <input
                  type="number"
                  value={tAmount}
                  onChange={e => setTAmount(e.target.value)}
                  min={0}
                  placeholder="ej. 8000"
                  className="w-24 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#C9A84C]/50"
                />
              </div>
              <button
                onClick={saveTarget}
                disabled={savingTarget}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-40 text-black text-xs font-semibold rounded-lg transition-colors"
              >
                {savingTarget ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                Guardar
              </button>
              <button onClick={() => setEditingTarget(false)} className="text-xs text-slate-500 hover:text-white transition-colors">
                Cancelar
              </button>
            </div>
          )}

          {/* Progress bars */}
          {target && !editingTarget && (
            <div className="space-y-3">
              {target.target_closed > 0 && progressClosed !== null && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 size={11} className="text-[#00D4AA]" />
                      Webs cerradas
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {monthClosed} / {target.target_closed}
                      <span className={`ml-2 ${progressClosed >= 100 ? "text-[#00D4AA]" : "text-slate-500"}`}>
                        {progressClosed}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-white/8 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressClosed}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${progressClosed >= 100 ? "bg-[#00D4AA]" : "bg-[#00D4AA]/60"}`}
                    />
                  </div>
                </div>
              )}
              {target.target_amount > 0 && progressAmount !== null && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <TrendingUp size={11} className="text-[#C9A84C]" />
                      Facturación
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {monthAmount.toLocaleString("es-ES")} € / {target.target_amount.toLocaleString("es-ES")} €
                      <span className={`ml-2 ${progressAmount >= 100 ? "text-[#C9A84C]" : "text-slate-500"}`}>
                        {progressAmount}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-white/8 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressAmount}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                      className={`h-full rounded-full ${progressAmount >= 100 ? "bg-[#C9A84C]" : "bg-[#C9A84C]/60"}`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Podium top 3 */}
      {top3.length >= 2 && (
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
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
                {i > 0 && <Medal size={20} className="mx-auto mb-2" style={{ color: m.color }} />}
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
              key={`${period}-${entry.agentId}`}
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

function PeriodToggle({
  period, setPeriod, monthName, historicalMonths, currentMonthKey
}: {
  period: string;
  setPeriod: (p: string) => void;
  monthName: string;
  historicalMonths?: { month: string; label: string; entries: RankingEntry[] }[];
  currentMonthKey: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => setPeriod("month")}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
          period === "month"
            ? "bg-[#00D4AA]/15 border-[#00D4AA]/30 text-[#00D4AA]"
            : "bg-white/[0.03] border-white/8 text-slate-400 hover:text-white"
        }`}
      >
        <Calendar size={13} />
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </button>
      <button
        onClick={() => setPeriod("all")}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
          period === "all"
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/[0.03] border-white/8 text-slate-400 hover:text-white"
        }`}
      >
        <Clock size={13} />
        Todo el tiempo
      </button>
      {/* Historical month selector */}
      {historicalMonths && historicalMonths.filter(m => m.month !== currentMonthKey).length > 0 && (
        <select
          value={period.length === 7 && period !== currentMonthKey ? period : ""}
          onChange={e => { if (e.target.value) setPeriod(e.target.value); }}
          className="px-3 py-1.5 rounded-xl text-sm font-medium border bg-white/[0.03] border-white/8 text-slate-400 hover:text-white focus:outline-none focus:border-white/20 transition-all cursor-pointer"
          style={{ background: "#0D1117" }}
        >
          <option value="" disabled>Mes anterior…</option>
          {historicalMonths
            .filter(m => m.month !== currentMonthKey)
            .map(m => (
              <option key={m.month} value={m.month} style={{ background: "#0D1117" }}>
                {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}
