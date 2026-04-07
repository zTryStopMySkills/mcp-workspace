"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, CheckCircle2, Send, MessageCircle, Clock, XCircle, Download, Globe, Loader2, Check } from "lucide-react";

interface DayCount { label: string; count: number; }
interface MonthBilling { label: string; amount: number; }
interface AgentBilling { nick: string; name: string; closedAmount: number; closedCount: number; }

interface FunnelStep {
  status: string;
  label: string;
  count: number;
  color: string;
}

interface Props {
  dailyMessages: DayCount[];
  topAgents: { nick: string; name: string; count: number }[];
  monthlyBilling?: MonthBilling[];
  agentBilling?: AgentBilling[];
  funnel?: FunnelStep[];
  allQuotations?: { client_name: string; client_sector: string | null; plan_name: string; total_once: number; status: string; created_at: string; agent_nick: string }[];
  landingSlots?: number;
}

function LandingSlotsWidget({ initialSlots }: { initialSlots: number }) {
  const [slots, setSlots] = useState(initialSlots);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/landing-slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Globe size={15} className="text-[#00D4AA]" />
        <span className="text-sm font-semibold text-white">Plazas disponibles (landing)</span>
      </div>
      <p className="text-xs text-[#8B95A9] mb-4 leading-relaxed">
        Controla cuántas plazas se muestran en la landing pública.
        <br />
        <span className="text-slate-500">-1 = ocultar badge · 0 = lista de espera · 1-99 = plazas reales</span>
      </p>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={-1}
          max={99}
          value={slots}
          onChange={e => setSlots(parseInt(e.target.value) || 0)}
          className="w-24 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#00D4AA]/50 transition-all"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D4AA] text-black font-semibold text-sm rounded-xl hover:bg-[#00b894] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Globe size={13} />}
          {saved ? "Guardado" : "Actualizar"}
        </button>
      </div>
    </motion.div>
  );
}

export function AdminDashboardClient({ dailyMessages, topAgents, monthlyBilling = [], agentBilling = [], funnel = [], allQuotations = [], landingSlots = 3 }: Props) {
  const maxMsg = Math.max(...dailyMessages.map(d => d.count), 1);
  const maxAgent = Math.max(...topAgents.map(a => a.count), 1);
  const maxBilling = Math.max(...monthlyBilling.map(m => m.amount), 1);
  const maxAgentBilling = Math.max(...agentBilling.map(a => a.closedAmount), 1);
  const funnelMax = funnel[0]?.count ?? 1;

  function exportAllCSV() {
    if (allQuotations.length === 0) return;
    const headers = ["Cliente", "Sector", "Plan", "Total €", "Estado", "Fecha", "Agente"];
    const rows = allQuotations.map(q => [
      q.client_name, q.client_sector ?? "", q.plan_name, q.total_once,
      q.status, new Date(q.created_at).toLocaleDateString("es-ES"), q.agent_nick,
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `propuestas_equipo_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Row 1: messages + top agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Actividad 7 días */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={15} className="text-indigo-400" />
            <span className="text-sm font-semibold text-white">Mensajes últimos 7 días</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {dailyMessages.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] text-[#8B95A9] font-mono">{day.count}</span>
                <div className="w-full rounded-t-lg bg-indigo-600/30 relative overflow-hidden" style={{ height: `${Math.max(4, (day.count / maxMsg) * 80)}px` }}>
                  <div className="absolute inset-0 rounded-t-lg bg-indigo-500/70" style={{ height: `${(day.count / maxMsg) * 100}%` }} />
                </div>
                <span className="text-[9px] text-[#8B95A9]/60">{day.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top agentes por mensaje */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Agentes más activos</span>
            <Link href="/admin/agentes" className="text-xs text-[#8B95A9] hover:text-white transition-colors">Ver todos →</Link>
          </div>
          {topAgents.length === 0 ? (
            <p className="text-xs text-[#8B95A9]/60 text-center py-8">Sin actividad aún</p>
          ) : (
            <div className="space-y-3">
              {topAgents.map((agent, i) => (
                <div key={agent.nick} className="flex items-center gap-3">
                  <span className="text-xs text-[#8B95A9]/40 font-mono w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white truncate">{agent.name}</span>
                      <span className="text-xs text-[#8B95A9] shrink-0 ml-2">{agent.count} msgs</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#00D4AA]/60" style={{ width: `${(agent.count / maxAgent) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Row 2: Billing chart + Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facturación últimos 6 meses */}
        {monthlyBilling.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} className="text-[#C9A84C]" />
              <span className="text-sm font-semibold text-white">Facturación cerrada (6 meses)</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {monthlyBilling.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-[#8B95A9] font-mono whitespace-nowrap">
                    {m.amount > 0 ? `${(m.amount / 1000).toFixed(1)}k` : "0"}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max(4, (m.amount / maxBilling) * 100)}px`,
                      background: "linear-gradient(180deg, #C9A84C 0%, #C9A84C80 100%)",
                    }}
                  />
                  <span className="text-[9px] text-[#8B95A9]/60 text-center leading-tight">{m.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-right">
              Total: {monthlyBilling.reduce((s, m) => s + m.amount, 0).toLocaleString("es-ES")} €
            </p>
          </motion.div>
        )}

        {/* Funnel de conversión */}
        {funnel.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={15} className="text-[#00D4AA]" />
              <span className="text-sm font-semibold text-white">Funnel de conversión</span>
            </div>
            <div className="space-y-2">
              {funnel.map((step, i) => {
                const pct = funnelMax > 0 ? Math.round((step.count / funnelMax) * 100) : 0;
                const convPct = i > 0 && funnel[i - 1].count > 0
                  ? Math.round((step.count / funnel[i - 1].count) * 100)
                  : null;
                return (
                  <div key={step.status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">{step.label}</span>
                      <div className="flex items-center gap-2">
                        {convPct !== null && (
                          <span className="text-[10px] text-slate-600">↓{convPct}%</span>
                        )}
                        <span className="text-xs font-semibold text-white">{step.count}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: step.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {funnel.length > 0 && funnel[0].count > 0 && (
              <p className="text-xs text-slate-500 mt-3 text-right">
                Tasa de cierre global:{" "}
                <span className="text-[#00D4AA] font-semibold">
                  {Math.round(((funnel.find(f => f.status === "closed")?.count ?? 0) / funnel[0].count) * 100)}%
                </span>
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Row 3: Facturación por agente */}
      {agentBilling.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-[#00D4AA]" />
              <span className="text-sm font-semibold text-white">Facturación por agente (mes actual)</span>
            </div>
            {allQuotations.length > 0 && (
              <button
                onClick={exportAllCSV}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 transition-all"
              >
                <Download size={11} />
                Exportar CSV
              </button>
            )}
          </div>
          <div className="space-y-3">
            {agentBilling.map((a, i) => (
              <div key={a.nick} className="flex items-center gap-3">
                <span className="text-xs text-[#8B95A9]/40 font-mono w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white truncate">{a.name}</span>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-[10px] text-slate-500">{a.closedCount} cierres</span>
                      <span className="text-xs font-bold text-[#C9A84C]">{a.closedAmount.toLocaleString("es-ES")} €</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C9A84C]/70"
                      style={{ width: `${(a.closedAmount / maxAgentBilling) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Landing slots widget */}
      <LandingSlotsWidget initialSlots={landingSlots} />
    </div>
  );
}
