'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface GaleriaItem {
  src: string
  alt: string
  tipo: string
}

interface GaleriaProps {
  items: GaleriaItem[]
}

export default function Galeria({ items }: GaleriaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const [lightbox, setLightbox] = useState<GaleriaItem | null>(null)

  const GalleryImage = ({ item, delay }: { item: GaleriaItem; delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-sm cursor-pointer mb-4
                 border border-[#D4A853]/10 hover:border-[#D4A853]/40
                 transition-all duration-500 hover:-translate-y-1
                 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      onClick={() => setLightbox(item)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Overlay al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1008]/70 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn size={28} className="text-[#F5EFE6]" />
        </div>
        {/* Tipo badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-body tracking-wider uppercase
                        bg-[#1A1008]/70 text-[#D4A853] rounded-sm
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.tipo}
        </div>
      </div>
    </motion.div>
  )

  return (
    <section id="galeria" className="py-24 sm:py-32 bg-[#1A1008] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-xs font-body font-semibold tracking-widest uppercase text-[#D4A853] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
            Momentos en El Rincón
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl text-[#F5EFE6]"
          >
            La brasa tiene cara
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{ transformOrigin: 'center' }}
            className="h-[1px] w-16 mx-auto mt-5 bg-gradient-to-r from-transparent via-[#D4A853] to-transparent"
          />
        </div>

        {/* Grid masonry — 3 columnas en desktop, 2 en tablet, 1 en móvil */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {items.map((item, i) => (
            <GalleryImage key={item.src} item={item} delay={0.1 + Math.min(i * 0.08, 0.5)} />
          ))}
        </div>

        {/* CTA Instagram */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/elrincondesalteras/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4A853]/40 text-[#D4A853]
                       font-body font-semibold text-sm rounded-sm
                       transition-all duration-300 hover:bg-[#D4A853]/10 hover:border-[#D4A853]
                       hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Ver más en @elrincondesalteras
          </a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4
                       bg-[#1A1008]/95 backdrop-blur-lg"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#D4A853]/20">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-cover"
                  sizes="90vw"
                />
              </div>
              <p className="mt-3 text-center font-body text-sm text-[#8B7355]">{lightbox.alt}</p>

              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center
                           bg-[#8B1A1A] text-[#F5EFE6] rounded-full
                           hover:bg-[#A52020] transition-colors duration-200"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
