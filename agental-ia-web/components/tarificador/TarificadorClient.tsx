"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, ChevronRight, ChevronLeft, Check, Globe, Wrench,
  TrendingUp, Share2, ShoppingCart, Loader2, FileDown, FileText,
  User, Building2, Mail, Phone, ExternalLink, Save, History,
  BookTemplate, Trash2, MessageSquare, ChevronDown
} from "lucide-react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────

export interface PlanItem {
  id: string;
  nombre: string;
  precio: number;
  precioLibre?: boolean;
  descripcion: string;
  incluye: string[];
  color: string;
  destacado?: boolean;
}

export interface ExtraItem { id: string; nombre: string; precio: number; icono: string; }
export interface ServicioItem { id: string; nombre: string; precio: number; icono: string; descripcion: string; }

export interface TarificadorData {
  cliente: {
    empresa: string;
    sector: string;
    tieneWeb: boolean;
    urlWeb: string;
    email: string;
    telefono: string;
  };
  plan: PlanItem;
  extras: ExtraItem[];
  servicios: ServicioItem[];
  notaInterna: string;
}

// ── Catálogo ────────────────────────────────────────────────────────────

const PLANES: PlanItem[] = [
  {
    id: "basico", nombre: "Básico", precio: 399, color: "#64748b",
    descripcion: "Presencia digital profesional para negocios que empiezan.",
    incluye: ["Landing page + sección contacto", "Diseño responsive (móvil/tablet)", "Formulario de contacto", "Integración WhatsApp", "SEO técnico básico", "Entrega en 7-10 días"]
  },
  {
    id: "estandar", nombre: "Estándar", precio: 649, color: "#00D4AA", destacado: true,
    descripcion: "Web completa con galería, blog y posicionamiento local.",
    incluye: ["Todo el plan Básico", "Galería de fotos/vídeos", "Blog o novedades", "Hasta 5 secciones", "Google My Business", "SEO local optimizado", "Mapa y horarios"]
  },
  {
    id: "premium", nombre: "Premium", precio: 999, color: "#C9A84C",
    descripcion: "Web avanzada con reservas, pedidos y panel de administración.",
    incluye: ["Todo el plan Estándar", "Sistema de reservas o pedidos", "Panel de administración", "Animaciones premium", "Integración redes sociales", "Analítica avanzada", "Soporte 30 días"]
  },
  {
    id: "saas", nombre: "SaaS / A medida", precio: 1800, precioLibre: true, color: "#8b5cf6",
    descripcion: "Proyecto personalizado con funcionalidades únicas y a escala.",
    incluye: ["Todo el plan Premium", "Funciones a medida", "Integraciones API externas", "Backoffice personalizado", "Escalabilidad garantizada", "Consultoría estratégica", "Soporte 90 días"]
  },
];

const EXTRAS: ExtraItem[] = [
  { id: "dominio", nombre: "Dominio .es / .com (1 año)", precio: 15, icono: "🌐" },
  { id: "hosting", nombre: "Hosting 1 año", precio: 100, icono: "🖥️" },
  { id: "pasarela", nombre: "Integración pasarela de pago", precio: 150, icono: "💳" },
  { id: "reservas", nombre: "Sistema de reservas avanzado", precio: 199, icono: "📅" },
  { id: "tienda", nombre: "Tienda online (catálogo + carrito)", precio: 299, icono: "🛒" },
];

const SERVICIOS: ServicioItem[] = [
  { id: "mant", nombre: "Mantenimiento web", precio: 39, icono: "🔧", descripcion: "Actualizaciones, backups, seguridad y soporte técnico mensual" },
  { id: "seo", nombre: "SEO + posicionamiento Google", precio: 99, icono: "📈", descripcion: "Contenido optimizado, auditorías y mejora de posiciones en Google" },
  { id: "rrss", nombre: "Gestión redes sociales", precio: 149, icono: "📱", descripcion: "Publicaciones semanales, diseño gráfico y gestión de comunidad" },
  { id: "pack", nombre: "Pack completo (mant + SEO + RRSS)", precio: 249, icono: "⭐", descripcion: "Los 3 servicios anteriores con tarifa especial" },
];

const SECTORES = ["Restauración", "Retail / Tienda", "Servicios profesionales", "Ocio y entretenimiento", "Salud y bienestar", "Educación", "Otro"];

// ── Step indicator ───────────────────────────────────────────────────────

