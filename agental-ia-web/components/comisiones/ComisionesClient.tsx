"use client";

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Euro, Info } from "lucide-react";
import type { Quotation } from "@/types";

interface MonthGroup {
  month: string;
  label: string;
  closed: Quotation[];
  totalOnce: number;
  commission: number;
}

interface Props {
  quotations: Quotation[];
  ratePercent: number | null;
  agentName: string;
}

export function ComisionesClient({ quotations, ratePercent, agentName }: Props) {
  const rate = ratePercent ?? 0;
  const closed = quotations.filter(q => q.status === "closed");

  // Group by month (using updated_at as close date approximation)
  const monthMap = new Map<string, Quotation[]>();
  for (const q of closed) {
    const month = q.updated_at.slice(0, 7);
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(q);
  }

  const groups: MonthGroup[] = [...monthMap.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, qs]) => {
      const totalOnce = qs.reduce((s, q) => s + q.total_once, 0);
      return {
        month,
        label: new Date(month + "-01").toLocaleDateString("es-ES", { year: "numeric", month: "long" }),
        closed: qs,
        totalOnce,
        commission: Math.round(totalOnce * rate / 100),
      };
    });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentGroup = groups.find(g => g.month === currentMonth);
  const totalEarned = groups.reduce((s, g) => s + g.commission, 0);
  const totalBilled = closed.reduce((s, q) => s + q.total_once, 0);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Rate info */}
      {ratePercent === null ? (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
          <Info size={16} className="text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            Tu administrador aún no ha configurado tu porcentaje de comisión. Contacta con él para que lo active.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-[#00D4AA]/8 border border-[#00D4AA]/20 rounded-2xl">
          <TrendingUp size={16} className="text-[#00D4AA] shrink-0" />
          <p className="text-sm text-[#00D4AA]">
            Tu comisión está fijada al <span className="font-bold">{rate}%</span> sobre el precio de cada propuesta cerrada.
          </p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#00D4AA]/8 border border-[#00D4AA]/20 rounded-2xl p-5">
          <p className="text-xs text-[#00D4AA] mb-1">Este mes</p>
          <p className="text-2xl font-bold text-white">{(currentGroup?.commission ?? 0).toLocaleString("es-ES")} €</p>
          <p className="text-xs text-slate-500 mt-1">{currentGroup?.closed.length ?? 0} propuestas cerradas</p>
        </div>
        <div className="bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-2xl p-5">
          <p className="text-xs text-[#C9A84C] mb-1">Total generado</p>
          <p className="text-2xl font-bold text-white">{totalEarned.toLocaleString("es-ES")} €</p>
          <p className="text-xs text-slate-500 mt-1">{closed.length} cierres totales</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Facturación total</p>
          <p className="text-2xl font-bold text-white">{totalBilled.toLocaleString("es-ES")} €</p>
          <p className="text-xs text-slate-500 mt-1">al {rate}% = {totalEarned.toLocaleString("es-ES")} €</p>
        </div>
      </div>

      {/* Monthly breakdown */}
      {groups.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Euro size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">Sin cierres registrados</p>
          <p className="text-sm">Las comisiones aparecerán cuando cierres propuestas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g, gi) => (
            <motion.div
              key={g.month}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden"
            >
              {/* Month header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div>
                  <p className="text-sm font-semibold text-white capitalize">{g.label}</p>
                  <p className="text-xs text-slate-500">{g.closed.length} propuesta{g.closed.length !== 1 ? "s" : ""} cerrada{g.closed.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#00D4AA]">{g.commission.toLocaleString("es-ES")} €</p>
                  <p className="text-xs text-slate-500">{g.totalOnce.toLocaleString("es-ES")} € × {rate}%</p>
                </div>
              </div>

              {/* Proposals */}
              <div className="divide-y divide-white/5">
                {g.closed.map(q => (
                  <div key={q.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 size={13} className="text-[#00D4AA] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{q.client_name}</p>
                        {q.client_sector && <p className="text-xs text-slate-500 truncate">{q.client_sector}</p>}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-semibold text-[#C9A84C]">{q.total_once.toLocaleString("es-ES")} €</p>
                      <p className="text-xs text-[#00D4AA]">+{Math.round(q.total_once * rate / 100).toLocaleString("es-ES")} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
