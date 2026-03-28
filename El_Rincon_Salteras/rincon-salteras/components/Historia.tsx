'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Historia() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section id="historia" className="py-24 sm:py-32 bg-[#2D1F0D] relative overflow-hidden">
      {/* Textura de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1008]/60 via-transparent to-[#1A1008]/40 pointer-events-none" />

      {/* Línea decorativa izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#8B1A1A]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Columna izquierda — texto */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 text-xs font-body font-semibold tracking-widest uppercase text-[#D4A853] mb-6"
            >
              <span className="w-8 h-[1px] bg-[#D4A853]" />
              Nuestra historia
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE6] leading-tight mb-6"
            >
              No es solo cocina. Es la historia de quien llegó sin nada y lo dio todo.
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              style={{ transformOrigin: 'left' }}
              className="h-[2px] w-12 bg-gradient-to-r from-[#8B1A1A] to-[#D4A853] mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-body font-light text-[#8B7355] text-base leading-relaxed mb-6"
            >
              Rubén llegó a Salteras desde Caacupé, Paraguay, hace más de quince años. Trajo consigo lo único que necesitaba: las manos de su madre y el fuego que las enseñaron a dominar. En 2018 abrió El Rincón. El pueblo lo adoptó como suyo desde el primer día.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-body font-light text-[#8B7355] text-base leading-relaxed"
            >
              Hoy, en su nuevo local diseñado hasta el último detalle, el fuego sigue siendo el protagonista. La Picaña, el Chuletón, las Croquetas que su equipo prepara cada mañana. Nada ha cambiado donde importa. Todo ha mejorado donde se nota.
            </motion.p>

            {/* Valores */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Artesanía', desc: 'Sin congelados, sin atajos' },
                { label: 'Raíces', desc: 'Paraguay en cada brasa' },
                { label: 'Excelencia', desc: 'La mejor carne. Sin debate' },
                { label: 'Hospitalidad', desc: 'Te conocemos por tu nombre' },
              ].map((val) => (
                <div
                  key={val.label}
                  className="p-4 rounded-sm border border-[#D4A853]/15 bg-[#1A1008]/40
                             hover:border-[#D4A853]/35 transition-colors duration-300"
                >
                  <p className="font-display font-bold text-sm text-[#D4A853] mb-1">{val.label}</p>
                  <p className="font-body text-xs text-[#8B7355]">{val.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Columna derecha — quote + stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Pull quote */}
            <div className="relative p-8 border border-[#8B1A1A]/40 bg-[#1A1008]/60 rounded-sm
                            backdrop-blur-sm">
              <div className="absolute -top-4 left-8 text-6xl font-display text-[#8B1A1A] leading-none">&ldquo;</div>
              <blockquote className="font-display font-bold italic text-2xl sm:text-3xl text-[#F5EFE6] mt-4 mb-2">
                Aquí cada mesa es la nuestra.
              </blockquote>
              <cite className="font-body text-sm text-[#D4A853] not-italic">— Rubén Darío Enciso Bernal, fundador</cite>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { number: '15+', label: 'Años en Salteras' },
                { number: '736', label: 'Reseñas Google' },
                { number: '9.2', label: 'TheFork rating' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  className="text-center p-4 rounded-sm border border-[#D4A853]/20 bg-[#1A1008]/40
                             hover:border-[#D4A853]/50 hover:bg-[#2D1F0D]/60 transition-all duration-300"
                >
                  <p className="font-display font-bold text-3xl text-[#D4A853]">{stat.number}</p>
                  <p className="font-body text-xs text-[#8B7355] mt-1 leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Nuevo local */}
            <div className="p-5 rounded-sm bg-gradient-to-br from-[#8B1A1A]/10 to-transparent border border-[#8B1A1A]/20">
              <p className="font-body text-sm text-[#8B7355] leading-relaxed">
                <span className="text-[#D4A853] font-semibold">2024:</span> Nuevo local diseñado por{' '}
                <span className="text-[#F5EFE6]">FABI interiorismo</span>. Madera, piedra y hierro forjado.
                El mismo fuego de siempre, en un espacio que está a su altura.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
