"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    slug: "comandalia",
    name: "Comandalia",
    type: "Sistema de pedidos QR",
    tags: ["Next.js 15", "QR a cocina", "Tiempo real"],
    url: "https://comandalia.es",
    desc: "Sistema de comandas digitales para restaurantes. Los clientes piden desde su móvil, la cocina recibe al instante. Sin errores, más rotación.",
  },
  {
    slug: "la-dama",
    name: "La Dama",
    type: "Peluquería canina",
    tags: ["Sistema de citas", "Calendario dinámico", "Panel admin"],
    url: "https://ladama-web.vercel.app",
    desc: "Peluquería canina en Sevilla con sistema de citas online a medida. Los clientes reservan desde el móvil eligiendo servicio, fecha y hora. La propietaria gestiona su agenda desde un panel propio.",
  },
  {
    slug: "twinbros-web",
    name: "Twin Bros Tattoo Studio",
    type: "Estudio de tatuaje",
    tags: ["Sistema citas", "Multi-artista", "Panel admin"],
    url: "https://twinbros-web.vercel.app",
    desc: "Estudio con 4 artistas en Tomares. Sistema de citas online, perfiles individuales por artista y panel de administración.",
  },
  {
    slug: "bar-la-espuela",
    name: "Bar La Espuela",
    type: "Bar de tapas",
    tags: ["Next.js 15", "Carta digital", "SEO local"],
    url: "https://bar-la-espuela.vercel.app",
    desc: "El templo de las lagrimitas en Castilleja de la Cuesta. Web con carta interactiva, galería y toda la personalidad del bar.",
  },
  {
    slug: "el-dichoso",
    name: "Dichoso",
    type: "Tapas y arroces",
    tags: ["Reservas online", "Carta digital", "Mairena del Aljarafe"],
    url: "https://dichoso-web.vercel.app",
    desc: "Cocina honesta de producto en Mairena del Aljarafe. Reservas, carta visual y galería que abre el apetito antes de llegar.",
  },
  {
    slug: "bodegas-aljarafe",
    name: "Bodega Aljarafe",
    type: "Carnes a la brasa",
    tags: ["Next.js 15", "Dark luxury", "Reservas"],
    url: "https://bodega-aljarafe-web.vercel.app",
    desc: "Carnes a la brasa en Castilleja de la Cuesta. Diseño premium con carta digital, reservas y galería que transmite la esencia del asador.",
  },
];

// 60vh por proyecto — 5 proyectos = 300vh total
const SECTION_VH = 60;

export default function Portafolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Sin spring — transformación directa para evitar lag
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(projects.length - 1) * 100}vw`]
  );

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="portafolio" className="bg-[#0A0F1E]" style={{ scrollMarginTop: "80px" }}>
      {/* Header */}
      <div className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            Proyectos entregados
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Webs que hablan <span className="text-gradient-teal">por sí solas</span>
          </h2>
          <p className="text-[#8B95A9] max-w-xl mx-auto">
            Scroll horizontal para explorar nuestros últimos proyectos
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${projects.length * SECTION_VH}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-20">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D4AA] to-[#C9A84C]"
              style={{ width: progressWidth }}
            />
          </div>

          {/* Horizontal track — sin spring para evitar lag */}
          <motion.div
            className="flex h-full"
            style={{ x, width: `${projects.length * 100}vw` }}
          >
            {projects.map((project, idx) => (
              <div
                key={project.slug}
                className="relative w-screen h-screen flex-shrink-0 flex items-end"
              >
                {/* Background screenshot */}
                <div className="absolute inset-0">
                  <Image
                    src={`/projects/${project.slug}.jpg`}
                    alt={project.name}
                    fill
                    className="object-cover object-top"
                    quality={85}
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/55 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1E]/30 to-transparent" />
                </div>

                {/* Slide number */}
                <div className="absolute top-8 right-10 z-10 text-sm font-bold text-white/30 tabular-nums">
                  {String(idx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </div>

                {/* Content overlay */}
                <div className="relative z-10 px-10 md:px-20 pb-16 md:pb-20 max-w-2xl">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 px-3 py-1 rounded-full mb-4">
                    {project.type}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-[#8B95A9] text-base md:text-lg mb-5 leading-relaxed max-w-lg">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs text-[#8B95A9] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#00D4AA] hover:text-white border border-[#00D4AA]/40 hover:border-white/40 px-5 py-2.5 rounded-xl transition-all hover:bg-white/5"
                  >
                    Ver proyecto
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Scroll hint on first card */}
                {idx === 0 && (
                  <div className="absolute bottom-8 right-12 z-10 flex items-center gap-2 text-xs text-[#8B95A9]">
                    <span>Sigue scrolleando</span>
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      className="w-5 h-[1px] bg-[#8B95A9]"
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
