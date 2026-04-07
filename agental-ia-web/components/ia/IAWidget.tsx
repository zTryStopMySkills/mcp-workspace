"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IAWidgetPanel } from "./IAWidgetPanel";
import type { Quotation } from "@/types";
import type { AgentStats, TeamStats } from "@/types/ia";

export function IAWidget() {
  const [open, setOpen] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const loaded = useRef(false);

  // Fetch overdue count for badge (lightweight)
  useEffect(() => {
    fetch("/api/ia/context")
      .then((r) => r.json())
      .then((d) => {
        setOverdueCount(d.overdueCount ?? 0);
      })
      .catch(() => {});
  }, []);

  // Fetch full context lazily when panel is opened for the first time
  useEffect(() => {
    if (!open || loaded.current) return;
    loaded.current = true;

    fetch("/api/ia/context?full=1")
      .then((r) => r.json())
      .then((d) => {
        setQuotations(d.quotations ?? []);
        setAgentStats(d.agentStats ?? null);
        setTeamStats(d.teamStats ?? null);
        setOverdueCount(d.overdueCount ?? 0);
      })
      .catch(() => {});
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#00D4AA] text-black shadow-xl shadow-[#00D4AA]/30 hover:bg-[#2DD4BF] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Abrir IA Comercial"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
        {!open && overdueCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {overdueCount > 9 ? "9+" : overdueCount}
          </span>
        )}
      </button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[28rem] bg-[#0D1117]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
          >
            <IAWidgetPanel
              quotations={quotations}
              agentStats={agentStats ?? undefined}
              teamStats={teamStats ?? undefined}
              overdueCount={overdueCount}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
