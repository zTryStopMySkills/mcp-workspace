"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import type { Quotation, QuotationStatus } from "@/types";
import {
  Clock, Send, MessageCircle, CheckCircle2, XCircle,
  Trash2, Loader2, FileDown, FileText, MoreHorizontal,
  Phone, CalendarClock, AlertCircle, ExternalLink, Share2, Check, Download, Copy
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<QuotationStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  draft:       { label: "Borrador",    color: "text-slate-400",  bg: "bg-slate-500/15 border-slate-500/25", icon: <Clock size={11} /> },
  sent:        { label: "Enviada",     color: "text-blue-400",   bg: "bg-blue-500/15 border-blue-500/25",   icon: <Send size={11} /> },
  negotiating: { label: "Negociando", color: "text-amber-400",  bg: "bg-amber-500/15 border-amber-500/25", icon: <MessageCircle size={11} /> },
  closed:      { label: "Cerrada ✓",  color: "text-[#00D4AA]",  bg: "bg-[#00D4AA]/15 border-[#00D4AA]/25", icon: <CheckCircle2 size={11} /> },
  lost:        { label: "Perdida",     color: "text-red-400",    bg: "bg-red-500/15 border-red-500/25",     icon: <XCircle size={11} /> },
};

const ALL_STATUSES: QuotationStatus[] = ["draft", "sent", "negotiating", "closed", "lost"];

interface Props {
  initialQuotations: Quotation[];
  isAdmin?: boolean;
}

