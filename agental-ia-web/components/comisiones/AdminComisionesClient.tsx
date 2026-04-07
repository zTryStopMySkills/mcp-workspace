"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, CheckCircle2, TrendingUp, Loader2, Pencil, Check, X } from "lucide-react";
import { initials } from "@/lib/utils";

interface AgentWithStats {
  id: string;
  nick: string;
  name: string;
  ratePercent: number | null;
  closedAmount: number;
  closedCount: number;
  commission: number;
}

interface Props {
  agents: AgentWithStats[];
}

export function AdminComisionesClient({ agents: initialAgents }: Props) {
  const [agents, setAgents] = useState(initialAgents);
  const [editing, setEditing] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState("");
  const [saving, setSaving] = useState(false);

  const monthLabel = new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const totalCommission = agents.reduce((s, a) => s + a.commission, 0);
  const totalBilled = agents.reduce((s, a) => s + a.closedAmount, 0);

  async function saveRate(agentId: string) {
    const rate = parseFloat(rateInput);
    if (isNaN(rate) || rate < 0 || rate > 100) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/commission-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, rate_percent: rate }),
      });
      if (res.ok) {
        setAgents(prev => prev.map(a => {
          if (a.id !== agentId) return a;
          const newCommission = Math.round(a.closedAmount * rate / 100);
          return { ...a, ratePercent: rate, commission: newCommission };
        }));
        setEditing(null);
        setRateInput("");
      }
    } catch { /* ignore */ }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#00D4AA]/8 border border-[#00D4AA]/20 rounded-2xl p-5">
          <p className="text-xs text-[#00D4AA] mb-1">Comisiones totales ({monthLabel})</p>
          <p className="text-2xl font-bold text-white">{totalCommission.toLocaleString("es-ES")} €</p>
        </div>
        <div className="bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-2xl p-5">
          <p className="text-xs text-[#C9A84C] mb-1">Facturación del equipo</p>
          <p className="text-2xl font-bold text-white">{totalBilled.toLocaleString("es-ES")} €</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Agentes activos</p>
          <p className="text-2xl font-bold text-white">{agents.length}</p>
        </div>
      </div>

      {/* Agent table */}
      <div className="space-y-2">
        {agents.map((agent, i) => {
          const isEditing = editing === agent.id;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-4"
            >
              <div className="flex items-center gap-4 flex-wrap">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                    {initials(agent.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{agent.name}</p>
                    <p className="text-xs text-slate-500">@{agent.nick}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-center shrink-0">
                  <div>
                    <p className="text-xs text-slate-500">Cierres</p>
                    <div className="flex items-center gap-1 justify-center">
                      <CheckCircle2 size={11} className="text-[#00D4AA]" />
                      <span className="text-sm font-bold text-white">{agent.closedCount}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Facturado</p>
                    <div className="flex items-center gap-1 justify-center">
                      <TrendingUp size={11} className="text-[#C9A84C]" />
                      <span className="text-sm font-bold text-[#C9A84C]">{agent.closedAmount.toLocaleString("es-ES")} €</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Comisión</p>
                    <p className="text-sm font-bold text-[#00D4AA]">{agent.commission.toLocaleString("es-ES")} €</p>
                  </div>
                </div>

                {/* Rate editor */}
                {isEditing ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      value={rateInput}
                      onChange={e => setRateInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveRate(agent.id)}
                      min={0}
                      max={100}
                      step={0.5}
                      placeholder="ej. 15"
                      autoFocus
                      className="w-20 px-2 py-1.5 bg-white/5 border border-[#00D4AA]/40 rounded-lg text-sm text-white focus:outline-none"
                    />
                    <span className="text-slate-400 text-sm">%</span>
                    <button
                      onClick={() => saveRate(agent.id)}
                      disabled={saving}
                      className="w-7 h-7 rounded-lg bg-[#00D4AA] text-black flex items-center justify-center hover:bg-[#00D4AA]/80 disabled:opacity-40 transition-colors"
                    >
                      {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    </button>
                    <button
                      onClick={() => { setEditing(null); setRateInput(""); }}
                      className="w-7 h-7 rounded-lg bg-white/8 text-slate-400 flex items-center justify-center hover:text-white transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditing(agent.id); setRateInput(String(agent.ratePercent ?? "")); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all shrink-0 text-xs font-semibold
                      bg-white/[0.04] border-white/10 text-slate-300 hover:border-[#00D4AA]/40 hover:text-[#00D4AA]"
                  >
                    <Percent size={11} />
                    {agent.ratePercent !== null ? `${agent.ratePercent}%` : "Sin comisión"}
                    <Pencil size={10} className="opacity-60" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
