'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn, ChevronLeft, ChevronRight, Play } from 'lucide-react'

type MediaItem = {
  src: string
  thumb: string
  alt: string
  type: 'image' | 'video'
  tag?: string
}

const ITEMS: MediaItem[] = [
  // Platos y brasa
  { src: '/gallery/post-1.jpg',       thumb: '/gallery/post-1.jpg',       alt: 'Carne a la brasa de encina',          type: 'image', tag: 'Platos' },
  { src: '/gallery/post-2.jpg',       thumb: '/gallery/post-2.jpg',       alt: 'Corte de la casa en tabla',           type: 'image', tag: 'Platos' },
  { src: '/gallery/post-3.jpg',       thumb: '/gallery/post-3.jpg',       alt: 'Especialidad de temporada',           type: 'image', tag: 'Platos' },
  { src: '/gallery/post-4.jpg',       thumb: '/gallery/post-4.jpg',       alt: 'Presentación de plato',               type: 'image', tag: 'Platos' },
  { src: '/gallery/post-5.jpg',       thumb: '/gallery/post-5.jpg',       alt: 'Plato ibérico',                       type: 'image', tag: 'Platos' },
  { src: '/gallery/post-6.jpg',       thumb: '/gallery/post-6.jpg',       alt: 'Corte premium a la brasa',            type: 'image', tag: 'Platos' },
  // Vídeos de platos
  { src: '/gallery/reel-platos.mp4',  thumb: '/gallery/reel-platos.jpg',  alt: 'Vídeo — platos de temporada',         type: 'video', tag: 'Vídeo' },
  { src: '/gallery/reel-platos2.mp4', thumb: '/gallery/reel-platos2.jpg', alt: 'Vídeo — especialidades de la casa',   type: 'video', tag: 'Vídeo' },
  // Famosos y visitas
  { src: '/gallery/famosos-1.jpg',    thumb: '/gallery/famosos-1.jpg',    alt: 'Visita especial a la bodega',         type: 'image', tag: 'Famosos' },
  { src: '/gallery/famosos-2.jpg',    thumb: '/gallery/famosos-2.jpg',    alt: 'Invitados especiales',                type: 'image', tag: 'Famosos' },
  { src: '/gallery/famosos-3.jpg',    thumb: '/gallery/famosos-3.jpg',    alt: 'Visita de influencers',               type: 'image', tag: 'Famosos' },
  { src: '/gallery/famosos-4.jpg',    thumb: '/gallery/famosos-4.jpg',    alt: 'Personalidades en la bodega',         type: 'image', tag: 'Famosos' },
  { src: '/gallery/famosos-5.jpg',    thumb: '/gallery/famosos-5.jpg',    alt: 'Evento especial en la bodega',        type: 'image', tag: 'Famosos' },
  { src: '/gallery/famosos-6.jpg',    thumb: '/gallery/famosos-6.jpg',    alt: 'Visita VIP',                          type: 'image', tag: 'Famosos' },
  { src: '/gallery/famosos-7.jpg',    thumb: '/gallery/famosos-7.jpg',    alt: 'Celebración en Bodega Aljarafe',      type: 'image', tag: 'Famosos' },
]

export default function Galeria() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const prev = useCallback(() =>
    setLightboxIdx((i) => (i === null ? null : (i - 1 + ITEMS.length) % ITEMS.length)), [])
  const next = useCallback(() =>
    setLightboxIdx((i) => (i === null ? null : (i + 1) % ITEMS.length)), [])

  return (
    <section
      id="galeria"
      className="section-brand overflow-hidden"
      style={{ background: 'var(--color-cream-dark)' }}
      ref={ref}
    >
      <div className="container-brand">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">El ambiente y los platos</span>
          <h2 className="section-title">Galería</h2>
        </motion.div>

        <CarruselFotos items={ITEMS} inView={inView} onOpen={setLightboxIdx} />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(26,15,16,0.95)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
          >
            <button
              className="absolute left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(245,237,216,0.1)', color: 'white' }}
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={22} />
            </button>

            <motion.div
              key={lightboxIdx}
              className="relative mx-16 max-w-4xl w-full"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {ITEMS[lightboxIdx].type === 'video' ? (
                <video
                  src={ITEMS[lightboxIdx].src}
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                  style={{ maxHeight: '80vh' }}
                />
              ) : (
                <Image
                  src={ITEMS[lightboxIdx].src}
                  alt={ITEMS[lightboxIdx].alt}
                  width={1200}
                  height={900}
                  className="w-full h-auto object-contain rounded-lg"
                  style={{ maxHeight: '80vh' }}
                />
              )}
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(245,237,216,0.5)' }}>
                {ITEMS[lightboxIdx].alt} · {lightboxIdx + 1}/{ITEMS.length}
              </p>
            </motion.div>

            <button
              className="absolute right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(245,237,216,0.1)', color: 'white' }}
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRight size={22} />
            </button>

            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(245,237,216,0.15)', color: 'white' }}
              onClick={() => setLightboxIdx(null)}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function CarruselFotos({ items, inView, onOpen }: {
  items: MediaItem[]
  inView: boolean
  onOpen: (i: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    setDragging(true)
    setStartX(e.pageX - trackRef.current.offsetLeft)
    setScrollLeft(trackRef.current.scrollLeft)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !trackRef.current) return
    e.preventDefault()
    trackRef.current.scrollLeft = scrollLeft - (e.pageX - trackRef.current.offsetLeft - startX)
  }
  const stopDrag = () => setDragging(false)

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-4 select-none"
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.src + i}
            className="relative shrink-0 overflow-hidden rounded-xl group cursor-pointer"
            style={{ width: '280px', height: '360px', background: 'var(--color-dark)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.45), ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onOpen(i)}
          >
            <Image
              src={item.thumb}
              alt={item.alt}
              fill
              draggable={false}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="280px"
            />

            {/* Tag */}
            {item.tag && (
              <div className="absolute top-3 left-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(26,15,16,0.7)', color: 'rgba(245,237,216,0.9)' }}
                >
                  {item.tag}
                </span>
              </div>
            )}

            {/* Video play icon */}
            {item.type === 'video' && (
              <div className="absolute top-3 right-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(123,45,59,0.85)' }}
                >
                  <Play size={14} color="white" fill="white" />
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(26,15,16,0.4)' }}
            >
              <ZoomIn size={26} color="white" />
            </div>

            {/* Caption */}
            <div
              className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{ background: 'rgba(26,15,16,0.75)' }}
            >
              <p className="text-xs text-center" style={{ color: 'rgba(245,237,216,0.85)' }}>
                {item.alt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 bottom-4 left-0 w-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-cream-dark), transparent)' }} />
      <div className="absolute top-0 bottom-4 right-0 w-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--color-cream-dark), transparent)' }} />
    </div>
  )
}
