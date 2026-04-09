'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { packs } from '@/lib/content'
import dynamic from 'next/dynamic'

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false })

type Pack = typeof packs[0]

export default function PacksSection() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  return (
    <>
      <section
        id="packs"
        ref={ref}
        aria-labelledby="packs-heading"
        className="py-24 bg-[#3D7848] overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <span className="inline-block bg-[#F0CE55]/20 text-[#F0CE55] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              8 temáticas únicas
            </span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2
                id="packs-heading"
                className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-white leading-tight"
              >
                Elige la aventura
                <span className="block text-[#F0CE55]">de tu hijo</span>
              </h2>
              <p className="text-white/70 max-w-sm md:text-right leading-relaxed">
                Todas personalizables. Todas con el mismo nivel de entrega y cariño.
              </p>
            </div>
          </motion.div>

          {/* Scroll controls */}
          <div className="flex gap-2 mb-6 justify-end" aria-label="Controles de desplazamiento">
            <button
              onClick={() => scroll('left')}
              aria-label="Desplazar a la izquierda"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-xl"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Desplazar a la derecha"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-xl"
            >
              ›
            </button>
          </div>

          {/* Horizontal scroll container */}
          <div
            ref={scrollRef}
            role="list"
            aria-label="Lista de packs disponibles"
            className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 snap-x snap-mandatory"
          >
            {packs.map((pack, i) => (
              <motion.article
                key={pack.id}
                role="listitem"
                initial={{ opacity: 0, x: 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, type: 'spring', stiffness: 180 }}
                whileHover={{ y: -8, scale: 1.03, rotateZ: -1 }}
                className="flex-none w-[280px] md:w-[300px] snap-start"
              >
                <div
                  className="h-full rounded-3xl p-6 flex flex-col gap-4 shadow-md hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: pack.bg }}
                >
                  {/* Tag */}
                  <span
                    className="self-start text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: pack.color }}
                  >
                    {pack.tag}
                  </span>

                  {/* Emoji */}
                  <div className="text-5xl" aria-hidden="true">{pack.emoji}</div>

                  {/* Nombre */}
                  <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020]">
                    {pack.name}
                  </h3>

                  {/* Descripción */}
                  <p className="text-[#1A3020]/70 text-sm leading-relaxed flex-1">
                    {pack.description}
                  </p>

                  {/* CTA — opens modal */}
                  <button
                    onClick={() => setSelectedPack(pack)}
                    className="mt-auto font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-2.5 rounded-xl text-white text-center transition-all hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: pack.color }}
                    aria-label={`Consultar el ${pack.name}`}
                  >
                    ¡Me interesa! →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Hint scroll móvil */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            className="text-center text-white/40 text-sm mt-6 md:hidden"
            aria-live="polite"
          >
            ← Desliza para ver todos los packs →
          </motion.p>
        </div>

        {/* Wave inferior */}
        <div aria-hidden="true" className="overflow-hidden leading-none mt-16">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16 md:h-20">
            <path d="M0 32L48 37.3C96 42.7 192 53.3 288 58.7C384 64 480 64 576 58.7C672 53.3 768 42.7 864 37.3C960 32 1056 32 1152 37.3C1248 42.7 1344 53.3 1392 58.7L1440 64V80H0Z" fill="#F7FAF2"/>
          </svg>
        </div>
      </section>

      {/* Booking modal (portal) */}
      {selectedPack && (
        <BookingModal pack={selectedPack} onClose={() => setSelectedPack(null)} />
      )}
    </>
  )
}
