"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

const cells = [
  {
    id: "nextjs",
    title: "Next.js 15 + React 19",
    desc: "El stack más demandado del mercado. SSR, ISR y App Router para máxima velocidad.",
    tag: "Framework",
    color: "#00D4AA",
    span: "col-span-2 row-span-1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
      </svg>
    ),
  },
  {
    id: "vercel",
    title: "Vercel",
    desc: "Deploy automático en segundos. Uptime 99.99% garantizado.",
    tag: "Hosting",
    color: "#ffffff",
    span: "col-span-1 row-span-1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
      </svg>
    ),
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    desc: "UI atractiva a la velocidad del pensamiento.",
    tag: "Estilos",
    color: "#38BDF8",
    span: "col-span-1 row-span-1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    ),
  },
  {
    id: "framer",
    title: "Framer Motion",
    desc: "Animaciones 3D, parallax y transiciones fluidas como las que ves aquí.",
    tag: "Animaciones",
    color: "#C9A84C",
    span: "col-span-1 row-span-1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
      </svg>
    ),
  },
  {
    id: "perf",
    title: "Lighthouse ≥ 90",
    desc: "Rendimiento, SEO y accesibilidad auditados en cada proyecto.",
    tag: "Performance",
    color: "#00D4AA",
    span: "col-span-2 row-span-1",
    scoreBar: true,
  },
  {
    id: "typescript",
    title: "TypeScript",
    desc: "Código robusto, sin errores en producción.",
    tag: "Lenguaje",
    color: "#3B82F6",
    span: "col-span-1 row-span-1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
      </svg>
    ),
  },
  {
    id: "supabase",
    title: "Supabase",
    desc: "Bases de datos, autenticación y tiempo real incluidos.",
    tag: "Backend",
    color: "#3ECF8E",
    span: "col-span-1 row-span-1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
        <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.111 12.888.706 14.1 1.771 14.1h9.538l.097 8.864c.015.986 1.26 1.41 1.874.637l9.262-11.653c.653-.837.058-2.05-1.007-2.05h-9.538L11.9 1.036z"/>
      </svg>
    ),
  },
  {
    id: "seo",
    title: "SEO Local incluido",
    desc: "Aparecer en Google Maps y en las primeras búsquedas de tu ciudad desde el primer día.",
    tag: "Marketing",
    color: "#C9A84C",
    span: "col-span-2 row-span-1",
    icon: null,
    seoCell: true,
  },
];

function ScoreBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const scores = [
    { label: "Performance", value: 97, color: "#00D4AA" },
    { label: "SEO",         value: 100, color: "#C9A84C" },
    { label: "Accesib.",    value: 95, color: "#3B82F6" },
  ];
  return (
    <div ref={ref} className="mt-4 space-y-2">
      {scores.map(s => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-[10px] text-[#8B95A9] w-16 shrink-0">{s.label}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${s.value}%` } : {}}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: s.color }}
            />
          </div>
          <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function BentoStack() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#0D1117]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            Stack tecnológico
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Herramientas de <span className="text-gradient-teal">primer nivel</span>
          </h2>
          <p className="text-[#8B95A9] max-w-xl mx-auto">
            El mismo stack que usan las startups más valoradas del mundo. Adaptado para hacerlo accesible a cualquier negocio local.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(160px,auto)]">
          {cells.map((cell, i) => {
            const colSpan = cell.span.includes("col-span-2") ? "md:col-span-2" : "col-span-1";
            return (
              <motion.div
                key={cell.id}
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative glass-card rounded-2xl p-5 flex flex-col justify-between overflow-hidden col-span-2 ${colSpan} cursor-default`}
              >
                {/* Glow accent */}
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ background: cell.color }}
                />

                <div>
                  {/* Tag */}
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3"
                    style={{ color: cell.color, background: `${cell.color}18` }}
                  >
                    {cell.tag}
                  </span>

                  {/* Icon or SEO graphic */}
                  {cell.icon && (
                    <div className="mb-3" style={{ color: cell.color }}>
                      {cell.icon}
                    </div>
                  )}
                  {cell.seoCell && (
                    <div className="flex gap-1 mb-3">
                      {["#", "1", "2", "3"].map((n, idx) => (
                        <span
                          key={idx}
                          className="text-2xl font-black"
                          style={{ color: idx === 0 ? cell.color : `${cell.color}${40 + idx * 30}` }}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-white font-bold text-base mb-1">{cell.title}</h3>
                  <p className="text-[#8B95A9] text-sm leading-snug">{cell.desc}</p>
                </div>

                {cell.scoreBar && <ScoreBar />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
