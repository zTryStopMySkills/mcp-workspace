'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  texto: string
  nombre: string
  rating: number
  fuente: string
}

interface TestimonialesProps {
  items: Testimonial[]
}

export default function Testimoniales({ items }: TestimonialesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section id="testimoniales" className="py-24 sm:py-32 bg-[#2D1F0D] relative overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/5 via-transparent to-[#8B1A1A]/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-xs font-body font-semibold tracking-widest uppercase text-[#D4A853] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
            Opiniones reales
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl text-[#F5EFE6] mb-4"
          >
            El Rincón no lo decimos nosotros
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-[#8B7355] text-lg"
          >
            Lo dicen ellos.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: 'center' }}
            className="h-[1px] w-16 mx-auto mt-5 bg-gradient-to-r from-transparent via-[#D4A853] to-transparent"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative p-7 rounded-sm bg-[#1A1008] border border-[#D4A853]/15
                         transition-all duration-500
                         hover:border-[#D4A853]/40 hover:-translate-y-1
                         hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Quote icon */}
              <Quote
                size={28}
                className="text-[#8B1A1A]/60 mb-4 group-hover:text-[#8B1A1A] transition-colors duration-300"
                aria-hidden="true"
              />

              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className="fill-[#D4A853] text-[#D4A853]"
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="font-body font-light text-[#8B7355] text-sm leading-relaxed mb-6
                            group-hover:text-[#F5EFE6]/70 transition-colors duration-300 italic">
                &ldquo;{item.texto}&rdquo;
              </p>

              {/* Autor */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-sm text-[#F5EFE6]">{item.nombre}</p>
                  <p className="font-body text-xs text-[#D4A853]/60 mt-0.5">{item.fuente}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#8B1A1A]/20 flex items-center justify-center
                                border border-[#8B1A1A]/30">
                  <span className="font-display font-bold text-sm text-[#D4A853]">
                    {item.nombre.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Accent bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-sm
                              bg-gradient-to-r from-transparent via-[#8B1A1A]/0 to-transparent
                              group-hover:via-[#D4A853]/40 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 py-8 border-t border-b border-[#D4A853]/15"
        >
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display font-bold text-5xl text-[#D4A853]">4.4</span>
              <Star size={20} className="fill-[#D4A853] text-[#D4A853] mb-1" />
            </div>
            <p className="font-body text-xs text-[#8B7355] mt-1">736 reseñas en Google</p>
          </div>

          <div className="hidden sm:block w-[1px] h-12 bg-[#D4A853]/20" />

          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display font-bold text-5xl text-[#D4A853]">9.2</span>
              <span className="font-body text-lg text-[#8B7355]">/10</span>
            </div>
            <p className="font-body text-xs text-[#8B7355] mt-1">Puntuación en TheFork</p>
          </div>

          <div className="hidden sm:block w-[1px] h-12 bg-[#D4A853]/20" />

          <div className="text-center">
            <span className="font-display font-bold text-5xl text-[#D4A853]">15+</span>
            <p className="font-body text-xs text-[#8B7355] mt-1">Años de confianza</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
