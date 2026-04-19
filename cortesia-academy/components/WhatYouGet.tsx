"use client";

import { motion } from "framer-motion";
import {
  Video,
  Users,
  MessageSquare,
  Share2,
  Sparkles,
  BookMarked,
  Zap,
  Headphones
} from "lucide-react";

const FEATURES = [
  {
    icon: BookMarked,
    title: "Cursos prácticos completos",
    desc: "Desde fundamentos hasta automatizaciones complejas con agentes IA. Vídeos bajo demanda, cada uno con ejercicios y recursos descargables.",
    color: "#7DD3FC"
  },
  {
    icon: Video,
    title: "Videollamadas semanales",
    desc: "Sesiones en directo cada semana con el equipo de CortesIA: resolvemos dudas, analizamos lanzamientos y hacemos demos exclusivas.",
    color: "#EF4444"
  },
  {
    icon: Share2,
    title: "Screen share tipo Discord",
    desc: "Comparte tu pantalla completa o ventana concreta durante las videollamadas. Perfecto para que te ayudemos en directo con tu proyecto.",
    color: "#8B5CF6"
  },
  {
    icon: MessageSquare,
    title: "Canales de comunidad",
    desc: "Chat privado con el resto de alumnos y el equipo. Canales temáticos (Claude Code, automatizaciones, YouTube, proyectos) para no perder el hilo.",
    color: "#00D4AA"
  },
  {
    icon: Zap,
    title: "Acceso prioritario",
    desc: "Respuestas del equipo en 24h máximo. Cuando hay un lanzamiento fuerte en IA, los miembros lo reciben antes que el canal público.",
    color: "#C9A84C"
  },
  {
    icon: Headphones,
    title: "Llamadas 1:1 (ocasionales)",
    desc: "Miembros premium pueden reservar llamadas privadas con el equipo para consultas puntuales de proyectos.",
    color: "#EC4899"
  }
];

export function WhatYouGet() {
  return (
    <section id="que-incluye" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7DD3FC]/10 border border-[#7DD3FC]/20 mb-4">
            <Sparkles size={12} className="text-[#7DD3FC]" />
            <span className="text-xs text-[#7DD3FC] uppercase tracking-wider font-medium">
              Qué incluye tu membresía
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Más que un curso, es la comunidad
          </h2>
          <p className="text-lg text-[#8B95A9] leading-relaxed">
            No vendemos un curso grabado y te dejamos solo. Academy está pensada para que
            avances con nosotros. Lo que te llevas cada mes:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-2xl bg-white/[0.03] border border-white/8 p-5 hover:border-white/20 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center mb-3"
                  style={{ background: `${f.color}15`, borderColor: `${f.color}40` }}
                >
                  <Icon size={18} style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm text-[#8B95A9] leading-relaxed">{f.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