function StepDot({ n, current, label }: { n: number; current: number; label: string }) {
  const done = n < current;
  const active = n === current;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        done ? "bg-[#00D4AA] text-black" : active ? "bg-[#00D4AA]/20 border-2 border-[#00D4AA] text-[#00D4AA]" : "bg-white/5 border border-white/15 text-slate-500"
      }`}>
        {done ? <Check size={14} /> : n}
      </div>
      <span className={`text-[10px] font-medium ${active ? "text-[#00D4AA]" : done ? "text-slate-400" : "text-slate-600"}`}>{label}</span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────

interface TarificadorClientProps {
  agentName: string;
  initialCliente?: { empresa: string; sector: string; tieneWeb: boolean; urlWeb: string; email: string; telefono: string };
}

export function TarificadorClient({ agentName, initialCliente }: TarificadorClientProps) {
  const [step, setStep] = useState(1);
  const [generatingProp, setGeneratingProp] = useState(false);
  const [generatingCont, setGeneratingCont] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<{ id: string; name: string; plan_id: string; plan_name: string; plan_price: number; extras: ExtraItem[]; services: ServicioItem[] }[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [cliente, setCliente] = useState(
    initialCliente ?? {
      empresa: "", sector: SECTORES[0], tieneWeb: false, urlWeb: "", email: "", telefono: ""
    }
  );
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanItem>(PLANES[1]);
  const [precioSaas, setPrecioSaas] = useState(1800);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Set<string>>(new Set());
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Set<string>>(new Set());
  const [notaInterna, setNotaInterna] = useState("");

  function toggleExtra(id: string) {
    setExtrasSeleccionados(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  function toggleServicio(id: string) {
    setServiciosSeleccionados(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  const planFinal: PlanItem = {
    ...planSeleccionado,
    precio: planSeleccionado.id === "saas" ? precioSaas : planSeleccionado.precio
  };
  const extrasLista = EXTRAS.filter(e => extrasSeleccionados.has(e.id));
  const serviciosLista = SERVICIOS.filter(s => serviciosSeleccionados.has(s.id));
  const totalUnico = planFinal.precio + extrasLista.reduce((s, e) => s + e.precio, 0);
  const totalMensual = serviciosLista.reduce((s, sv) => s + sv.precio, 0);

  const datosCompletos: TarificadorData = {
    cliente, plan: planFinal, extras: extrasLista, servicios: serviciosLista, notaInterna
  };

  const canGoNext = step === 1 ? cliente.empresa.trim().length > 0 : true;

  async function handlePropuesta() {
    setGeneratingProp(true);
    try {
      const { generarPropuesta } = await import("@/lib/docx/propuesta");
      await generarPropuesta(datosCompletos, agentName);
    } catch (err) {
      console.error(err);
      alert("Error al generar la propuesta. Inténtalo de nuevo.");
    } finally {
      setGeneratingProp(false);
    }
  }

  async function loadTemplates() {
    try {
      const res = await fetch("/api/quotation-templates");
      if (res.ok) setTemplates(await res.json());
    } catch { /* ignore */ }
  }

  async function handleSaveTemplate() {
    const name = prompt("Nombre de la plantilla:");
    if (!name?.trim()) return;
    setSavingTemplate(true);
    try {
      await fetch("/api/quotation-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          plan_id: planFinal.id,
          plan_name: planFinal.nombre,
          plan_price: planFinal.precio,
          extras: extrasLista,
          services: serviciosLista,
        }),
      });
      await loadTemplates();
    } catch { /* ignore */ } finally {
      setSavingTemplate(false);
    }
  }

  async function handleDeleteTemplate(id: string) {
    await fetch("/api/quotation-templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTemplates(prev => prev.filter(t => t.id !== id));
  }

  function applyTemplate(t: typeof templates[0]) {
    const plan = PLANES.find(p => p.id === t.plan_id);
    if (plan) {
      setPlanSeleccionado(plan);
      if (plan.id === "saas") setPrecioSaas(t.plan_price);
    }
    setExtrasSeleccionados(new Set((t.extras ?? []).map((e: ExtraItem) => e.id)));
    setServiciosSeleccionados(new Set((t.services ?? []).map((s: ServicioItem) => s.id)));
    setShowTemplates(false);
    setStep(3);
  }

  function handleWhatsApp() {
    const lines = [
      `*Propuesta Agental.IA para ${cliente.empresa}*`,
      ``,
      `📋 *Plan:* ${planFinal.nombre} — ${planFinal.precio.toLocaleString("es-ES")} €`,
      extrasLista.length > 0 ? `➕ *Extras:* ${extrasLista.map(e => e.nombre).join(", ")}` : null,
      serviciosLista.length > 0 ? `🔄 *Recurrente:* ${serviciosLista.map(s => s.nombre).join(", ")} (${totalMensual.toLocaleString("es-ES")} €/mes)` : null,
      ``,
      `💰 *Total pago único: ${totalUnico.toLocaleString("es-ES")} €*`,
      totalMensual > 0 ? `📅 *Total mensual: ${totalMensual.toLocaleString("es-ES")} €/mes*` : null,
      ``,
      `¿Hablamos para confirmar los detalles?`,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
  }

  async function handleGuardar() {
    setSaving(true);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: cliente.empresa,
          client_email: cliente.email || null,
          client_phone: cliente.telefono || null,
          client_sector: cliente.sector,
          has_web: cliente.tieneWeb,
          client_web_url: cliente.urlWeb || null,
          plan_id: planFinal.id,
          plan_name: planFinal.nombre,
          plan_price: planFinal.precio,
          extras: extrasLista,
          services: serviciosLista,
          total_once: totalUnico,
          total_monthly: totalMensual,
          notes: notaInterna || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedId(data.id);
      } else {
        const data = await res.json();
        alert(data.error ?? "Error al guardar la propuesta.");
      }
    } catch {
      alert("Error de red al guardar la propuesta.");
    } finally {
      setSaving(false);
    }
  }

  async function handleContrato() {
    setGeneratingCont(true);
    try {
      const { generarContrato } = await import("@/lib/docx/contrato");
      await generarContrato(datosCompletos, agentName);
    } catch (err) {
      console.error(err);
      alert("Error al generar el contrato. Inténtalo de nuevo.");
    } finally {
      setGeneratingCont(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/25 flex items-center justify-center">
          <Calculator size={20} className="text-[#00D4AA]" />
        </div>
        <div>
          <p className="text-[#00D4AA] text-sm font-medium">Herramienta comercial</p>
          <h1 className="text-2xl font-bold text-white">Tarificador</h1>
        </div>
      </div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-slate-400 text-sm">Configura la propuesta para tu cliente y genera los documentos en segundos.</p>
        <div className="relative shrink-0 ml-4">
          <button
            onClick={() => { setShowTemplates(!showTemplates); if (!showTemplates) loadTemplates(); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-colors"
          >
            <BookTemplate size={13} />
            Plantillas
            <ChevronDown size={11} className={`transition-transform ${showTemplates ? "rotate-180" : ""}`} />
          </button>
          {showTemplates && (
            <div className="absolute right-0 top-10 w-72 bg-[#0D1117] border border-white/12 rounded-xl shadow-2xl z-20 py-1 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/8">
                <span className="text-xs font-medium text-slate-400">Mis plantillas</span>
                <button
                  onClick={handleSaveTemplate}
                  disabled={savingTemplate}
                  className="flex items-center gap-1 text-xs text-[#00D4AA] hover:text-white transition-colors disabled:opacity-50"
                >
                  {savingTemplate ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                  Guardar actual
                </button>
              </div>
              {templates.length === 0 ? (
                <p className="text-xs text-slate-500 px-3 py-4 text-center">Sin plantillas aún</p>
              ) : (
                templates.map(t => (
                  <div key={t.id} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors">
                    <button onClick={() => applyTemplate(t)} className="flex-1 text-left">
                      <p className="text-sm text-white truncate">{t.name}</p>
                      <p className="text-xs text-slate-500">Plan {t.plan_name} · {t.plan_price.toLocaleString("es-ES")} €</p>
                    </button>
                    <button onClick={() => handleDeleteTemplate(t.id)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3,4].map((n, i) => (
          <div key={n} className="flex items-center gap-2">
            <StepDot n={n} current={step} label={["Cliente","Plan web","Servicios","Resumen"][i]} />
            {i < 3 && <div className={`h-px flex-1 w-8 ${n < step ? "bg-[#00D4AA]/50" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18 }}
        >

          {/* ── PASO 1: Datos cliente ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Datos del cliente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Empresa / Nombre del negocio *</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={cliente.empresa}
                      onChange={e => setCliente({ ...cliente, empresa: e.target.value })}
                      placeholder="Ej: Bar La Espuela"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Sector</label>
                  <select
                    value={cliente.sector}
                    onChange={e => setCliente({ ...cliente, sector: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                  >
                    {SECTORES.map(s => <option key={s} value={s} className="bg-[#0D1117]">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={cliente.email}
                      onChange={e => setCliente({ ...cliente, email: e.target.value })}
                      placeholder="cliente@email.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Teléfono</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={cliente.telefono}
                      onChange={e => setCliente({ ...cliente, telefono: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={cliente.tieneWeb}
                    onChange={e => setCliente({ ...cliente, tieneWeb: e.target.checked })}
                    className="accent-[#00D4AA] w-4 h-4"
                  />
                  <Globe size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-300">El cliente ya tiene una web</span>
                </label>
                {cliente.tieneWeb && (
                  <div className="relative ml-6">
                    <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="url"
                      value={cliente.urlWeb}
                      onChange={e => setCliente({ ...cliente, urlWeb: e.target.value })}
                      placeholder="https://..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PASO 2: Plan web ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Selecciona el plan web</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLANES.map(plan => {
                  const selected = planSeleccionado.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setPlanSeleccionado(plan)}
                      className={`relative text-left p-5 rounded-2xl border transition-all ${
                        selected
                          ? "border-[#00D4AA]/60 bg-[#00D4AA]/8 shadow-lg shadow-[#00D4AA]/5"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      {plan.destacado && (
                        <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-[#00D4AA] text-black px-2 py-0.5 rounded-full">MÁS POPULAR</span>
                      )}
                      {selected && <Check size={16} className="absolute top-4 right-4 text-[#00D4AA]" />}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold" style={{ color: plan.color }}>
                          {plan.id === "saas" ? "desde " : ""}{plan.precio.toLocaleString("es-ES")} €
                        </span>
                      </div>
                      <p className="font-semibold text-white mb-1">{plan.nombre}</p>
                      <p className="text-xs text-slate-400 mb-3">{plan.descripcion}</p>
                      <ul className="space-y-1">
                        {plan.incluye.slice(0, 4).map(item => (
                          <li key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Check size={11} className="shrink-0" style={{ color: plan.color }} />
                            {item}
                          </li>
                        ))}
                        {plan.incluye.length > 4 && (
                          <li className="text-xs text-slate-500 pl-4">+{plan.incluye.length - 4} más incluido</li>
                        )}
                      </ul>
                    </button>
                  );
                })}
              </div>
              {planSeleccionado.id === "saas" && (
                <div className="mt-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio personalizado del proyecto (€)</label>
                  <input
                    type="number"
                    min={1800}
                    step={100}
                    value={precioSaas}
                    onChange={e => setPrecioSaas(Number(e.target.value))}
                    className="w-48 px-4 py-2.5 bg-white/5 border border-purple-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-purple-400/60 transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* ── PASO 3: Extras + servicios ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Extras (pago único)</h2>
                <p className="text-xs text-slate-500 mb-4">Servicios adicionales que se suman al plan.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EXTRAS.map(extra => {
                    const checked = extrasSeleccionados.has(extra.id);
                    return (
                      <label key={extra.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        checked ? "border-[#C9A84C]/40 bg-[#C9A84C]/8" : "border-white/10 hover:border-white/20"
                      }`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleExtra(extra.id)} className="accent-[#C9A84C] w-4 h-4 shrink-0" />
                        <span className="text-xl">{extra.icono}</span>
                        <div className="flex-1">
                          <p className="text-sm text-white">{extra.nombre}</p>
                          <p className="text-xs text-[#C9A84C] font-semibold">{extra.precio.toLocaleString("es-ES")} €</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Servicios mensuales</h2>
                <p className="text-xs text-slate-500 mb-4">Facturación recurrente mensual.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SERVICIOS.map(svc => {
                    const checked = serviciosSeleccionados.has(svc.id);
                    return (
                      <label key={svc.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        checked ? "border-[#00D4AA]/40 bg-[#00D4AA]/8" : "border-white/10 hover:border-white/20"
                      }`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleServicio(svc.id)} className="accent-[#00D4AA] w-4 h-4 shrink-0" />
                        <span className="text-xl">{svc.icono}</span>
                        <div className="flex-1">
                          <p className="text-sm text-white">{svc.nombre}</p>
                          <p className="text-xs text-[#00D4AA] font-semibold">{svc.precio.toLocaleString("es-ES")} €/mes</p>
                          <p className="text-xs text-slate-500 mt-0.5">{svc.descripcion}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nota interna del agente (no aparece en el contrato del cliente)</label>
                <textarea
                  value={notaInterna}
                  onChange={e => setNotaInterna(e.target.value)}
                  placeholder="Observaciones, condiciones especiales, descuentos pactados..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/40 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* ── PASO 4: Resumen ── */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Resumen del presupuesto</h2>

              {/* Cliente */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">Cliente</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div>
                    <p className="text-base font-semibold text-white">{cliente.empresa}</p>
                    <p className="text-xs text-slate-400">{cliente.sector}</p>
                  </div>
                  {cliente.email && <p className="text-sm text-slate-300 self-center">{cliente.email}</p>}
                  {cliente.telefono && <p className="text-sm text-slate-300 self-center">{cliente.telefono}</p>}
                </div>
              </div>

              {/* Servicios */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Desglose</p>

                <div className="flex justify-between items-center py-2 border-b border-white/8">
                  <span className="text-sm text-white font-medium">Plan {planFinal.nombre}</span>
                  <span className="text-sm font-bold text-white">{planFinal.precio.toLocaleString("es-ES")} €</span>
                </div>

                {extrasLista.map(e => (
                  <div key={e.id} className="flex justify-between items-center py-1">
                    <span className="text-sm text-slate-300">{e.icono} {e.nombre}</span>
                    <span className="text-sm text-slate-300">{e.precio.toLocaleString("es-ES")} €</span>
                  </div>
                ))}

                {serviciosLista.map(s => (
                  <div key={s.id} className="flex justify-between items-center py-1">
                    <span className="text-sm text-slate-400 italic">{s.icono} {s.nombre}</span>
                    <span className="text-sm text-slate-400 italic">{s.precio.toLocaleString("es-ES")} €/mes</span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-5 text-center">
                  <p className="text-xs text-[#C9A84C] uppercase tracking-wide mb-1">Pago único</p>
                  <p className="text-3xl font-bold text-[#C9A84C]">{totalUnico.toLocaleString("es-ES")} €</p>
                </div>
                {totalMensual > 0 && (
                  <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-2xl p-5 text-center">
                    <p className="text-xs text-[#00D4AA] uppercase tracking-wide mb-1">Mensual recurrente</p>
                    <p className="text-3xl font-bold text-[#00D4AA]">{totalMensual.toLocaleString("es-ES")} €</p>
                    <p className="text-xs text-slate-400 mt-1">/ mes</p>
                  </div>
                )}
              </div>

              {notaInterna && (
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs font-medium text-amber-400 mb-1">Nota interna (no va al cliente)</p>
                  <p className="text-sm text-amber-200/80">{notaInterna}</p>
                </div>
              )}

              {/* Guardar en historial */}
              <div className="flex items-center gap-3">
                {savedId ? (
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-xl text-sm text-[#00D4AA]">
                    <Check size={16} />
                    <span>Propuesta guardada en el historial.</span>
                    <Link href="/tarificador/historial" className="ml-auto underline underline-offset-2 text-xs">Ver historial →</Link>
                  </div>
                ) : (
                  <button
                    onClick={handleGuardar}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-3 bg-white/8 border border-white/15 hover:bg-white/12 hover:border-white/25 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Guardar en historial
                  </button>
                )}
                <Link
                  href="/tarificador/historial"
                  className="flex items-center gap-1.5 px-4 py-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <History size={15} />
                  <span className="hidden sm:inline">Ver propuestas anteriores</span>
                </Link>
              </div>

              {/* WhatsApp share */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-600/15 border border-green-500/30 hover:bg-green-600/25 text-green-400 font-medium rounded-xl text-sm transition-colors"
              >
                <MessageSquare size={16} />
                Compartir resumen por WhatsApp
              </button>

              {/* Botones de descarga */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePropuesta}
                  disabled={generatingProp}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A84C] hover:bg-[#C9A84C]/80 disabled:opacity-50 text-black font-semibold rounded-xl text-sm transition-colors"
                >
                  {generatingProp ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                  Descargar Propuesta interna
                </button>
                <button
                  onClick={handleContrato}
                  disabled={generatingCont}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-50 text-black font-semibold rounded-xl text-sm transition-colors"
                >
                  {generatingCont ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                  Descargar Contrato cliente
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center">Los archivos se descargan directamente en tu dispositivo · No se almacenan en el servidor</p>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-white/8">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-0"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        {step < 4 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canGoNext}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-[#00D4AA] hover:bg-[#00D4AA]/80 rounded-xl transition-colors disabled:opacity-40"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
