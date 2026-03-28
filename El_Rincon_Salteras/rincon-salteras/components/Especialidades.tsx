'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Especialidad {
  id: string
  nombre: string
  descripcion: string
  emoji: string
  destacado: boolean
}

interface EspecialidadesProps {
  items: Especialidad[]
}

// SVG personalizado de llama
function FlameIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 9 6.5 9 10C9 11.66 9.67 13.16 10.76 14.24C10.09 13.6 9.5 12.79 9.5 11.5C9.5 11.5 7 13.5 7 17C7 20.31 9.24 23 12 23C14.76 23 17 20.31 17 17C17 13.5 14.5 11.5 14.5 11.5C14.5 12.79 13.91 13.6 13.24 14.24C14.33 13.16 15 11.66 15 10C15 6.5 12 2 12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 16C12 16 10.5 14.5 10.5 13C10.5 13 12 14.5 12 14.5C12 14.5 13.5 13 13.5 13C13.5 14.5 12 16 12 16Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  )
}

export default function Especialidades({ items }: EspecialidadesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  const destacados = items.filter((i) => i.destacado)
  const resto = items.filter((i) => !i.destacado)

  return (
    <section id="especialidades" className="py-24 sm:py-32 bg-[#1A1008] relative overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1F0D]/20 via-transparent to-[#2D1F0D]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-xs font-body font-semibold tracking-widest uppercase text-[#D4A853] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
            Nuestra carta
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl text-[#F5EFE6] mb-4"
          >
            Del fuego a la mesa
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-[#8B7355] text-lg max-w-xl mx-auto"
          >
            Sin atajos, sin congelados, sin excepciones.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: 'center' }}
            className="h-[1px] w-16 mx-auto mt-6 bg-gradient-to-r from-transparent via-[#D4A853] to-transparent"
          />
        </div>

        {/* Cards destacadas — top 3 más grandes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {destacados.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative p-8 rounded-sm border border-[#D4A853]/15 bg-[#2D1F0D]
                         transition-all duration-500 cursor-default
                         hover:border-[#D4A853]/50 hover:-translate-y-2
                         hover:shadow-[0_8px_32px_rgba(139,26,26,0.25),_0_0_0_1px_rgba(212,168,83,0.2)]"
            >
              {/* Icon */}
              <div className="mb-6 flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <FlameIcon className="w-full h-full text-[#8B1A1A] group-hover:text-[#D4A853] transition-colors duration-400" />
                  <div className="absolute inset-0 blur-md bg-[#8B1A1A]/20 group-hover:bg-[#D4A853]/20 transition-colors duration-400 rounded-full" />
                </div>
                <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#F5EFE6] mb-3 group-hover:text-[#D4A853] transition-colors duration-300">
                {item.nombre}
              </h3>
              <p className="font-body text-[#8B7355] text-sm leading-relaxed group-hover:text-[#F5EFE6]/70 transition-colors duration-300">
                {item.descripcion}
              </p>

              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-0 h-0
                              border-l-[20px] border-l-transparent
                              border-t-[20px] border-t-[#8B1A1A]/0
                              group-hover:border-t-[#D4A853]/30
                              transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Cards secundarias — 3 más pequeñas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resto.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group flex items-start gap-4 p-5 rounded-sm border border-[#D4A853]/10 bg-[#221508]
                         transition-all duration-400 hover:border-[#D4A853]/30 hover:bg-[#2D1F0D]"
            >
              <span className="text-xl mt-0.5 shrink-0" aria-hidden="true">{item.emoji}</span>
              <div>
                <h4 className="font-display font-bold text-base text-[#F5EFE6] mb-1 group-hover:text-[#D4A853] transition-colors duration-300">
                  {item.nombre}
                </h4>
                <p className="font-body text-[#8B7355] text-xs leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA ver carta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href={`https://wa.me/34954966184?text=${encodeURIComponent('Hola Rincón! ¿Podéis enviarme la carta completa? Gracias.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4A853]/40 text-[#D4A853]
                       font-body font-semibold text-sm rounded-sm
                       transition-all duration-300 hover:bg-[#D4A853]/10 hover:border-[#D4A853]
                       hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(212,168,83,0.2)]"
          >
            Pedir la carta completa
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
