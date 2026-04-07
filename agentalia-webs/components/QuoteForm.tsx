"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Send, Loader2 } from "lucide-react";
import Tilt3D from "./Tilt3D";

const sectores = [
  "Restaurante", "Bar / Cafetería", "Cocktail bar", "Bodega / Taberna",
  "Tienda de ropa", "Tienda de alimentación", "Floristería", "Panadería / Pastelería",
  "Peluquería / Barbería", "Peluquería canina", "Clínica / Centro médico",
  "Gimnasio / Fitness", "Academia / Formación", "Hotel / Alojamiento",
  "Fontanero / Electricista", "Inmobiliaria", "Asesoría / Gestoría",
  "Otro tipo de negocio",
];

const planes = [
  { id: "basico", name: "Básico", price: "399€" },
  { id: "estandar", name: "Estándar", price: "649€" },
  { id: "premium", name: "Premium", price: "999€" },
  { id: "saas", name: "SaaS / A medida", price: "desde 1.800€" },
  { id: "nodecidido", name: "Aún no lo sé", price: "Asesorarme" },
];

const serviciosMensuales = [
  { id: "mantenimiento", label: "Mantenimiento web", price: "39€/mes" },
  { id: "seo", label: "SEO + Posicionamiento Google", price: "99€/mes" },
  { id: "rrss", label: "Gestión redes sociales", price: "149€/mes" },
  { id: "pack", label: "Pack completo", price: "249€/mes" },
];

interface QuoteFormProps {
  selectedPlan?: string;
}

