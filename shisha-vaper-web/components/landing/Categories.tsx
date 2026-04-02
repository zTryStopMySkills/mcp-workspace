"use client";
import { motion } from "framer-motion";
import { Flame, Wind, Sparkles, Package, Droplets, Zap } from "lucide-react";
import content from "@/data/content.json";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  flame: Flame,
  wind: Wind,
  sparkles: Sparkles,
  package: Package,
  droplets: Droplets,
  zap: Zap,
};

export default function Categories() {
  return (
    <section id="categorias" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 justify-center mb-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#F5C01A]" />
            <span
              className="text-[11px] tracking-[0.4em] text-[#F5C01A] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Lo que encontrarás
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#F5C01A]" />
          </motion.div>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[clamp(40px,7vw,72px)] leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
          >
            NUESTRAS <span style={{ color: "#F5C01A" }}>CATEGORÍAS</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.categorias.map((cat, i) => {
            const Icon = iconMap[cat.icono] || Package;
            return (
              <motion.a
                key={cat.id}
                href={`#productos`}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 card-base rounded-sm cursor-pointer block overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(245,192,26,0.08) 0%, transparent 70%)" }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm border border-[rgba(245,192,26,0.25)] bg-[rgba(245,192,26,0.06)] mb-4 group-hover:border-[rgba(245,192,26,0.5)] transition-colors">
                    <Icon size={20} className="text-[#F5C01A]" />
                  </div>

                  {/* Text */}
                  <h3
                    className="text-[22px] text-white mb-2 group-hover:text-[#F5C01A] transition-colors"
                    style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em" }}
                  >
                    {cat.nombre}
                  </h3>
                  <p className="text-sm text-[rgba(245,240,232,0.5)] leading-relaxed">
                    {cat.descripcion}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 mt-4 text-[rgba(245,192,26,0.5)] group-hover:text-[#F5C01A] transition-colors text-xs tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}>
                    <span>Explorar</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >→</motion.span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
