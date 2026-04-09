'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import VideoPlayer from '@/components/VideoPlayer'

const featured = [
  {
    file: 'DVjoDbXDgNp.mp4',
    shortcode: 'DVjoDbXDgNp',
    title: '🏴‍☠️ La Aventura Pirata',
    desc: 'El pack más épico. Un tesoro, una misión, una fiesta inolvidable.',
  },
  {
    file: 'DFYkk5guktL.mp4',
    shortcode: 'DFYkk5guktL',
    title: '🎂 Cumpleaños Pro',
    desc: 'Así es un cumpleaños cuando DiverNature lo organiza.',
  },
  {
    file: 'DOEh7vfji1M.mp4',
    shortcode: 'DOEh7vfji1M',
    title: '🌱 Taller Ambiental',
    desc: 'Aprender, crear y respetar el planeta. Todo a la vez.',
  },
]

export default function VideoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="videos"
      ref={ref}
      className="py-24 px-6 bg-[#1A3020]"
      aria-labelledby="video-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#F0CE55]/15 text-[#F0CE55] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🎬 En vídeo real
          </span>
          <h2
            id="video-heading"
            className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Esto es lo que
            <span className="text-[#F0CE55]"> viven los niños</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Sin guión. Sin filtros. Pura diversión y valores en acción.
            Pasa el cursor para ver los controles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <motion.div
              key={item.shortcode}
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, type: 'spring', stiffness: 120, damping: 20 }}
            >
              <VideoPlayer
                src={`/videos/${item.file}`}
                title={item.title}
                desc={item.desc}
                instagramUrl={`https://www.instagram.com/reel/${item.shortcode}/`}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA to full IG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.instagram.com/divernature/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-[family-name:var(--font-fredoka)] text-lg font-semibold px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E87838] to-[#D44F8F] text-white hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Ver todos los vídeos en @divernature
          </a>
        </motion.div>
      </div>
    </section>
  )
}
