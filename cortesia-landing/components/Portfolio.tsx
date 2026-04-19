"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Chantarela",
    category: "Parrilla · Restaurante",
    url: "https://chantarela.vercel.app",
    color: "#C9A84C",
    location: "Mairena del Aljarafe"
  },
  {
    name: "El Rincón de Salteras",
    category: "Brasa · Restaurante",
    url: "https://rincon-salteras.vercel.app",
    color: "#7DD3FC",
    location: "Salteras"
  },
  {
    name: "Serendipia",
    category: "Café Copas · Discoteca",
    url: "https://serendipia-web.vercel.app",
    color: "#A78BFA",
    location: "Salteras"
  },
  {
    name: "Shisha Vaper Sevilla",
    category: "Tienda Premium",
    url: "https://shisha-vaper-web.vercel.app",
    color: "#F97316",
    location: "Sevilla"
  },
  {
    name: "La Dama",
    category: "Peluquería Canina",
    url: "#",
    color: "#34D399",
    location: "Sevilla"
  },
  {
    name: "Twin Bros Tattoo",
    category: "Estudio de Tatuaje",
    url: "#",
    color: "#FB7185",
    location: "Tomares"
  },
  {
    name: "DiverNature",
    category: "Animación Infantil",
    url: "#",
    color: "#4ADE80",
    location: "Sevilla"
  },
  {
    name: "Bar Ryky",
    category: "Bar de Tapas",
    url: "#",
    color: "#FBBF24",
    location: "Castilleja de la Cuesta"
  }
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#7DD3FC] uppercase tracking-widest mb-3">Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Negocios que ya crecen con nosotros
          </h2>
          <p className="text-[#8B95A9] text-lg max-w-xl mx-auto">
            Webs profesionales construidas para negocios reales de Sevilla y alrededores.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url !== "#" ? p.url : undefined}
              target={p.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col hover:border-white/15 transition-all hover:-translate-y-0.5 ${p.url === "#" ? "cursor-default" : "cursor-pointer"}`}
            >
              {/* Color accent */}
              <div
                className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center text-xs font-bold"
                style={{
                  background: `${p.color}15`,
                  border: `1px solid ${p.color}30`,
                  color: p.color
                }}
              >
                {p.name[0]}
              </div>

              <h3 className="font-bold text-white text-base mb-1 group-hover:text-[#7DD3FC] transition-colors">
                {p.name}
              </h3>
              <p className="text-xs text-[#8B95A9] mb-1">{p.category}</p>
              <p className="text-xs text-[#8B95A9]/60">{p.location}</p>

              {p.url !== "#" && (
                <div className="mt-4 flex items-center gap-1 text-xs" style={{ color: p.color }}>
                  Ver web <ExternalLink size={10} />
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