export default function QuoteForm({ selectedPlan }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    business_name: "",
    sector: "",
    location: "",
    has_web: false,
    plan_interest: selectedPlan ?? "",
    services: [] as string[],
    contact_name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (selectedPlan) {
      setData((d) => ({ ...d, plan_interest: selectedPlan }));
    }
  }, [selectedPlan]);

  const toggleService = (id: string) => {
    setData((d) => ({
      ...d,
      services: d.services.includes(id) ? d.services.filter((s) => s !== id) : [...d.services, id],
    }));
  };

  const canNext = () => {
    if (step === 1) return data.business_name.trim().length > 0 && data.sector.length > 0;
    if (step === 2) return data.plan_interest.length > 0;
    if (step === 3) return data.contact_name.trim().length > 0 && data.phone.trim().length > 0;
    return false;
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: data.business_name,
          contact_name: data.contact_name,
          phone: data.phone,
          email: data.email || undefined,
          sector: data.sector,
          location: data.location,
          has_web: data.has_web,
          plan_interest: data.plan_interest,
          message: [
            data.message,
            data.services.length > 0 ? `Servicios mensuales de interés: ${data.services.join(", ")}` : "",
          ].filter(Boolean).join("\n"),
        }),
      });
      if (!res.ok) throw new Error("Error");
      setSubmitted(true);
    } catch {
      setError("Error al enviar. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ["Tu negocio", "Plan de interés", "Datos de contacto"];

  return (
    <section id="presupuesto" className="py-24 px-6 md:px-12 bg-[#0A0F1E]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            Presupuesto gratis
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Solicita tu <span className="text-gradient-teal">presupuesto</span>
          </h2>
          <p className="text-[#8B95A9] max-w-xl mx-auto">
            Sin compromiso. Un agente te contactará en menos de 24h con una propuesta personalizada.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
        <Tilt3D intensity={3} glare={false} scale={1.005}>
        <div className="gradient-border-card rounded-2xl overflow-hidden">
          {submitted ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-[#00D4AA]/15 border-2 border-[#00D4AA]/40 flex items-center justify-center mx-auto mb-6"
              >
                <Check size={36} className="text-[#00D4AA]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">¡Solicitud recibida!</h3>
              <p className="text-[#8B95A9] max-w-sm mx-auto leading-relaxed">
                Un agente te contactará en menos de 24h con una propuesta personalizada para tu negocio.
              </p>
            </div>
          ) : (
            <>
              {/* Step progress */}
              <div className="px-8 pt-8 pb-6 border-b border-white/8">
                <div className="flex items-center gap-2">
                  {stepLabels.map((label, i) => {
                    const stepNum = i + 1;
                    const isActive = step === stepNum;
                    const isDone = step > stepNum;
                    return (
                      <div key={label} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <motion.div
                            animate={{
                              backgroundColor: isDone ? "#00D4AA" : isActive ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.05)",
                              borderColor: isDone ? "#00D4AA" : isActive ? "#00D4AA" : "rgba(255,255,255,0.15)",
                            }}
                            transition={{ duration: 0.3 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2`}
                          >
                            {isDone ? (
                              <Check size={13} className="text-black" />
                            ) : (
                              <span className={isActive ? "text-[#00D4AA]" : "text-[#8B95A9]"}>{stepNum}</span>
                            )}
                          </motion.div>
                          <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-white" : "text-[#8B95A9]"}`}>
                            {label}
                          </span>
                        </div>
                        {i < stepLabels.length - 1 && (
                          <motion.div
                            animate={{ backgroundColor: isDone ? "rgba(0,212,170,0.6)" : "rgba(255,255,255,0.08)" }}
                            transition={{ duration: 0.4 }}
                            className="flex-1 h-[2px] mx-2 rounded-full"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm text-[#8B95A9] mb-1.5">Nombre del negocio *</label>
                        <input
                          type="text"
                          value={data.business_name}
                          onChange={(e) => setData({ ...data, business_name: e.target.value })}
                          className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                          placeholder="Ej: Bar El Rincón, Peluquería Ana..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#8B95A9] mb-1.5">Sector / tipo de negocio *</label>
                        <select
                          value={data.sector}
                          onChange={(e) => setData({ ...data, sector: e.target.value })}
                          className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                        >
                          <option value="">Selecciona tu sector...</option>
                          {sectores.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#8B95A9] mb-1.5">Ciudad / Provincia</label>
                        <input
                          type="text"
                          value={data.location}
                          onChange={(e) => setData({ ...data, location: e.target.value })}
                          className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                          placeholder="Ej: Sevilla, Madrid, Valencia..."
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setData({ ...data, has_web: !data.has_web })}
                          className={`w-11 h-6 rounded-full transition-all relative ${data.has_web ? "bg-[#00D4AA]" : "bg-white/15"}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${data.has_web ? "left-5" : "left-0.5"}`} />
                        </button>
                        <label className="text-sm text-[#8B95A9]">Ya tengo web actual</label>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div>
                        <p className="text-sm text-[#8B95A9] mb-4">Plan de interés *</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {planes.map((plan) => (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setData({ ...data, plan_interest: plan.id })}
                              className={`p-4 rounded-xl border text-left transition-all ${
                                data.plan_interest === plan.id
                                  ? "border-[#00D4AA] bg-[#00D4AA]/10 text-white"
                                  : "border-[#1a2235] bg-[#0D1117]/60 text-[#8B95A9] hover:border-white/20"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm">{plan.name}</span>
                                {data.plan_interest === plan.id && (
                                  <Check size={14} className="text-[#00D4AA]" />
                                )}
                              </div>
                              <span className="text-xs opacity-70">{plan.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B95A9] mb-3">Servicios mensuales (opcional)</p>
                        <div className="space-y-2">
                          {serviciosMensuales.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.id)}
                              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                                data.services.includes(s.id)
                                  ? "border-[#C9A84C]/50 bg-[#C9A84C]/8 text-white"
                                  : "border-[#1a2235] bg-[#0D1117]/60 text-[#8B95A9] hover:border-white/15"
                              }`}
                            >
                              <span className="text-sm font-medium">{s.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs opacity-70">{s.price}</span>
                                {data.services.includes(s.id) && <Check size={13} className="text-[#C9A84C]" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-[#8B95A9] mb-1.5">Nombre de contacto *</label>
                          <input
                            type="text"
                            value={data.contact_name}
                            onChange={(e) => setData({ ...data, contact_name: e.target.value })}
                            className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#8B95A9] mb-1.5">Teléfono *</label>
                          <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                            placeholder="600 000 000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#8B95A9] mb-1.5">Email (opcional)</label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) => setData({ ...data, email: e.target.value })}
                          className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#8B95A9] mb-1.5">¿Algo más que quieras contarnos?</label>
                        <textarea
                          rows={3}
                          value={data.message}
                          onChange={(e) => setData({ ...data, message: e.target.value })}
                          className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all resize-none"
                          placeholder="Referencias, ideas, fechas de entrega deseadas..."
                        />
                      </div>
                      {error && <p className="text-red-400 text-sm">{error}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 gap-4">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 text-[#8B95A9] hover:text-white text-sm transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <motion.button
                      onClick={() => canNext() && setStep(step + 1)}
                      disabled={!canNext()}
                      whileHover={canNext() ? { y: -4, rotateX: -12, scale: 1.04, transformPerspective: 500, boxShadow: "0 14px 32px rgba(0,212,170,0.4)" } : {}}
                      whileTap={canNext() ? { scale: 0.96, rotateX: 8, y: 0 } : {}}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      className="ripple-btn flex items-center gap-2 bg-gradient-to-r from-[#00D4AA] to-[#00FFD4] text-black font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!canNext() || submitting}
                      whileHover={(!canNext() || submitting) ? {} : { y: -4, rotateX: -12, scale: 1.03, transformPerspective: 500, boxShadow: "0 16px 36px rgba(0,212,170,0.45)" }}
                      whileTap={(!canNext() || submitting) ? {} : { scale: 0.97, rotateX: 8, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      className="ripple-btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00D4AA] to-[#00FFD4] text-black font-bold px-8 py-3.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      {submitting ? "Enviando..." : "Solicitar presupuesto"}
                    </motion.button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        </Tilt3D>
        </motion.div>
      </div>
    </section>
  );
}
