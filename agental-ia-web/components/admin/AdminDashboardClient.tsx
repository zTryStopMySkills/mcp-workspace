"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface DayCount { label: string; count: number; }

interface Props {
  dailyMessages: DayCount[];
  topAgents: { nick: string; name: string; count: number }[];
}

export function AdminDashboardClient({ dailyMessages, topAgents }: Props) {
  const maxMsg = Math.max(...dailyMessages.map(d => d.count), 1);
  const maxAgent = Math.max(...topAgents.map(a => a.count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
                <div
                  className="absolute inset-0 rounded-t-lg bg-indigo-500/70"
                  style={{ height: `${(day.count / maxMsg) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-[#8B95A9]/60">{day.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top agentes */}
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
                    <div
                      className="h-full rounded-full bg-[#00D4AA]/60"
                      style={{ width: `${(agent.count / maxAgent) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
