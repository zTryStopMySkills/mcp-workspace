"use client";

import { useState } from "react";
import { ChevronDown, Phone, Mail, MapPin, Briefcase, Tag, User, Loader2, UserCheck, Calculator } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  nick: string;
  name: string;
}

interface Lead {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string;
  email?: string;
  sector?: string;
  plan_interest?: string;
  location?: string;
  has_web?: boolean;
  message?: string;
  status: "new" | "contacted" | "converted" | "lost";
  assigned_to?: string | null;
  assigned_agent?: { id: string; nick: string; name: string } | null;
  created_at: string;
}

const STATUS_CONFIG = {
  new: { label: "Nuevo", bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  contacted: { label: "Contactado", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  converted: { label: "Convertido", bg: "bg-[#00D4AA]/15", text: "text-[#00D4AA]", border: "border-[#00D4AA]/30" },
  lost: { label: "Perdido", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
};

const STATUS_OPTIONS: Array<Lead["status"]> = ["new", "contacted", "converted", "lost"];

const PLAN_LABELS: Record<string, string> = {
  basico: "Básico (399€)",
  estandar: "Estándar (649€)",
  premium: "Premium (999€)",
  saas: "SaaS (desde 1.800€)",
  nodecidido: "Sin decidir",
};

interface Props {
  leads: Lead[];
  agents: Agent[];
}

export function LeadsClient({ leads: initialLeads, agents }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  const [agentDropdown, setAgentDropdown] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAgent, setFilterAgent] = useState<string>("all");

  const filteredLeads = leads.filter(l => {
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    const matchAgent = filterAgent === "all"
      ? true
      : filterAgent === "unassigned"
      ? !l.assigned_to
      : l.assigned_to === filterAgent;
    return matchStatus && matchAgent;
  });

  const unassignedCount = leads.filter(l => !l.assigned_to).length;

  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    setStatusDropdown(null);
    setUpdatingId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Error");
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch {
      alert("Error al actualizar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssign = async (leadId: string, agentId: string | null) => {
    setAgentDropdown(null);
    setAssigningId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_to: agentId }),
      });
      if (!res.ok) throw new Error("Error");
      const agent = agents.find(a => a.id === agentId) ?? null;
      setLeads(prev => prev.map(l =>
        l.id === leadId
          ? { ...l, assigned_to: agentId, assigned_agent: agent }
          : l
      ));
    } catch {
      alert("Error al asignar el agente");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filterStatus === "all" ? "bg-white/15 text-white" : "text-[#8B95A9] hover:text-white hover:bg-white/8"
          }`}
        >
          Todos ({leads.length})
        </button>
        {STATUS_OPTIONS.map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = leads.filter(l => l.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterStatus === s ? `${cfg.bg} ${cfg.text} border ${cfg.border}` : "text-[#8B95A9] hover:text-white hover:bg-white/8"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Agent filter */}
      {agents.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterAgent("all")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterAgent === "all" ? "bg-white/15 text-white" : "text-[#8B95A9] hover:text-white hover:bg-white/8"
            }`}
          >
            <User size={11} /> Todos los agentes
          </button>
          <button
            onClick={() => setFilterAgent("unassigned")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterAgent === "unassigned"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                : "text-[#8B95A9] hover:text-white hover:bg-white/8"
            }`}
          >
            Sin asignar
            {unassignedCount > 0 && (
              <span className="bg-amber-500/20 text-amber-400 rounded-full px-1.5 text-[10px]">
                {unassignedCount}
              </span>
            )}
          </button>
          {agents.map(a => (
            <button
              key={a.id}
              onClick={() => setFilterAgent(filterAgent === a.id ? "all" : a.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterAgent === a.id
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
                  : "text-[#8B95A9] hover:text-white hover:bg-white/8"
              }`}
            >
              @{a.nick}
            </button>
          ))}
        </div>
      )}

      {/* Leads list */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 text-[#8B95A9]">
          <p className="text-lg">No hay leads todavía</p>
          <p className="text-sm mt-1">Cuando alguien solicite un presupuesto en la landing aparecerá aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map(lead => {
            const cfg = STATUS_CONFIG[lead.status];
            const isExpanded = expandedId === lead.id;
            const rowBg = lead.status === "new" ? "bg-blue-500/[0.04]" : "bg-white/[0.03]";
            const assignedAgent = lead.assigned_agent ?? agents.find(a => a.id === lead.assigned_to);

            return (
              <div
                key={lead.id}
                className={`${rowBg} border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-all`}
              >
                {/* Main row */}
                <div className="flex items-center gap-3 p-4">
                  {/* Status badge with dropdown */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setStatusDropdown(statusDropdown === lead.id ? null : lead.id)}
                      disabled={updatingId === lead.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} hover:brightness-125 transition-all disabled:opacity-50`}
                    >
                      {updatingId === lead.id ? <Loader2 size={10} className="animate-spin" /> : cfg.label}
                      <ChevronDown size={11} />
                    </button>
                    {statusDropdown === lead.id && (
                      <div className="absolute top-full left-0 mt-1 bg-[#0D1117] border border-white/15 rounded-xl p-1.5 z-20 min-w-[140px] shadow-xl">
                        {STATUS_OPTIONS.filter(s => s !== lead.status).map(s => {
                          const c = STATUS_CONFIG[s];
                          return (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(lead.id, s)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${c.text} hover:bg-white/5 transition-colors`}
                            >
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Business & contact info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <p className="font-semibold text-white text-sm">{lead.business_name}</p>
                      {lead.plan_interest && lead.plan_interest !== "nodecidido" && (
                        <span className="text-xs text-[#00D4AA] font-medium">{PLAN_LABELS[lead.plan_interest] ?? lead.plan_interest}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                      <span className="text-xs text-[#8B95A9]">{lead.contact_name}</span>
                      {lead.sector && <span className="text-xs text-[#8B95A9]/60">{lead.sector}</span>}
                      {lead.location && <span className="text-xs text-[#8B95A9]/60">{lead.location}</span>}
                    </div>
                  </div>

                  {/* Agent assignment */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setAgentDropdown(agentDropdown === lead.id ? null : lead.id)}
                      disabled={assigningId === lead.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                        assignedAgent
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20"
                          : "bg-white/5 text-slate-500 border-white/10 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {assigningId === lead.id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : assignedAgent ? (
                        <UserCheck size={11} />
                      ) : (
                        <User size={11} />
                      )}
                      <span className="hidden sm:inline">
                        {assignedAgent ? `@${assignedAgent.nick}` : "Asignar"}
                      </span>
                    </button>
                    {agentDropdown === lead.id && (
                      <div className="absolute right-0 top-full mt-1 bg-[#0D1117] border border-white/15 rounded-xl p-1.5 z-20 min-w-[150px] shadow-xl">
                        <p className="text-[10px] text-slate-500 px-3 py-1 uppercase tracking-wide">Asignar agente</p>
                        {agents.map(a => (
                          <button
                            key={a.id}
                            onClick={() => handleAssign(lead.id, a.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                              lead.assigned_to === a.id
                                ? "text-indigo-400 bg-indigo-500/10"
                                : "text-slate-300 hover:bg-white/5"
                            }`}
                          >
                            <User size={10} />
                            @{a.nick} — {a.name.split(" ")[0]}
                          </button>
                        ))}
                        {lead.assigned_to && (
                          <>
                            <div className="border-t border-white/8 mt-1 pt-1" />
                            <button
                              onClick={() => handleAssign(lead.id, null)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              Quitar asignación
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <a
                    href={`tel:${lead.phone}`}
                    className="hidden sm:flex items-center gap-1.5 text-xs text-[#00D4AA] font-medium hover:underline shrink-0"
                  >
                    <Phone size={12} />
                    {lead.phone}
                  </a>

                  {/* Date */}
                  <p className="hidden md:block text-xs text-[#8B95A9] shrink-0">
                    {new Date(lead.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="text-[#8B95A9] hover:text-white transition-colors shrink-0 ml-1"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/8 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={13} className="text-[#8B95A9] shrink-0" />
                        <a href={`tel:${lead.phone}`} className="text-[#00D4AA] hover:underline">{lead.phone}</a>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={13} className="text-[#8B95A9] shrink-0" />
                        <a href={`mailto:${lead.email}`} className="text-[#00D4AA] hover:underline">{lead.email}</a>
                      </div>
                    )}
                    {lead.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={13} className="text-[#8B95A9] shrink-0" />
                        <span className="text-[#8B95A9]">{lead.location}</span>
                      </div>
                    )}
                    {lead.sector && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={13} className="text-[#8B95A9] shrink-0" />
                        <span className="text-[#8B95A9]">{lead.sector}</span>
                      </div>
                    )}
                    {lead.plan_interest && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag size={13} className="text-[#8B95A9] shrink-0" />
                        <span className="text-[#8B95A9]">Plan: {PLAN_LABELS[lead.plan_interest] ?? lead.plan_interest}</span>
                      </div>
                    )}
                    {assignedAgent && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck size={13} className="text-indigo-400 shrink-0" />
                        <span className="text-indigo-400">Asignado a @{assignedAgent.nick}</span>
                      </div>
                    )}
                    {lead.has_web && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-[#8B95A9]/70 bg-white/8 px-2 py-0.5 rounded">Ya tiene web</span>
                      </div>
                    )}
                    {lead.message && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-[#8B95A9]/70 mb-1">Mensaje:</p>
                        <p className="text-sm text-[#8B95A9] bg-white/[0.04] rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                      </div>
                    )}
                    {/* WhatsApp CTA */}
                    <div className="sm:col-span-2 mt-1 flex items-center gap-3 flex-wrap">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(lead.contact_name)},%20soy%20de%20Agentalia-webs.%20He%20recibido%20tu%20solicitud%20para%20${encodeURIComponent(lead.business_name)}.%20%C2%BFCu%C3%A1ndo%20te%20va%20bien%20hablar%3F`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#25D366]/25 transition-colors"
                      >
                        <Phone size={12} />
                        Contactar por WhatsApp
                      </a>
                      <Link
                        href={`/tarificador?empresa=${encodeURIComponent(lead.business_name)}&email=${encodeURIComponent(lead.email ?? "")}&telefono=${encodeURIComponent(lead.phone)}&sector=${encodeURIComponent(lead.sector ?? "")}`}
                        className="inline-flex items-center gap-2 bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-[#00D4AA] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#00D4AA]/25 transition-colors"
                      >
                        <Calculator size={12} />
                        Crear propuesta
                      </Link>
                    </div>
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
