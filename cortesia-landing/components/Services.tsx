"use client";

import { motion } from "framer-motion";
import { Globe, Bot, TrendingUp, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Webs Profesionales",
    desc: "Diseñamos y desarrollamos webs que convierten. Dark luxury para hostelería, tiendas, estudios y cualquier negocio local que quiera destacar.",
    items: ["Next.js 15 + Tailwind", "SEO optimizado", "Panel de administración", "Entrega en 7 días"],
    color: "#7DD3FC",
    cta: "Ver portfolio"
  },
  {
    icon: Bot,
    title: "Agentes IA",
    desc: "Automatizamos tareas comerciales y de gestión con agentes de inteligencia artificial integrados en tus herramientas actuales.",
    items: ["Bots de ventas", "Procesamiento de leads", "Informes automáticos", "Integración con CRM"],
    color: "#C9A84C",
    cta: "Hablar con nosotros"
  },
  {
    icon: TrendingUp,
    title: "Formación IA Comercial",
    desc: "Entrenamos a tu equipo para vender más con inteligencia artificial. De cero a productivo en semanas, no meses.",
    items: ["Academy online 24/7", "Casos reales del sector", "Comunidad activa", "Seguimiento personalizado"],
    color: "#A78BFA",
    cta: "Ver Academy"
  }
];

export function Services() {
  return (
    <section id="servicios" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#C9A84C] uppercase tracking-widest mb-3">Servicios</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Todo lo que necesita tu negocio
          </h2>
          <p className="text-[#8B95A9] text-lg max-w-xl mx-auto">
            Desde la web hasta el agente IA que la gestiona. Un solo equipo, todo integrado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-7 flex flex-col hover:border-white/15 transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shrink-0"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                >
                  <Icon size={22} style={{ color: s.color }} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-[#8B95A9] text-sm leading-relaxed mb-6">{s.desc}</p>

                <ul className="space-y-2 mb-8 flex-1">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#8B95A9]">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: s.color }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={s.title.includes("Formación") ? "#academy" : "#contacto"}
                  className="flex items-center gap-2 text-sm font-semibold transition-colors group-hover:gap-3"
                  style={{ color: s.color }}
                >
                  {s.cta}
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
