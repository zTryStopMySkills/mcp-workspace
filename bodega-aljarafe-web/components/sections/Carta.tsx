'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CartaCategoria } from '@/types'

interface Props {
  carta: CartaCategoria[]
}

const tagColors: Record<string, string> = {
  'El más pedido': 'var(--color-primary)',
  Especialidad: 'var(--color-accent)',
  Temporada: '#5B7E4F',
}

export default function Carta({ carta }: Props) {
  const sorted = [...carta].sort((a, b) => a.orden - b.orden)
  const [activeTab, setActiveTab] = useState(sorted[0]?.categoria ?? '')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const activeCat = sorted.find((c) => c.categoria === activeTab)

  return (
    <section
      id="carta"
      className="section-brand"
      style={{ background: 'white' }}
      ref={ref}
    >
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Lo que servimos</span>
          <h2 className="section-title mb-3">Nuestra Carta</h2>
          <p className="section-subtitle mx-auto">
            Cocina directa, sin rodeos. Producto de primera y brasa de verdad.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {sorted.map((cat) => (
            <button
              key={cat.categoria}
              onClick={() => setActiveTab(cat.categoria)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                activeTab === cat.categoria
                  ? 'text-[var(--color-cream)] shadow-md scale-105'
                  : 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
              )}
              style={
                activeTab === cat.categoria
                  ? { background: 'var(--color-primary)' }
                  : {
                      background: 'var(--color-cream)',
                      border: '1px solid var(--color-border)',
                    }
              }
            >
              {cat.categoria}
            </button>
          ))}
        </div>

        {/* Platos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeCat?.platos.map((plato) => (
              <div
                key={plato.id}
                className="relative flex flex-col p-5 rounded-xl transition-shadow duration-200 hover:shadow-md"
                style={{
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* Badge destacado */}
                {plato.destacado && (
                  <span
                    className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{
                      background: tagColors[plato.destacado] ?? 'var(--color-muted)',
                    }}
                  >
                    {plato.destacado}
                  </span>
                )}

                <div className="flex items-start justify-between gap-4 mb-2 pr-28">
                  <div>
                    <h3
                      className="font-display font-bold text-base leading-tight mb-0.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-dark)',
                      }}
                    >
                      {plato.nombre}
                    </h3>
                    {plato.frase && (
                      <p
                        className="text-xs italic"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {plato.frase}
                      </p>
                    )}
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {plato.descripcion}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="precio-tag">{plato.precio}</span>
                  {plato.libre_de && plato.libre_de.length > 0 && (
                    <div className="flex gap-1.5">
                      {plato.libre_de.includes('gluten') && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: 'rgba(91,126,79,0.1)',
                            color: '#5B7E4F',
                          }}
                        >
                          Sin gluten
                        </span>
                      )}
                      {plato.libre_de.includes('lactosa') && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: 'rgba(91,126,79,0.1)',
                            color: '#5B7E4F',
                          }}
                        >
                          Sin lactosa
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Nota precio */}
        <p
          className="text-center text-xs mt-8"
          style={{ color: 'var(--color-muted)' }}
        >
          * Precios con IVA incluido. Las carnes al peso se sirven en pieza entera.
          Consulta disponibilidad de piezas premium.
        </p>
      </div>
    </section>
  )
}
