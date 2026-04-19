"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#7DD3FC]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            Agencia de Inteligencia Artificial
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Hacemos crecer
            <br />
            <span className="text-[#C9A84C]">negocios</span> con{" "}
            <span className="text-[#7DD3FC]">IA</span>
          </h1>

          <p className="text-lg md:text-xl text-[#8B95A9] max-w-2xl mx-auto mb-10 leading-relaxed">
            Diseñamos webs profesionales, desplegamos agentes de inteligencia artificial
            y formamos a equipos comerciales para vender más con tecnología.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contacto"
              className="px-8 py-3.5 rounded-xl bg-white text-[#0D1117] font-semibold text-sm hover:bg-[#7DD3FC] transition-colors"
            >
              Hablar con el equipo
            </a>
            <a
              href="#academy"
              className="px-8 py-3.5 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] font-semibold text-sm hover:bg-[#C9A84C]/25 transition-colors"
            >
              Ver Academy →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
