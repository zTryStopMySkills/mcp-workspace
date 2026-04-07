"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const showcases = [
  {
    slug: "comandalia",
    name: "Sistema de pedidos QR",
    headline: "Del QR a cocina en tiempo real",
    body: "Sistema de comandas digitales para restaurantes. Los clientes piden desde el móvil, la cocina lo recibe al instante. Menos errores, más rotación y control total de tu operación.",
    tags: ["Sistema QR", "Cocina en tiempo real", "Panel admin"],
    stat: { value: "0 errores", label: "en la toma de comandas" },
    url: "https://comandalia.es",
  },
  {
    slug: "el-dichoso",
    name: "Dichoso · Tapas y Arroces",
    headline: "Reservas llenas sin llamadas",
    body: "Web con reservas online, carta visual y galería de platos para este restaurante de tapas y arroces en Mairena del Aljarafe. Más visibilidad, menos teléfono.",
    tags: ["Reservas online", "Carta digital", "SEO local"],
    stat: { value: "+280%", label: "visibilidad en Google Maps" },
    url: "https://dichoso-web.vercel.app",
  },
  {
    slug: "twinbros-web",
    name: "Twin Bros Tattoo Studio",
    headline: "Agenda llena sin llamadas",
    body: "Estudio con 4 artistas en Tomares. Sistema de citas online, perfiles individuales por artista y panel de administración. Menos tiempo al teléfono, más tiempo tatuando.",
    tags: ["Sistema citas", "Multi-artista", "Panel admin"],
    stat: { value: "0€", label: "comisión por cada reserva" },
    url: "https://twinbros-web.vercel.app",
  },
];

function BrowserFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
      {/* Top bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#111]/90 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="flex-1 mx-4 max-w-xs">
          <div className="bg-white/5 border border-white/10 rounded-md px-3 py-0.5 flex items-center gap-2">
            <svg className="w-3 h-3 text-[#8B95A9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[10px] text-[#8B95A9] truncate">agentalia-webs.vercel.app</span>
          </div>
        </div>
      </div>
      {/* Screenshot */}
      <div className="relative aspect-[16/10]">
        <Image src={src} alt={alt} fill className="object-cover object-top" quality={85} />
      </div>
    </div>
  );
}

export default function DeviceShowcase() {
  return (
    <section className="bg-[#0D1117] py-24">
      {/* Header */}
      <div className="text-center px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            Para cada tipo de negocio
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Una web <span className="text-gradient-gold">hecha para ti</span>
          </h2>
          <p className="text-[#8B95A9] max-w-xl mx-auto">
            No hay soluciones genéricas. Cada proyecto se diseña desde cero según tu sector y objetivos.
          </p>
        </motion.div>
      </div>

      {/* Alternating cards — no sticky, no height lock */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-28">
        {showcases.map((s, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={s.slug}
              className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-16`}
            >
              {/* Browser mockup */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full md:w-1/2"
              >
                <BrowserFrame src={`/projects/${s.slug}.jpg`} alt={s.name} />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full md:w-1/2"
              >
                <span className="inline-block text-xs font-bold uppercase tracking-widest bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 px-3 py-1 rounded-full mb-5">
                  {s.name}
                </span>

                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                  {s.headline}
                </h3>

                <p className="text-[#8B95A9] text-base leading-relaxed mb-6">
                  {s.body}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-xs text-[#8B95A9] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-3 bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-xl px-5 py-3">
                    <span className="text-xl font-black text-[#00D4AA]">{s.stat.value}</span>
                    <span className="text-sm text-[#8B95A9]">{s.stat.label}</span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#8B95A9] hover:text-[#00D4AA] transition-colors"
                  >
                    Ver web →
                  </a>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
