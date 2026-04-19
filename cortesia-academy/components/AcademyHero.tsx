"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export function AcademyHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#7DD3FC]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#C9A84C]/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-20 w-full">
        {/* Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-8"
        >
          <Sparkles size={12} className="text-[#C9A84C]" />
          <span className="text-xs text-[#C9A84C]">
            Comunidad premium · Cursos · Videollamadas en directo
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
        >
          <span className="block text-white">Aprende IA</span>
          <span className="block mt-2">
            <span className="bg-gradient-to-r from-[#7DD3FC] via-[#8B5CF6] to-[#C9A84C] bg-clip-text text-transparent">
              con los que la usan a diario
            </span>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-lg sm:text-xl text-[#8B95A9] max-w-2xl mb-10 leading-relaxed"
        >
          <span className="text-white font-medium">CortesIA Academy</span> es la comunidad privada del canal.
          Cursos prácticos, videollamadas con el equipo cada semana, y acceso directo a nosotros cuando
          te bloqueas montando algo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-3 items-center"
        >
          <a
            href="#precio"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-[#0D1117] font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-[#7DD3FC]/20"
          >
            <Sparkles size={16} />
            Ver plan y unirme
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://youtube.com/@cortesia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/25 text-white font-medium text-sm transition-all"
          >
            <PlayCircle size={14} />
            Ver el canal YouTube
          </a>
        </motion.div>

        {/* Sub-CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-[#8B95A9]/70 mt-6"
        >
          Sin permanencia · Cancela cuando quieras · Primera semana de prueba
        </motion.p>
      </div>
    </section>
  );
}
