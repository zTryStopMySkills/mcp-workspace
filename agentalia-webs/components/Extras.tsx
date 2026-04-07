"use client";

import { motion } from "framer-motion";
import { Globe2, Server, CreditCard, CalendarCheck, ShoppingCart } from "lucide-react";
import Tilt3D from "./Tilt3D";
import ParallaxSection from "./ParallaxSection";

const extras = [
  { icon: Globe2, name: "Dominio .es / .com (1 año)", price: "15€", desc: "Registramos tu dominio personalizado" },
  { icon: Server, name: "Hosting (1 año)", price: "100€", desc: "Alojamiento web seguro y rápido" },
  { icon: CreditCard, name: "Pasarela de pago", price: "150€", desc: "Acepta tarjetas en tu web con Stripe" },
  { icon: CalendarCheck, name: "Sistema de reservas avanzado", price: "199€", desc: "Reservas online con calendario y recordatorios" },
  { icon: ShoppingCart, name: "Tienda online (e-commerce)", price: "299€", desc: "Catálogo, carrito y pago integrado" },
];

export default function Extras() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#0A0F1E]">
      <div className="max-w-6xl mx-auto">
        <ParallaxSection depth={0.08}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
              Opcionales
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Complementos <span className="text-gradient-teal">y extras</span>
            </h2>
            <p className="text-[#8B95A9] max-w-xl mx-auto">
              Añade funcionalidades adicionales a cualquier plan. Un pago único, sin sorpresas.
            </p>
          </motion.div>
        </ParallaxSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {extras.map((extra, i) => {
            const Icon = extra.icon;
            const xFrom = i % 2 === 0 ? -60 : 60;
            return (
              <motion.div
                key={extra.name}
                initial={{ opacity: 0, x: xFrom }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt3D intensity={7} scale={1.02}>
                  <div
                    className="relative flex items-center gap-4 glass-card rounded-xl p-5 border-l-4 border-l-[#00D4AA]/50 hover:border-l-[#00D4AA] transition-all duration-300 group overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Hover glow effect on left border */}
                    <div className="absolute inset-y-0 left-0 w-px bg-[#00D4AA] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

                    <div
                      className="w-11 h-11 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center shrink-0 group-hover:bg-[#00D4AA]/20 transition-colors"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <Icon size={18} className="text-[#00D4AA]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className="text-sm font-semibold text-white leading-snug"
                          style={{ transform: "translateZ(10px)" }}
                        >
                          {extra.name}
                        </p>
                        <span className="shrink-0 bg-[#00D4AA]/15 text-[#00D4AA] font-bold text-xs px-2.5 py-1 rounded-full border border-[#00D4AA]/20">
                          {extra.price}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B95A9]">{extra.desc}</p>
                    </div>
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
