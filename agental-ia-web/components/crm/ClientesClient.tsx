"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Search, ChevronDown, ChevronUp, Mail, Phone,
  FileDown, FileText, Users, Plus, Filter, CalendarClock,
  AlertCircle, StickyNote, Loader2, Check, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { CRMClient, Quotation, QuotationStatus } from "@/types";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<QuotationStatus, string> = {
  draft: "text-slate-400 bg-slate-500/15 border-slate-500/25",
  sent: "text-blue-400 bg-blue-500/15 border-blue-500/25",
  negotiating: "text-amber-400 bg-amber-500/15 border-amber-500/25",
  closed: "text-[#00D4AA] bg-[#00D4AA]/15 border-[#00D4AA]/25",
  lost: "text-red-400 bg-red-500/15 border-red-500/25",
};
const STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Borrador", sent: "Enviada", negotiating: "Negociando", closed: "Cerrada ✓", lost: "Perdida",
};

interface Props {
  clients: CRMClient[];
  isAdmin: boolean;
}

export function ClientesClient({ clients, isAdmin }: Props) {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [followUpFilter, setFollowUpFilter] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Inline editing state
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<string | null>(null);
  const [followUpInput, setFollowUpInput] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  // Local state for updated quotations (to reflect inline edits without page reload)
  const [localUpdates, setLocalUpdates] = useState<Record<string, Partial<Quotation>>>({});

  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const sectors = Array.from(new Set(clients.map(c => c.sector).filter(Boolean))) as string[];

  function getQuotation(q: Quotation): Quotation {
    return { ...q, ...(localUpdates[q.id] ?? {}) };
  }

  function clientHasOverdue(client: CRMClient): boolean {
    return client.proposals.some(q => {
      const merged = getQuotation(q);
      return merged.follow_up_date && merged.follow_up_date < today && !["closed", "lost"].includes(merged.status);
    });
  }

  function clientNextFollowUp(client: CRMClient): string | null {
    const dates = client.proposals
      .map(q => getQuotation(q).follow_up_date)
      .filter((d): d is string => !!d && d >= today)
      .sort();
    return dates[0] ?? null;
  }

  const filtered = clients.filter(c => {
    const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (c.sector ?? "").toLowerCase().includes(search.toLowerCase());
    const matchSector = sectorFilter === "all" || c.sector === sectorFilter;
    const matchFollowUp = !followUpFilter || clientHasOverdue(c) || !!clientNextFollowUp(c);
    return matchSearch && matchSector && matchFollowUp;
  });

  const overdueCount = clients.filter(c => clientHasOverdue(c)).length;

  // ── API helpers ────────────────────────────────────────────────────────

  async function saveNote(q: Quotation) {
    setSavingNote(true);
    const res = await fetch(`/api/quotations/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: noteInput || null }),
    });
    if (res.ok) {
      setLocalUpdates(prev => ({ ...prev, [q.id]: { ...prev[q.id], notes: noteInput || null } }));
      setEditingNote(null);
    }
    setSavingNote(false);
  }

  async function saveFollowUp(q: Quotation) {
    setSavingFollowUp(true);
    const res = await fetch(`/api/quotations/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follow_up_date: followUpInput || null }),
    });
    if (res.ok) {
      setLocalUpdates(prev => ({ ...prev, [q.id]: { ...prev[q.id], follow_up_date: followUpInput || null } }));
      setEditingFollowUp(null);
    }
    setSavingFollowUp(false);
  }

  // ── DOCX helpers ───────────────────────────────────────────────────────

  async function downloadProp(q: Quotation) {
    try {
      const { generarPropuesta } = await import("@/lib/docx/propuesta");
      await generarPropuesta({
        cliente: { empresa: q.client_name, sector: q.client_sector ?? "", tieneWeb: q.has_web, urlWeb: q.client_web_url ?? "", email: q.client_email ?? "", telefono: q.client_phone ?? "" },
        plan: { id: q.plan_id, nombre: q.plan_name, precio: q.plan_price, descripcion: "", color: "#00D4AA", incluye: [] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extras: (q.extras ?? []) as any[], servicios: (q.services ?? []) as any[], notaInterna: q.notes ?? "",
      }, (q as unknown as { agent?: { name: string } }).agent?.name ?? "Agente");
    } catch { alert("Error al generar el DOCX"); }
  }

  async function downloadContract(q: Quotation) {
    try {
      const { generarContrato } = await import("@/lib/docx/contrato");
      await generarContrato({
        cliente: { empresa: q.client_name, sector: q.client_sector ?? "", tieneWeb: q.has_web, urlWeb: q.client_web_url ?? "", email: q.client_email ?? "", telefono: q.client_phone ?? "" },
        plan: { id: q.plan_id, nombre: q.plan_name, precio: q.plan_price, descripcion: "", color: "#00D4AA", incluye: [] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extras: (q.extras ?? []) as any[], servicios: (q.services ?? []) as any[], notaInterna: "",
      }, (q as unknown as { agent?: { name: string } }).agent?.name ?? "Agente");
    } catch { alert("Error al generar el DOCX"); }
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Building2 size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium mb-1">Sin clientes aún</p>
        <p className="text-sm">Los clientes aparecerán cuando generes propuestas en el tarificador.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Nueva propuesta */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o sector…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
          />
        </div>
        <Link
          href="/tarificador"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00D4AA] hover:bg-[#00D4AA]/80 text-black text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus size={15} />
          Nueva propuesta
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={12} className="text-slate-500 shrink-0" />

        {/* Follow-up filter */}
        <button
          onClick={() => setFollowUpFilter(!followUpFilter)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            followUpFilter
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
              : "text-slate-400 hover:text-white hover:bg-white/8"
          }`}
        >
          <CalendarClock size={11} />
          Seguimiento pendiente
          {overdueCount > 0 && (
            <span className="bg-amber-500/20 text-amber-400 rounded-full px-1.5 text-[10px]">
              {overdueCount}
            </span>
          )}
        </button>

        {/* Sector filters */}
        {sectors.length > 0 && (
          <>
            <span className="text-slate-700 text-xs">|</span>
            <button
              onClick={() => setSectorFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sectorFilter === "all" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white hover:bg-white/8"}`}
            >
              Todos los sectores
            </button>
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setSectorFilter(sectorFilter === s ? "all" : s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sectorFilter === s ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25" : "text-slate-400 hover:text-white hover:bg-white/8"}`}
              >
                {s}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Client list */}
      <div className="space-y-2">
        {filtered.map((client, i) => {
          const key = client.clientName.toLowerCase();
          const isOpen = expanded === key;
          const lastStatus = client.proposals[0]?.status as QuotationStatus;
          const isOverdue = clientHasOverdue(client);
          const nextFollowUp = clientNextFollowUp(client);
          const isUpcoming = nextFollowUp && nextFollowUp <= nextWeek;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={`border rounded-2xl overflow-hidden transition-colors ${
                isOverdue
                  ? "bg-amber-500/[0.03] border-amber-500/25"
                  : "bg-white/[0.03] border-white/8"
              }`}
            >
              {/* Client header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.03] transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  isOverdue
                    ? "bg-amber-500/15 border-amber-500/25"
                    : "bg-[#00D4AA]/15 border-[#00D4AA]/25"
                }`}>
                  <Building2 size={18} className={isOverdue ? "text-amber-400" : "text-[#00D4AA]"} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{client.clientName}</p>
                    {client.sector && (
                      <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{client.sector}</span>
                    )}
                    {isAdmin && client.agentNicks.length > 0 && (
                      <span className="text-xs text-indigo-400 flex items-center gap-1">
                        <Users size={10} />
                        {client.agentNicks.map(n => `@${n}`).join(", ")}
                      </span>
                    )}
                    {isOverdue && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
                        <AlertCircle size={9} />
                        Seguimiento vencido
                      </span>
                    )}
                    {!isOverdue && isUpcoming && nextFollowUp && (
                      <span className="flex items-center gap-1 text-[10px] text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/25 px-2 py-0.5 rounded-full">
                        <CalendarClock size={9} />
                        {new Date(nextFollowUp).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {client.email && <span className="flex items-center gap-1 text-xs text-slate-500"><Mail size={10} />{client.email}</span>}
                    {client.phone && <span className="flex items-center gap-1 text-xs text-slate-500"><Phone size={10} />{client.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center hidden sm:block">
                    <p className="text-sm font-bold text-white">{client.proposals.length}</p>
                    <p className="text-[10px] text-slate-500">propuestas</p>
                  </div>
                  {client.totalBilled > 0 && (
                    <div className="text-center hidden md:block">
                      <p className="text-sm font-bold text-[#C9A84C]">{client.totalBilled.toLocaleString("es-ES")} €</p>
                      <p className="text-[10px] text-slate-500">facturado</p>
                    </div>
                  )}
                  {lastStatus && (
                    <span className={`text-[11px] px-2 py-1 rounded-lg border font-medium shrink-0 ${STATUS_COLORS[lastStatus]}`}>
                      {STATUS_LABELS[lastStatus]}
                    </span>
                  )}
                  {client.phone && (
                    <a
                      href={`https://wa.me/${client.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(client.clientName)},%20te%20escribo%20de%20Agentalia-webs.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 text-slate-500 hover:text-[#25D366] hover:bg-white/5 rounded-lg transition-colors"
                      title="WhatsApp"
                    >
                      <Phone size={14} />
                    </a>
                  )}
                  {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </button>

              {/* Expanded proposal list */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/8 divide-y divide-white/5">
                      {client.proposals.map(rawQ => {
                        const q = getQuotation(rawQ);
                        const isQOverdue = q.follow_up_date && q.follow_up_date < today && !["closed", "lost"].includes(q.status);
                        const isQUpcoming = q.follow_up_date && q.follow_up_date >= today && q.follow_up_date <= nextWeek;
                        const isEditNote = editingNote === q.id;
                        const isEditFU = editingFollowUp === q.id;

                        return (
                          <div key={q.id} className="px-4 py-3 space-y-2">
                            {/* Proposal main row */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm text-white">Plan {q.plan_name}</span>
                                  <span className="text-xs font-semibold text-[#C9A84C]">{q.total_once.toLocaleString("es-ES")} €</span>
                                  {q.total_monthly > 0 && <span className="text-xs text-slate-500">+{q.total_monthly.toLocaleString("es-ES")} €/mes</span>}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                  <p className="text-xs text-slate-600">{formatDate(q.created_at)}</p>
                                  {/* Follow-up date indicator */}
                                  {q.follow_up_date && (
                                    <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${
                                      isQOverdue
                                        ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
                                        : isQUpcoming
                                        ? "text-[#00D4AA] bg-[#00D4AA]/10 border-[#00D4AA]/25"
                                        : "text-slate-500 bg-white/5 border-white/10"
                                    }`}>
                                      <CalendarClock size={9} />
                                      {isQOverdue ? "Vencido · " : ""}
                                      {new Date(q.follow_up_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "2-digit" })}
                                    </span>
                                  )}
                                  {/* Notes preview */}
                                  {q.notes && (
                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 max-w-[160px] truncate">
                                      <StickyNote size={9} />
                                      {q.notes}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Status + actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium ${STATUS_COLORS[q.status as QuotationStatus]}`}>
                                  {STATUS_LABELS[q.status as QuotationStatus]}
                                </span>
                                {/* PDF view */}
                                <Link
                                  href={`/tarificador/propuesta/${q.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ver propuesta PDF"
                                  className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <ExternalLink size={12} />
                                </Link>
                                {/* Toggle note editor */}
                                <button
                                  onClick={() => {
                                    if (isEditNote) { setEditingNote(null); return; }
                                    setEditingNote(q.id);
                                    setNoteInput(q.notes ?? "");
                                    setEditingFollowUp(null);
                                  }}
                                  title={q.notes ? "Editar nota" : "Añadir nota"}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    q.notes ? "text-[#C9A84C] hover:bg-white/5" : "text-slate-500 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  <StickyNote size={12} />
                                </button>
                                {/* Toggle follow-up editor */}
                                <button
                                  onClick={() => {
                                    if (isEditFU) { setEditingFollowUp(null); return; }
                                    setEditingFollowUp(q.id);
                                    setFollowUpInput(q.follow_up_date ?? "");
                                    setEditingNote(null);
                                  }}
                                  title="Recordatorio de seguimiento"
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isQOverdue
                                      ? "text-amber-400"
                                      : q.follow_up_date
                                      ? "text-[#00D4AA]"
                                      : "text-slate-500 hover:text-white"
                                  } hover:bg-white/5`}
                                >
                                  <CalendarClock size={12} />
                                </button>
                                {/* DOCX downloads */}
                                <button onClick={() => downloadProp(rawQ)} title="Propuesta DOCX" className="p-1.5 text-slate-500 hover:text-[#C9A84C] hover:bg-white/5 rounded-lg transition-colors">
                                  <FileDown size={12} />
                                </button>
                                <button onClick={() => downloadContract(rawQ)} title="Contrato DOCX" className="p-1.5 text-slate-500 hover:text-[#00D4AA] hover:bg-white/5 rounded-lg transition-colors">
                                  <FileText size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Note inline editor */}
                            {isEditNote && (
                              <div className="flex items-start gap-2 pt-1 pl-2">
                                <StickyNote size={13} className="text-[#C9A84C] mt-2.5 shrink-0" />
                                <textarea
                                  value={noteInput}
                                  onChange={e => setNoteInput(e.target.value)}
                                  placeholder="Añade una nota sobre esta propuesta…"
                                  rows={2}
                                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => saveNote(q)}
                                    disabled={savingNote}
                                    className="p-2 bg-[#C9A84C] hover:bg-[#C9A84C]/80 disabled:opacity-40 text-black rounded-lg transition-colors"
                                  >
                                    {savingNote ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                  </button>
                                  {q.notes && (
                                    <button
                                      onClick={() => { setNoteInput(""); saveNote({ ...q, notes: "" }); }}
                                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors text-[10px]"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Follow-up inline editor */}
                            {isEditFU && (
                              <div className="flex items-center gap-2 pt-1 pl-2 flex-wrap">
                                <CalendarClock size={13} className="text-[#00D4AA] shrink-0" />
                                <span className="text-xs text-slate-400">Recordatorio:</span>
                                <input
                                  type="date"
                                  value={followUpInput}
                                  onChange={e => setFollowUpInput(e.target.value)}
                                  min={today}
                                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                                />
                                <button
                                  onClick={() => saveFollowUp(q)}
                                  disabled={savingFollowUp}
                                  className="px-3 py-1.5 bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-40 text-black text-xs font-semibold rounded-lg transition-colors"
                                >
                                  {savingFollowUp ? <Loader2 size={11} className="animate-spin" /> : "Guardar"}
                                </button>
                                {q.follow_up_date && (
                                  <button
                                    onClick={() => { setFollowUpInput(""); saveFollowUp({ ...q, follow_up_date: null }); }}
                                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                  >
                                    Quitar
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm">No hay clientes que coincidan con los filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
