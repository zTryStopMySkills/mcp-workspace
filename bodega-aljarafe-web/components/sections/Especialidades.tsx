'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Especialidad } from '@/types'

interface Props {
  especialidades: Especialidad[]
}

export default function Especialidades({ especialidades }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const destacadas = especialidades.filter((e) => e.destacado)
  const resto = especialidades.filter((e) => !e.destacado)

  return (
    <section
      id="especialidades"
      className="section-brand"
      style={{ background: 'var(--color-cream-dark)' }}
      ref={ref}
    >
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Lo que nos define</span>
          <h2 className="section-title mb-4">Nuestras Especialidades</h2>
          <p className="section-subtitle mx-auto">
            Carnes seleccionadas con criterio, maduradas con paciencia
            y asadas con el fuego que llevamos en la sangre.
          </p>
        </motion.div>

        {/* Grid destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {destacadas.map((esp, i) => (
            <motion.div
              key={esp.id}
              className="relative rounded-xl overflow-hidden group cursor-default"
              style={{
                background: 'var(--color-dark)',
                border: '1px solid rgba(184,149,106,0.2)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow top */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    'linear-gradient(to right, transparent, var(--color-accent), transparent)',
                }}
              />

              <div className="p-7">
                <div className="text-3xl mb-4">{esp.icono}</div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3
                    className="font-display text-xl font-bold leading-tight"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-cream)',
                    }}
                  >
                    {esp.nombre}
                  </h3>
                  <span
                    className="shrink-0 font-display font-bold text-sm whitespace-nowrap"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {esp.precio}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(245,237,216,0.65)' }}
                >
                  {esp.descripcion}
                </p>
              </div>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: 'var(--color-primary)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Row resto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resto.map((esp, i) => (
            <motion.div
              key={esp.id}
              className="flex items-start gap-4 p-5 rounded-lg"
              style={{
                background: 'white',
                border: '1px solid var(--color-border)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: destacadas.length * 0.1 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="text-2xl shrink-0 mt-0.5">{esp.icono}</span>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="font-display font-bold text-base leading-tight"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-dark)',
                    }}
                  >
                    {esp.nombre}
                  </h3>
                  <span className="precio-tag text-sm shrink-0">
                    {esp.precio}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {esp.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
