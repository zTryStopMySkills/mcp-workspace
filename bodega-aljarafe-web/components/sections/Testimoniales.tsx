'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import type { Testimonio } from '@/types'

interface Props {
  testimonios: Testimonio[]
}

export default function Testimoniales({ testimonios }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      className="relative section-brand overflow-hidden"
      ref={ref}
    >
      {/* Fondo: vídeo con overlay glassmorphism */}
      <div className="absolute inset-0 z-0">
        <video
          src="/videos/resenas-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/videos/resenas-video.jpg"
        />
        {/* Overlay oscuro */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(26,15,16,0.78)' }}
        />
      </div>

      <div className="relative z-10 container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>
            Lo que dice la gente
          </span>
          <h2 className="section-title" style={{ color: 'var(--color-cream)' }}>
            Ellos ya han estado.
          </h2>
        </motion.div>

        {/* Rating hero */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="font-display text-8xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
          >
            9/10
          </div>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="var(--color-accent)" color="var(--color-accent)" />
            ))}
          </div>
          <p className="text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}>
            Basado en más de 1.100 reseñas en Google Maps
          </p>
        </motion.div>

        {/* Cards glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonios.map((t, i) => (
            <motion.div
              key={t.nombre}
              className="relative p-6 rounded-2xl"
              style={{
                background: 'rgba(245,237,216,0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(245,237,216,0.15)',
                boxShadow: '0 8px 32px rgba(26,15,16,0.3)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-6 right-6 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(184,149,106,0.5), transparent)' }}
              />

              <Quote size={28} className="mb-4" style={{ color: 'rgba(184,149,106,0.4)' }} />
              <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(245,237,216,0.8)' }}>
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-cream)' }}>
                    {t.nombre}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(245,237,216,0.4)' }}>{t.fecha}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={12} fill="var(--color-accent)" color="var(--color-accent)" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
