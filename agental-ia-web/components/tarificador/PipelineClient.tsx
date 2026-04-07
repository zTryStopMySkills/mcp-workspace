"use client";

import { useState } from "react";
import { Clock, Send, MessageCircle, CheckCircle2, XCircle } from "lucide-react";
import type { Quotation, QuotationStatus } from "@/types";
import { formatDate } from "@/lib/utils";

const COLUMNS: { status: QuotationStatus; label: string; color: string; border: string; headerBg: string; icon: React.ReactNode }[] = [
  { status: "draft",       label: "Borrador",   color: "text-slate-400",  border: "border-slate-500/25",   headerBg: "bg-slate-500/10",  icon: <Clock size={13} /> },
  { status: "sent",        label: "Enviada",    color: "text-blue-400",   border: "border-blue-500/25",    headerBg: "bg-blue-500/10",   icon: <Send size={13} /> },
  { status: "negotiating", label: "Negociando", color: "text-amber-400",  border: "border-amber-500/25",   headerBg: "bg-amber-500/10",  icon: <MessageCircle size={13} /> },
  { status: "closed",      label: "Cerrada",    color: "text-[#00D4AA]",  border: "border-[#00D4AA]/25",   headerBg: "bg-[#00D4AA]/10",  icon: <CheckCircle2 size={13} /> },
  { status: "lost",        label: "Perdida",    color: "text-red-400",    border: "border-red-500/25",     headerBg: "bg-red-500/10",    icon: <XCircle size={13} /> },
];

interface Props {
  initialQuotations: Quotation[];
  isAdmin: boolean;
}

export function PipelineClient({ initialQuotations, isAdmin }: Props) {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<QuotationStatus | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("quotation_id", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverCol(null);
  }

  function handleDragOver(e: React.DragEvent, status: QuotationStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== status) setDragOverCol(status);
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the column container (not its children)
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  }

  async function handleDrop(e: React.DragEvent, targetStatus: QuotationStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData("quotation_id");
    setDraggingId(null);
    setDragOverCol(null);

    const q = quotations.find(q => q.id === id);
    if (!q || q.status === targetStatus) return;

    // Optimistic update
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: targetStatus } : q));
    setUpdating(id);

    const res = await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: targetStatus }),
    });

    if (!res.ok) {
      // Revert on failure
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: q.status } : q));
    }
    setUpdating(null);
  }

  const totalPipeline = quotations
    .filter(q => !["closed", "lost"].includes(q.status))
    .reduce((s, q) => s + q.total_once, 0);

  const totalClosed = quotations
    .filter(q => q.status === "closed")
    .reduce((s, q) => s + q.total_once, 0);

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap gap-4 mb-5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Pipeline activo:</span>
          <span className="font-bold text-white">{totalPipeline.toLocaleString("es-ES")} €</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Cerradas:</span>
          <span className="font-bold text-[#00D4AA]">{totalClosed.toLocaleString("es-ES")} €</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total:</span>
          <span className="font-bold text-white">{quotations.length} propuestas</span>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-6" style={{ minHeight: "60vh" }}>
        {COLUMNS.map(col => {
          const items = quotations.filter(q => q.status === col.status);
          const colTotal = items.reduce((s, q) => s + q.total_once, 0);
          const isOver = dragOverCol === col.status;

          return (
            <div
              key={col.status}
              onDragOver={e => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.status)}
              className={`flex flex-col shrink-0 w-60 rounded-2xl border transition-all duration-150 ${col.border} ${
                isOver ? "ring-2 ring-white/20 bg-white/[0.04]" : "bg-white/[0.02]"
              }`}
            >
              {/* Column header */}
              <div className={`p-3 rounded-t-2xl border-b border-white/8 ${col.headerBg}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className={`flex items-center gap-1.5 font-semibold text-sm ${col.color}`}>
                    {col.icon}
                    {col.label}
                  </div>
                  <span className={`text-xs font-bold min-w-[22px] h-[22px] px-1.5 rounded-full bg-white/10 flex items-center justify-center ${col.color}`}>
                    {items.length}
                  </span>
                </div>
                {colTotal > 0 && (
                  <p className="text-[10px] text-slate-500">{colTotal.toLocaleString("es-ES")} €</p>
                )}
              </div>

              {/* Drop area + cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {items.length === 0 ? (
                  <div className={`h-16 rounded-xl border border-dashed flex items-center justify-center text-[11px] transition-all ${
                    isOver ? "border-white/25 text-slate-400 bg-white/5" : "border-white/10 text-slate-600"
                  }`}>
                    Soltar aquí
                  </div>
                ) : (
                  items.map(q => (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={e => handleDragStart(e, q.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-[#0D1117] border border-white/10 rounded-xl p-3 select-none transition-all duration-150 ${
                        draggingId === q.id
                          ? "opacity-30 scale-95 cursor-grabbing"
                          : "cursor-grab hover:border-white/20 hover:shadow-lg"
                      } ${updating === q.id ? "animate-pulse" : ""}`}
                    >
                      <p className="text-sm font-semibold text-white truncate">{q.client_name}</p>
                      {q.client_sector && (
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{q.client_sector}</p>
                      )}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-xs font-bold text-[#C9A84C]">
                          {q.total_once.toLocaleString("es-ES")} €
                        </span>
                        <span className="text-[10px] text-slate-600">{formatDate(q.created_at)}</span>
                      </div>
                      {q.total_monthly > 0 && (
                        <p className="text-[10px] text-slate-500 mt-0.5">+{q.total_monthly.toLocaleString("es-ES")} €/mes</p>
                      )}
                      {isAdmin && q.agent && (
                        <p className="text-[10px] text-indigo-400 mt-1.5 font-medium">@{q.agent.nick}</p>
                      )}
                      {q.follow_up_date && (
                        <p className={`text-[10px] mt-1 ${
                          q.follow_up_date < new Date().toISOString().slice(0, 10)
                            ? "text-amber-400"
                            : "text-slate-500"
                        }`}>
                          📅 {new Date(q.follow_up_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
