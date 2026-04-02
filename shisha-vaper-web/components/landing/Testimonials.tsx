"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import content from "@/data/content.json";

export default function Testimonials() {
  return (
    <section id="resenas" className="py-28 relative overflow-hidden">
      {/* Damask bg */}
      <div className="absolute inset-0 damask-bg opacity-60" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(245,192,26,0.06) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
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
              Lo que dicen
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#F5C01A]" />
          </motion.div>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-[clamp(40px,7vw,72px)] leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
          >
            NUESTROS <span style={{ color: "#F5C01A" }}>CLIENTES</span>
          </motion.h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {content.testimoniales.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative p-6 card-base rounded-sm"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-5 opacity-10">
                <Quote size={48} className="text-[#F5C01A]" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.estrellas)].map((_, j) => (
                  <Star key={j} size={14} className="text-[#F5C01A] fill-[#F5C01A]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[rgba(245,240,232,0.72)] leading-relaxed mb-5 text-sm relative z-10 italic">
                &ldquo;{t.texto}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full border border-[rgba(245,192,26,0.3)] flex items-center justify-center text-[#F5C01A]"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "16px" }}
                >
                  {t.nombre.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-white text-sm"
                    style={{ fontFamily: "var(--font-cinzel)", letterSpacing: "0.06em" }}
                  >
                    {t.nombre}
                  </p>
                  <p className="text-[10px] text-[rgba(245,240,232,0.35)] tracking-wider">
                    Cliente verificado
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-[rgba(245,192,26,0.2)] bg-[rgba(245,192,26,0.04)]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-[#F5C01A] fill-[#F5C01A]" />
              ))}
            </div>
            <span className="text-sm text-[rgba(245,240,232,0.6)]" style={{ fontFamily: "var(--font-cinzel)" }}>
              5.0 en Google
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
