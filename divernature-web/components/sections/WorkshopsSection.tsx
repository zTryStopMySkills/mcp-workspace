'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { workshops, siteConfig, type Workshop } from '@/lib/content'
import dynamic from 'next/dynamic'

const WorkshopModal = dynamic(() => import('@/components/WorkshopModal'), { ssr: false })

export default function WorkshopsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selected, setSelected] = useState<Workshop | null>(null)

  return (
    <>
      <section
        id="talleres"
        ref={ref}
        aria-labelledby="talleres-heading"
        className="py-24 px-6 bg-[#8CC840]/10 relative overflow-hidden"
      >
        {/* Decoración */}
        <div aria-hidden="true" className="absolute -top-20 -right-20 w-64 h-64 bg-[#8CC840]/20 rounded-full blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#3D7848]/15 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#8CC840] text-white font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              ECOfriendly ♻️
            </span>
            <h2
              id="talleres-heading"
              className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-[#1A3020] mb-4"
            >
              Talleres
              <span className="text-[#3D7848]"> ambientales</span>
            </h2>
            <p className="text-lg text-[#1A3020]/65 max-w-2xl mx-auto leading-relaxed">
              Experiencias educativas donde los niños aprenden sobre naturaleza, reciclaje y valores
              mientras se divierten. Para colegios, empresas y eventos de todo tipo.
            </p>
            <p className="text-sm text-[#3D7848] font-semibold mt-3">
              Toca cualquier taller para ver su historia, estructura y vídeos →
            </p>
          </motion.div>

          {/* Grid de talleres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {workshops.map((w, i) => (
              <motion.button
                key={w.id}
                onClick={() => setSelected(w)}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white rounded-3xl p-7 shadow-sm border-2 border-transparent hover:shadow-lg transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  // Border animado al hover a través de inline style no funciona con Tailwind puro
                  // Lo manejamos con CSS custom
                }}
                aria-label={`Ver detalles del ${w.title}`}
              >
                {/* Emoji + duración */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: w.color + '20' }}
                    aria-hidden="true"
                  >
                    {w.emoji}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#1A3020]/50 font-medium">{w.duration}</div>
                    <div className="text-xs font-semibold" style={{ color: w.color }}>{w.ageRange}</div>
                  </div>
                </div>

                <h3 className="font-[family-name:var(--font-fredoka)] text-xl font-bold text-[#1A3020] mb-2 group-hover:text-[#3D7848] transition-colors">
                  {w.title}
                </h3>
                <p className="text-[#1A3020]/65 text-sm leading-relaxed mb-4">
                  {w.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label={`Etiquetas de ${w.title}`}>
                  {w.tags.map(tag => (
                    <span
                      key={tag}
                      role="listitem"
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: w.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Ver más hint */}
                <div
                  className="flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: w.color }}
                >
                  <span>Ver historia · fases · galería</span>
                  <span aria-hidden="true">→</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* CTA Talleres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center bg-[#3D7848] rounded-3xl p-10 text-white"
          >
            <div className="text-5xl mb-4" aria-hidden="true">🌱</div>
            <h3 className="font-[family-name:var(--font-fredoka)] text-3xl font-bold mb-3">
              ¿Tu colegio o empresa quiere un taller?
            </h3>
            <p className="text-white/75 mb-6 max-w-lg mx-auto leading-relaxed">
              Diseñamos talleres a medida para grupos de todas las edades.
              Cuéntanos qué necesitáis y lo preparamos juntos.
            </p>
            <a
              href={`https://wa.me/34${siteConfig.whatsapp}?text=${encodeURIComponent('Hola DiverNature 👋 Me interesa organizar un taller ambiental para mi colegio/empresa. ¿Podéis darme información?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-[family-name:var(--font-fredoka)] bg-[#F0CE55] text-[#1A3020] text-lg font-bold px-8 py-4 rounded-2xl hover:bg-[#e8c440] transition-all hover:scale-105 active:scale-95"
            >
              Pedir información de talleres →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <WorkshopModal workshop={selected} onClose={() => setSelected(null)} />
    </>
  )
}
