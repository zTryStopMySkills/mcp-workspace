'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false })

// Reels descargados como MP4 local
const reels = [
  { shortcode: 'DVjoDbXDgNp', file: 'DVjoDbXDgNp.mp4', label: 'Aventura pirata' },
  { shortcode: 'DFYkk5guktL', file: 'DFYkk5guktL.mp4', label: 'Cumple pirata pro' },
  { shortcode: 'DFUsGjhM5ef', file: 'DFUsGjhM5ef.mp4', label: 'Cumple aventurero' },
  { shortcode: 'C5wQKt9MR_l', file: 'C5wQKt9MR_l.mp4', label: 'Pack clásico' },
  { shortcode: 'DI1tDk6M5D7', file: 'DI1tDk6M5D7.mp4', label: 'Con los niños' },
  { shortcode: 'DH6fJcBMZFc', file: 'DH6fJcBMZFc.mp4', label: 'Animación en acción' },
  { shortcode: 'DOEh7vfji1M', file: 'DOEh7vfji1M.mp4', label: 'Talleres ambientales' },
  { shortcode: 'Ccmzj_JDEGU', file: 'Ccmzj_JDEGU.mp4', label: 'Presentación' },
  { shortcode: 'CbyOmJFj6pf', file: 'CbyOmJFj6pf.mp4', label: 'Manualidad primavera' },
]

// Posts con imagen — embeds de IG
const photoPosts = [
  { shortcode: 'DVt2fxJDq-Y', label: 'Historia DiverNature' },
  { shortcode: 'DODTZxrDPLG', label: 'Foto presentación' },
  { shortcode: 'DJFKULoMGCb', label: 'Momentos con niños' },
  { shortcode: 'DH_mWgGMhKi', label: 'Equipo en acción' },
]

export default function InstagramSection() {
  const ref = useRef(null)
  const reelScrollRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const scroll = (dir: 'left' | 'right') => {
    if (!reelScrollRef.current) return
    reelScrollRef.current.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' })
  }

  return (
    <section
      id="momentos"
      ref={ref}
      aria-labelledby="instagram-heading"
      className="py-20 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <span className="inline-block bg-[#E87838]/10 text-[#E87838] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              📸 Nuestros momentos
            </span>
            <h2
              id="instagram-heading"
              className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-[#1A3020]"
            >
              La magia en
              <span className="text-[#3D7848]"> vídeo real</span>
            </h2>
            <p className="text-[#1A3020]/60 mt-2 max-w-sm leading-relaxed">
              Esto es lo que viven los niños. Sin filtros. Sin guión.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} aria-label="Anterior" className="w-10 h-10 rounded-full bg-[#3D7848]/10 hover:bg-[#3D7848]/20 text-[#3D7848] flex items-center justify-center text-xl transition-colors">‹</button>
              <button onClick={() => scroll('right')} aria-label="Siguiente" className="w-10 h-10 rounded-full bg-[#3D7848]/10 hover:bg-[#3D7848]/20 text-[#3D7848] flex items-center justify-center text-xl transition-colors">›</button>
            </div>
            <a
              href="https://www.instagram.com/divernature/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-fredoka)] text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E87838] to-[#D44F8F] text-white hover:opacity-90 transition-opacity"
            >
              @divernature →
            </a>
          </div>
        </motion.div>

        {/* ── Sección Reels: vídeos nativos en scroll horizontal ── */}
        <p className="text-xs font-bold text-[#3D7848] uppercase tracking-widest mb-4">🎬 Reels</p>
        <div
          ref={reelScrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 snap-x snap-mandatory mb-12"
          role="list"
          aria-label="Reels de DiverNature"
        >
          {reels.map((reel, i) => (
            <motion.div
              key={reel.shortcode}
              role="listitem"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.06, type: 'spring', stiffness: 180 }}
              className="flex-none snap-start"
              style={{ width: 260 }}
            >
              <VideoPlayer
                src={`/videos/${reel.file}`}
                title={`🎬 ${reel.label}`}
                instagramUrl={`https://www.instagram.com/reel/${reel.shortcode}/`}
                className="rounded-2xl"
              />
            </motion.div>
          ))}
        </div>

        {/* ── Sección Fotos: embeds de IG ── */}
        <p className="text-xs font-bold text-[#E87838] uppercase tracking-widest mb-4">📷 Fotos</p>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          role="list"
          aria-label="Fotos de DiverNature en Instagram"
        >
          {photoPosts.map((post, i) => (
            <motion.div
              key={post.shortcode}
              role="listitem"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.08, type: 'spring', stiffness: 180 }}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-[#3D7848]/10 bg-[#F7FAF2]"
            >
              <div className="overflow-hidden" style={{ height: 380 }}>
                <iframe
                  src={`https://www.instagram.com/p/${post.shortcode}/embed/`}
                  width="100%"
                  height="500"
                  style={{ border: 'none', marginTop: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  title={`DiverNature — ${post.label}`}
                />
              </div>
              <div className="px-4 py-3 flex items-center gap-2">
                <span className="text-xs" aria-hidden="true">📷</span>
                <p className="text-xs font-semibold text-[#1A3020]/70 flex-1">{post.label}</p>
                <a
                  href={`https://www.instagram.com/p/${post.shortcode}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#3D7848] hover:underline"
                  aria-label={`Ver en Instagram: ${post.label}`}
                >
                  Ver →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[#1A3020]/35 text-sm mt-4 md:hidden">← Desliza para ver más →</p>
      </div>
    </section>
  )
}