export function QuotationHistory({ initialQuotations, isAdmin }: Props) {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [filter, setFilter] = useState<QuotationStatus | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editFollowUp, setEditFollowUp] = useState<string | null>(null);
  const [followUpInput, setFollowUpInput] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);

  const filtered = filter === "all" ? quotations : quotations.filter(q => q.status === filter);

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = quotations.filter(q => q.status === s).length;
    return acc;
  }, {} as Record<QuotationStatus, number>);

  const totalPipeline = quotations.filter(q => !["closed","lost"].includes(q.status))
    .reduce((s, q) => s + q.total_once, 0);
  const totalClosed = quotations.filter(q => q.status === "closed")
    .reduce((s, q) => s + q.total_once, 0);

  const today = new Date().toISOString().slice(0, 10);
  const overdueCount = quotations.filter(q =>
    q.follow_up_date && q.follow_up_date < today && !["closed","lost"].includes(q.status)
  ).length;

  async function updateStatus(id: string, status: QuotationStatus) {
    setUpdating(id);
    setOpenMenu(null);
    const res = await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    setUpdating(null);
  }

  async function deleteQuotation(id: string) {
    if (!confirm("¿Eliminar esta propuesta?")) return;
    setDeleting(id);
    const res = await fetch(`/api/quotations/${id}`, { method: "DELETE" });
    if (res.ok) setQuotations(prev => prev.filter(q => q.id !== id));
    setDeleting(null);
  }

  async function saveFollowUp(id: string) {
    setSavingFollowUp(true);
    const res = await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follow_up_date: followUpInput || null }),
    });
    if (res.ok) {
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, follow_up_date: followUpInput || null } : q));
      setEditFollowUp(null);
    }
    setSavingFollowUp(false);
  }

  function exportCSV() {
    const headers = ["Cliente", "Sector", "Plan", "Total €", "Mensual €", "Estado", "Fecha", "Agente", "Email", "Teléfono"];
    const rows = quotations.map(q => [
      q.client_name,
      q.client_sector ?? "",
      q.plan_name,
      q.total_once,
      q.total_monthly,
      STATUS_CONFIG[q.status].label.replace(" ✓", ""),
      new Date(q.created_at).toLocaleDateString("es-ES"),
      q.agent?.nick ?? "",
      q.client_email ?? "",
      q.client_phone ?? "",
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `propuestas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shareQuotation(q: Quotation) {
    setSharingId(q.id);
    try {
      const res = await fetch(`/api/quotations/${q.id}/share`, { method: "POST" });
      if (res.ok) {
        const { token } = await res.json();
        const url = `${window.location.origin}/p/${token}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(q.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } catch { /* silently ignore */ }
    setSharingId(null);
  }

  async function downloadProp(q: Quotation) {
    try {
      const { generarPropuesta } = await import("@/lib/docx/propuesta");
      await generarPropuesta({
        cliente: { empresa: q.client_name, sector: q.client_sector ?? "", tieneWeb: q.has_web, urlWeb: q.client_web_url ?? "", email: q.client_email ?? "", telefono: q.client_phone ?? "" },
        plan: { id: q.plan_id, nombre: q.plan_name, precio: q.plan_price, descripcion: "", color: "#00D4AA", incluye: [] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extras: (q.extras ?? []) as any[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        servicios: (q.services ?? []) as any[],
        notaInterna: q.notes ?? "",
      }, q.agent?.name ?? "Agente");
    } catch { alert("Error al generar el DOCX"); }
  }

  async function cloneQuotation(q: Quotation) {
    setCloningId(q.id);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: `${q.client_name} (copia)`,
          client_email: q.client_email,
          client_phone: q.client_phone,
          client_sector: q.client_sector,
          has_web: q.has_web,
          client_web_url: q.client_web_url,
          plan_id: q.plan_id,
          plan_name: q.plan_name,
          plan_price: q.plan_price,
          extras: q.extras,
          services: q.services,
          total_once: q.total_once,
          total_monthly: q.total_monthly,
          status: "draft",
          notes: q.notes,
        }),
      });
      if (res.ok) {
        const newQ = await res.json();
        setQuotations(prev => [newQ, ...prev]);
      }
    } catch { /* silently ignore */ }
    setCloningId(null);
  }

  function buildWhatsAppUrl(q: Quotation, mode: "followup" | "proposal" = "proposal", shareLink?: string) {
    const phone = q.client_phone?.replace(/\D/g, "");
    if (!phone) return null;
    const price = `${q.total_once.toLocaleString("es-ES")} €`;
    const monthly = q.total_monthly > 0 ? ` + ${q.total_monthly.toLocaleString("es-ES")} €/mes` : "";

    let text: string;
    if (mode === "followup") {
      text = `Hola ${q.client_name} 👋, te escribo de Agental.IA para hacer seguimiento a tu propuesta del plan *${q.plan_name}* (${price}${monthly}). ¿Tienes alguna duda o necesitas algo más? Estoy a tu disposición.`;
    } else if (shareLink) {
      text = `Hola ${q.client_name} 👋, te comparto la propuesta personalizada que hemos preparado para ti:\n\n📋 *Plan ${q.plan_name}* — ${price}${monthly}\n\n🔗 Ver propuesta: ${shareLink}\n\nCualquier pregunta, aquí estoy. ¡Espero que sea de tu agrado!`;
    } else {
      text = `Hola ${q.client_name} 👋, te escribo de Agental.IA en relación a tu propuesta del plan *${q.plan_name}* (${price}${monthly}). ¿Tienes alguna pregunta?`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  async function shareViaWhatsApp(q: Quotation) {
    setSharingId(q.id);
    try {
      const res = await fetch(`/api/quotations/${q.id}/share`, { method: "POST" });
      if (res.ok) {
        const { token } = await res.json();
        const shareLink = `${window.location.origin}/p/${token}`;
        const url = buildWhatsAppUrl(q, "proposal", shareLink);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch { /* silently ignore */ }
    setSharingId(null);
  }

  async function downloadContract(q: Quotation) {
    try {
      const { generarContrato } = await import("@/lib/docx/contrato");
      await generarContrato({
        cliente: { empresa: q.client_name, sector: q.client_sector ?? "", tieneWeb: q.has_web, urlWeb: q.client_web_url ?? "", email: q.client_email ?? "", telefono: q.client_phone ?? "" },
        plan: { id: q.plan_id, nombre: q.plan_name, precio: q.plan_price, descripcion: "", color: "#00D4AA", incluye: [] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extras: (q.extras ?? []) as any[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        servicios: (q.services ?? []) as any[],
        notaInterna: "",
      }, q.agent?.name ?? "Agente");
    } catch { alert("Error al generar el DOCX"); }
  }

  return (
    <div>
      {/* Pipeline KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Pipeline activo</p>
          <p className="text-xl font-bold text-white">{totalPipeline.toLocaleString("es-ES")} €</p>
        </div>
        <div className="bg-[#00D4AA]/8 border border-[#00D4AA]/20 rounded-xl p-4">
          <p className="text-xs text-[#00D4AA] mb-1">Cerradas</p>
          <p className="text-xl font-bold text-[#00D4AA]">{totalClosed.toLocaleString("es-ES")} €</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total propuestas</p>
          <p className="text-xl font-bold text-white">{quotations.length}</p>
        </div>
        <div className={`rounded-xl p-4 border ${overdueCount > 0 ? "bg-amber-500/8 border-amber-500/20" : "bg-white/[0.03] border-white/8"}`}>
          <p className={`text-xs mb-1 ${overdueCount > 0 ? "text-amber-400" : "text-slate-400"}`}>
            {overdueCount > 0 ? "Follow-ups vencidos" : "Tasa cierre"}
          </p>
          <p className={`text-xl font-bold ${overdueCount > 0 ? "text-amber-400" : "text-white"}`}>
            {overdueCount > 0 ? overdueCount : `${quotations.length ? Math.round((counts.closed / quotations.length) * 100) : 0}%`}
          </p>
        </div>
      </div>

      {/* Export CSV */}
      {quotations.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl transition-all"
          >
            <Download size={12} />
            Exportar CSV
          </button>
        </div>
      )}

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {([["all", "Todas", quotations.length], ...ALL_STATUSES.map(s => [s, STATUS_CONFIG[s as QuotationStatus].label, counts[s as QuotationStatus]])] as [string, string, number][]).map(([s, label, count]) => (
          <button
            key={s}
            onClick={() => setFilter(s as QuotationStatus | "all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              filter === s
                ? s === "all" ? "bg-white/10 border-white/20 text-white" : `${STATUS_CONFIG[s as QuotationStatus].bg} ${STATUS_CONFIG[s as QuotationStatus].color}`
                : "bg-white/[0.03] border-white/8 text-slate-400 hover:text-white"
            }`}
          >
            {s !== "all" && STATUS_CONFIG[s as QuotationStatus].icon}
            {label}
            <span className="bg-white/10 rounded-full px-1.5 py-0.5 text-[10px]">{count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p>No hay propuestas {filter !== "all" ? `con estado "${STATUS_CONFIG[filter as QuotationStatus].label}"` : "todavía"}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(q => {
            const sc = STATUS_CONFIG[q.status];
            const isOverdue = q.follow_up_date && q.follow_up_date < today && !["closed","lost"].includes(q.status);
            const isEditingFollowUp = editFollowUp === q.id;

            return (
              <div key={q.id} className={`bg-white/[0.03] border rounded-xl hover:border-white/15 transition-colors ${isOverdue ? "border-amber-500/30" : "border-white/8"}`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Status badge */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium shrink-0 ${sc.bg} ${sc.color}`}>
                    {sc.icon}
                    <span className="hidden sm:inline">{sc.label}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white truncate">{q.client_name}</p>
                      {q.client_sector && <span className="text-xs text-slate-500">{q.client_sector}</span>}
                      {isAdmin && q.agent && <span className="text-xs text-indigo-400">@{q.agent.nick}</span>}
                      {isOverdue && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded-full">
                          <AlertCircle size={9} /> Follow-up vencido
                        </span>
                      )}
                      {q.follow_up_date && !isOverdue && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <CalendarClock size={9} />
                          {new Date(q.follow_up_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">Plan {q.plan_name}</span>
                      <span className="text-xs font-semibold text-[#C9A84C]">{q.total_once.toLocaleString("es-ES")} €</span>
                      {q.total_monthly > 0 && <span className="text-xs text-slate-500">+{q.total_monthly.toLocaleString("es-ES")} €/mes</span>}
                      <span className="text-xs text-slate-600">{formatDate(q.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 relative">
                    {/* WhatsApp follow-up / enviar propuesta */}
                    {q.client_phone && (() => {
                      const followUpUrl = buildWhatsAppUrl(q, "followup");
                      return (
                        <a
                          href={followUpUrl ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={isOverdue ? "Seguimiento vencido — enviar WhatsApp" : "Contactar por WhatsApp"}
                          className={`p-2 rounded-lg transition-colors hover:bg-white/5 ${isOverdue ? "text-amber-400 hover:text-[#25D366]" : "text-slate-400 hover:text-[#25D366]"}`}
                        >
                          <Phone size={14} />
                        </a>
                      );
                    })()}
                    {/* Follow-up date */}
                    <button
                      onClick={() => { setEditFollowUp(isEditingFollowUp ? null : q.id); setFollowUpInput(q.follow_up_date ?? ""); }}
                      title="Recordatorio de seguimiento"
                      className={`p-2 rounded-lg transition-colors ${q.follow_up_date ? (isOverdue ? "text-amber-400" : "text-[#00D4AA]") : "text-slate-400 hover:text-white"} hover:bg-white/5`}
                    >
                      <CalendarClock size={14} />
                    </button>
                    <Link
                      href={`/tarificador/propuesta/${q.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver propuesta en PDF"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    {/* Copiar link */}
                    <button
                      onClick={() => shareQuotation(q)}
                      disabled={sharingId === q.id}
                      title={copiedId === q.id ? "¡Link copiado!" : "Copiar link de propuesta"}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedId === q.id
                          ? "text-[#00D4AA] bg-[#00D4AA]/10"
                          : "text-slate-400 hover:text-[#00D4AA] hover:bg-white/5"
                      }`}
                    >
                      {sharingId === q.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : copiedId === q.id
                        ? <Check size={14} />
                        : <Share2 size={14} />
                      }
                    </button>
                    {/* Enviar por WhatsApp con link */}
                    {q.client_phone && (
                      <button
                        onClick={() => shareViaWhatsApp(q)}
                        disabled={sharingId === q.id}
                        title="Enviar propuesta por WhatsApp"
                        className="p-2 rounded-lg text-slate-400 hover:text-[#25D366] hover:bg-white/5 transition-colors"
                      >
                        {sharingId === q.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <MessageCircle size={14} />
                        }
                      </button>
                    )}
                    <button onClick={() => downloadProp(q)} title="Descargar propuesta DOCX" className="p-2 rounded-lg text-slate-400 hover:text-[#C9A84C] hover:bg-white/5 transition-colors">
                      <FileDown size={14} />
                    </button>
                    <button onClick={() => downloadContract(q)} title="Descargar contrato" className="p-2 rounded-lg text-slate-400 hover:text-[#00D4AA] hover:bg-white/5 transition-colors">
                      <FileText size={14} />
                    </button>
                    <button
                      onClick={() => setOpenMenu(openMenu === q.id ? null : q.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {updating === q.id ? <Loader2 size={14} className="animate-spin" /> : <MoreHorizontal size={14} />}
                    </button>

                    <AnimatePresence>
                      {openMenu === q.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          className="absolute right-0 top-9 bg-[#0D1117] border border-white/12 rounded-xl shadow-xl z-20 min-w-[160px] py-1 overflow-hidden"
                        >
                          <p className="text-[10px] text-slate-500 px-3 py-1.5 uppercase tracking-wide">Cambiar estado</p>
                          {ALL_STATUSES.filter(s => s !== q.status).map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(q.id, s)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${STATUS_CONFIG[s].color}`}
                            >
                              {STATUS_CONFIG[s].icon}
                              {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                          <div className="border-t border-white/8 mt-1 pt-1">
                            <button
                              onClick={() => { setOpenMenu(null); cloneQuotation(q); }}
                              disabled={cloningId === q.id}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
                            >
                              {cloningId === q.id ? <Loader2 size={11} className="animate-spin" /> : <Copy size={11} />}
                              Duplicar propuesta
                            </button>
                            <button
                              onClick={() => { setOpenMenu(null); deleteQuotation(q.id); }}
                              disabled={deleting === q.id}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={11} />
                              Eliminar
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Follow-up date editor */}
                {isEditingFollowUp && (
                  <div className="px-4 pb-4 border-t border-white/8 pt-3 flex items-center gap-3 flex-wrap">
                    <CalendarClock size={13} className="text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400">Recordatorio de seguimiento:</span>
                    <input
                      type="date"
                      value={followUpInput}
                      onChange={e => setFollowUpInput(e.target.value)}
                      min={today}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                    />
                    <button
                      onClick={() => saveFollowUp(q.id)}
                      disabled={savingFollowUp}
                      className="px-3 py-1.5 bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-40 text-black text-xs font-semibold rounded-lg transition-colors"
                    >
                      {savingFollowUp ? <Loader2 size={11} className="animate-spin" /> : "Guardar"}
                    </button>
                    {q.follow_up_date && (
                      <button
                        onClick={() => { setFollowUpInput(""); saveFollowUp(q.id); }}
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
      )}
    </div>
  );
}
