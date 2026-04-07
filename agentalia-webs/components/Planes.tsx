"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Globe, Crown } from "lucide-react";
import Tilt3D from "./Tilt3D";
import ParallaxSection from "./ParallaxSection";

const planes = [
  {
    id: "basico",
    icon: Globe,
    name: "Básico",
    price: "399",
    description: "Perfecta para empezar tu presencia online",
    popular: false,
    cardClass: "glass-card",
    accentColor: "#00D4AA",
    includes: [
      "Landing page profesional",
      "Formulario de contacto",
      "Botón WhatsApp",
      "Diseño responsive (móvil + escritorio)",
      "SEO básico incluido",
      "Entrega en 24-72h",
    ],
  },
  {
    id: "estandar",
    icon: Zap,
    name: "Estándar",
    price: "649",
    description: "La opción más completa para crecer online",
    popular: true,
    cardClass: "animated-border-card",
    accentColor: "#00D4AA",
    includes: [
      "Todo lo del plan Básico",
      "Galería de fotos/vídeos",
      "Blog integrado",
      "5 secciones personalizadas",
      "SEO local avanzado",
      "Google My Business",
      "Entrega en 1-7 días",
    ],
  },
  {
    id: "premium",
    icon: Star,
    name: "Premium",
    price: "999",
    description: "Web avanzada con funcionalidades completas",
    popular: false,
    cardClass: "gradient-border-card",
    accentColor: "#00D4AA",
    includes: [
      "Todo lo del plan Estándar",
      "Sistema de reservas u pedidos",
      "Panel de administración",
      "Animaciones premium",
      "Formularios avanzados",
      "Integraciones Google Analytics",
      "Entrega en 1-7 días",
    ],
  },
  {
    id: "saas",
    icon: Crown,
    name: "SaaS / A medida",
    price: "1.800",
    priceNote: "desde",
    description: "Solución empresarial completamente personalizada",
    popular: false,
    cardClass: "gradient-border-gold",
    accentColor: "#C9A84C",
    includes: [
      "Todo lo del plan Premium",
      "Funciones a medida",
      "Integraciones API externas",
      "Sistema SaaS complejo",
      "Multi-panel (admin, clientes, cocina...)",
      "Soporte prioritario dedicado",
      "Según proyecto",
    ],
  },
];

interface PlanesProps {
  onSelectPlan?: (planId: string) => void;
}

export default function Planes({ onSelectPlan }: PlanesProps) {
  const scrollToForm = (planId: string) => {
    if (onSelectPlan) onSelectPlan(planId);
    document.querySelector("#presupuesto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="precios" className="py-24 px-6 md:px-12 bg-[#0A0F1E]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ParallaxSection depth={0.08}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
              Precios transparentes
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Elige tu <span className="text-gradient-teal">plan</span>
            </h2>
            <p className="text-[#8B95A9] max-w-2xl mx-auto text-lg">
              Sin cuotas mensuales ocultas. Precio único por el desarrollo. Solo pagas mantenimiento si lo necesitas.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {planes.map((plan, i) => {
            const Icon = plan.icon;
            const xFrom = i % 2 === 0 ? -100 : 100;
            const isSaas = plan.id === "saas";
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: xFrom, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt3D intensity={12} perspective={900} scale={1.04} className="h-full">
                  <div
                    className={`relative flex flex-col rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-2xl ${plan.cardClass} ${
                      plan.popular ? "shadow-[0_0_40px_rgba(0,212,170,0.20)]" : ""
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00D4AA] to-[#00FFD4] text-black text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#00D4AA]/30">
                        MÁS POPULAR
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                        isSaas
                          ? "bg-gradient-to-br from-[#C9A84C]/30 to-[#C9A84C]/10 border border-[#C9A84C]/30"
                          : "bg-gradient-to-br from-[#00D4AA]/25 to-[#00D4AA]/8 border border-[#00D4AA]/25"
                      }`}
                      style={{ transform: "translateZ(30px)" }}
                    >
                      <Icon size={22} className={isSaas ? "text-[#C9A84C]" : "text-[#00D4AA]"} />
                    </div>

                    {/* Plan name */}
                    <h3
                      className={`text-xl font-bold mb-1 ${isSaas ? "text-gradient-gold" : "text-white"}`}
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-[#8B95A9] text-sm mb-5 leading-snug">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6" style={{ transform: "translateZ(15px)" }}>
                      {plan.priceNote && (
                        <span className="text-[#8B95A9] text-sm">desde </span>
                      )}
                      <span className={`text-4xl font-black ${isSaas ? "text-gradient-gold" : "text-white"}`}>{plan.price}€</span>
                      <span className="text-[#8B95A9] text-sm ml-1">pago único</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1" style={{ transform: "translateZ(10px)" }}>
                      {plan.includes.map((item, fi) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ delay: i * 0.1 + fi * 0.04 + 0.2 }}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isSaas ? "bg-[#C9A84C]/20" : "bg-[#00D4AA]/20"
                          }`}>
                            <Check size={10} className={isSaas ? "text-[#C9A84C]" : "text-[#00D4AA]"} />
                          </div>
                          <span className="text-[#8B95A9]">{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.button
                      onClick={() => scrollToForm(plan.id)}
                      whileHover={{ y: -4, rotateX: -12, scale: 1.03, transformPerspective: 500, boxShadow: plan.popular ? "0 14px 32px rgba(0,212,170,0.4)" : isSaas ? "0 14px 32px rgba(201,168,76,0.3)" : "0 14px 28px rgba(0,212,170,0.2)" }}
                      whileTap={{ scale: 0.96, rotateX: 8, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      style={{ transform: "translateZ(10px)" }}
                      className={`ripple-btn w-full py-3 rounded-xl font-bold text-sm ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#00D4AA] to-[#00FFD4] text-black"
                          : isSaas
                          ? "border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10"
                          : "border border-[#00D4AA]/50 text-[#00D4AA] hover:bg-[#00D4AA]/10"
                      }`}
                    >
                      Elegir este plan
                    </motion.button>
                  </div>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
