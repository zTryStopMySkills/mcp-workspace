"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Search, ChevronDown, ChevronUp, Mail, Phone, FileDown, FileText, Users } from "lucide-react";
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
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = clients.filter(c =>
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    (c.sector ?? "").toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o sector…"
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((client, i) => {
          const key = client.clientName.toLowerCase();
          const isOpen = expanded === key;
          const lastStatus = client.proposals[0]?.status as QuotationStatus;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden"
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/25 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-[#00D4AA]" />
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
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {client.email && <span className="flex items-center gap-1 text-xs text-slate-500"><Mail size={10} />{client.email}</span>}
                    {client.phone && <span className="flex items-center gap-1 text-xs text-slate-500"><Phone size={10} />{client.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
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
                  {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </button>

              {/* Expanded proposals */}
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
                      {client.proposals.map(q => (
                        <div key={q.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-white">Plan {q.plan_name}</span>
                              <span className="text-xs font-semibold text-[#C9A84C]">{q.total_once.toLocaleString("es-ES")} €</span>
                              {q.total_monthly > 0 && <span className="text-xs text-slate-500">+{q.total_monthly.toLocaleString("es-ES")} €/mes</span>}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{formatDate(q.created_at)}</p>
                          </div>
                          <span className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium shrink-0 ${STATUS_COLORS[q.status as QuotationStatus]}`}>
                            {STATUS_LABELS[q.status as QuotationStatus]}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => downloadProp(q)} title="Propuesta" className="p-1.5 text-slate-500 hover:text-[#C9A84C] hover:bg-white/5 rounded-lg transition-colors">
                              <FileDown size={13} />
                            </button>
                            <button onClick={() => downloadContract(q)} title="Contrato" className="p-1.5 text-slate-500 hover:text-[#00D4AA] hover:bg-white/5 rounded-lg transition-colors">
                              <FileText size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
