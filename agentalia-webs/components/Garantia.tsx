"use client";

import { motion } from "framer-motion";
import { Shield, RefreshCw, RotateCcw, BadgeCheck } from "lucide-react";
import ParallaxSection from "./ParallaxSection";

const promises = [
  {
    icon: RefreshCw,
    title: "Rediseño gratuito",
    desc: "Si el diseño entregado no te convence, lo rehacemos desde cero sin ningún coste adicional.",
  },
  {
    icon: RotateCcw,
    title: "Devolución del 100%",
    desc: "Si tras el rediseño sigues sin estar satisfecho, te devolvemos el importe completo. Sin preguntas.",
  },
  {
    icon: BadgeCheck,
    title: "15 días desde la entrega",
    desc: "El plazo comienza a contar el día que recibes tu web terminada, no cuando firmas el contrato.",
  },
];

export default function Garantia() {
  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#0A0F1E] to-[#071218] relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <ParallaxSection depth={0.06}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            {/* Shield badge */}
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center">
                <Shield size={26} className="text-[#C9A84C]" />
              </div>
            </div>

            <span className="block text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-3">
              Garantía 15 días
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Contrata <span className="text-gradient-gold">sin riesgo</span>
            </h2>
            <p className="text-[#8B95A9] max-w-xl mx-auto text-lg leading-relaxed">
              Si no quedas satisfecho con tu web, no pierdes nada.
              Así de simple.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Promise cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {promises.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.03] border border-[#C9A84C]/15 rounded-2xl p-6 hover:border-[#C9A84C]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#C9A84C]" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                <p className="text-[#8B95A9] text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-[#8B95A9]/50"
        >
          Aplicable a todos los planes · Sin letra pequeña · Solo tienes que pedirlo
        </motion.p>
      </div>
    </section>
  );
}
