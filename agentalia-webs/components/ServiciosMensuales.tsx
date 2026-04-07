"use client";

import { motion } from "framer-motion";
import { Wrench, TrendingUp, Share2, Sparkles } from "lucide-react";
import Tilt3D from "./Tilt3D";
import ParallaxSection from "./ParallaxSection";

const servicios = [
  {
    icon: Wrench,
    name: "Mantenimiento web",
    price: "39",
    period: "/mes",
    description: "Actualizaciones, seguridad, copias de seguridad y soporte técnico continuo para tu web.",
    features: ["Actualizaciones de contenido", "Backups automáticos", "Certificado SSL", "Soporte por WhatsApp"],
    highlight: false,
  },
  {
    icon: TrendingUp,
    name: "SEO + Posicionamiento",
    price: "99",
    period: "/mes",
    description: "Aparece en Google cuando tus clientes te buscan. Estrategia SEO local y seguimiento mensual.",
    features: ["Auditoría SEO mensual", "Palabras clave locales", "Google My Business", "Informe de posiciones"],
    highlight: false,
  },
  {
    icon: Share2,
    name: "Gestión redes sociales",
    price: "149",
    period: "/mes",
    description: "Gestionamos tu Instagram y Facebook para que tu negocio tenga presencia activa sin esfuerzo.",
    features: ["3 publicaciones/semana", "Diseño de posts", "Stories y reels", "Respuesta a comentarios"],
    highlight: false,
  },
  {
    icon: Sparkles,
    name: "Pack completo",
    price: "249",
    period: "/mes",
    description: "Todo lo anterior incluido. La solución total para negocios que quieren crecer online sin preocupaciones.",
    features: ["Mantenimiento web", "SEO + posicionamiento", "Redes sociales", "Atención prioritaria"],
    highlight: true,
  },
];

export default function ServiciosMensuales() {
  return (
    <section id="servicios" className="py-24 px-6 md:px-12 bg-[#0D1117]">
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
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              Servicios continuos
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Servicios <span className="text-gradient-gold">mensuales</span>
            </h2>
            <p className="text-[#8B95A9] max-w-2xl mx-auto text-lg">
              Opcionales. Para que tu presencia online siga creciendo mes a mes sin que tengas que preocuparte de nada.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Service cards — 2x2 grid with alternating horizontal entry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {servicios.map((s, i) => {
            const Icon = s.icon;
            const row = Math.floor(i / 2);
            const col = i % 2;
            const xFrom = row % 2 === 0
              ? col === 0 ? -80 : 80
              : col === 0 ? 80 : -80;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: xFrom }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt3D intensity={8} scale={1.02}>
                  <div
                    className={`relative rounded-2xl p-7 transition-all duration-300 hover:shadow-xl ${
                      s.highlight
                        ? "gradient-border-gold hover:shadow-[#C9A84C]/10"
                        : "glass-card hover:border-[#00D4AA]/20 hover:shadow-black/20"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {s.highlight && (
                      <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-[#C9A84C] to-[#F0C060] text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#C9A84C]/30">
                        Todo incluido
                      </div>
                    )}
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          s.highlight
                            ? "bg-gradient-to-br from-[#C9A84C]/30 to-[#C9A84C]/10 border border-[#C9A84C]/30"
                            : "bg-gradient-to-br from-[#00D4AA]/20 to-[#00D4AA]/5 border border-[#00D4AA]/20"
                        }`}
                        style={{ transform: "translateZ(25px)" }}
                      >
                        <Icon size={24} className={s.highlight ? "text-[#C9A84C]" : "text-[#00D4AA]"} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={`text-lg font-bold ${s.highlight ? "text-gradient-gold" : "text-white"}`}
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {s.name}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className={`text-2xl font-black ${s.highlight ? "text-[#C9A84C]" : "text-white"}`}>{s.price}€</span>
                            <span className="text-[#8B95A9] text-sm">{s.period}</span>
                          </div>
                        </div>
                        <p className="text-[#8B95A9] text-sm mb-4 leading-relaxed">{s.description}</p>
                        <ul className="grid grid-cols-2 gap-2">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-[#8B95A9]">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.highlight ? "bg-[#C9A84C]" : "bg-[#00D4AA]"}`} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
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
