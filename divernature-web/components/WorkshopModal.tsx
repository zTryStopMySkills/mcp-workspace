'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { Workshop } from '@/lib/content'
import { siteConfig } from '@/lib/content'

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false })

// Reels con archivo local disponible
const LOCAL_REELS = new Set([
  'DOEh7vfji1M','CbyOmJFj6pf','DI1tDk6M5D7','DH6fJcBMZFc',
  'DVjoDbXDgNp','DFYkk5guktL','DFUsGjhM5ef','C5wQKt9MR_l','Ccmzj_JDEGU',
])

type Tab = 'historia' | 'estructura' | 'galeria'

interface Props {
  workshop: Workshop | null
  onClose: () => void
}

export default function WorkshopModal({ workshop, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('historia')

  useEffect(() => {
    if (workshop) setTab('historia')
  }, [workshop])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (workshop) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [workshop])

  if (!workshop) return null

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'historia', label: 'Historia', emoji: '📖' },
    { id: 'estructura', label: 'Cómo funciona', emoji: '🗺️' },
    { id: 'galeria', label: 'Galería', emoji: '🎬' },
  ]

  const waText = encodeURIComponent(
    `Hola DiverNature 👋 Me interesa el *${workshop.title}* para mi grupo. ¿Podéis darme información?`
  )

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
        style={{ backgroundColor: 'rgba(26,48,32,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          role="dialog" aria-modal="true"
          className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          style={{ maxHeight: '92vh' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="workshop-modal-title"
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div
            className="px-7 pt-7 pb-5 flex-none"
            style={{ background: `linear-gradient(135deg, ${workshop.color}22 0%, #fff 100%)` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-none shadow-sm"
                style={{ backgroundColor: workshop.color + '20' }}
                aria-hidden="true"
              >
                {workshop.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: workshop.color }}>
                  Taller ambiental
                </p>
                <h2
                  id="workshop-modal-title"
                  className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] leading-tight"
                >
                  {workshop.title}
                </h2>
                <div className="flex gap-3 mt-2 text-xs text-[#1A3020]/55 font-medium">
                  <span>⏱ {workshop.duration}</span>
                  <span>👧 {workshop.ageRange}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-full bg-[#1A3020]/8 hover:bg-[#1A3020]/15 flex items-center justify-center text-[#1A3020]/50 hover:text-[#1A3020] transition-colors text-lg flex-none"
              >
                ✕
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {workshop.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: workshop.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Tabs ────────────────────────────────────────────────── */}
          <div className="flex border-b border-[#1A3020]/8 flex-none px-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  tab === t.id
                    ? 'border-current text-[#1A3020]'
                    : 'border-transparent text-[#1A3020]/45 hover:text-[#1A3020]/70'
                }`}
                style={tab === t.id ? { borderColor: workshop.color, color: workshop.color } : {}}
              >
                <span aria-hidden="true">{t.emoji}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Content ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {tab === 'historia' && (
                <motion.div
                  key="historia"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="px-7 py-6"
                >
                  <p className="text-sm text-[#1A3020]/50 font-semibold uppercase tracking-widest mb-4">
                    Por qué existe este taller
                  </p>
                  {workshop.story.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[#1A3020]/75 leading-relaxed mb-4 last:mb-0">
                      {para}
                    </p>
                  ))}

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-[#1A3020]/8">
                    <a
                      href={`https://wa.me/34${siteConfig.whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 font-[family-name:var(--font-fredoka)] text-lg font-bold py-4 rounded-2xl text-white transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]"
                      style={{ backgroundColor: workshop.color }}
                    >
                      Pedir información de este taller →
                    </a>
                    <p className="text-center text-xs text-[#1A3020]/40 mt-2">
                      Respondemos siempre en menos de 2 horas
                    </p>
                  </div>
                </motion.div>
              )}

              {tab === 'estructura' && (
                <motion.div
                  key="estructura"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="px-7 py-6"
                >
                  <p className="text-sm text-[#1A3020]/50 font-semibold uppercase tracking-widest mb-6">
                    Fases del taller
                  </p>

                  <div className="flex flex-col gap-0">
                    {workshop.phases.map((phase, i) => (
                      <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                        {/* Línea vertical */}
                        {i < workshop.phases.length - 1 && (
                          <div
                            className="absolute left-6 top-12 bottom-0 w-0.5"
                            style={{ backgroundColor: workshop.color + '30' }}
                            aria-hidden="true"
                          />
                        )}

                        {/* Número + icono */}
                        <div className="flex-none flex flex-col items-center gap-1">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm z-10"
                            style={{ backgroundColor: workshop.color + '20', border: `2px solid ${workshop.color}40` }}
                            aria-hidden="true"
                          >
                            {phase.icon}
                          </div>
                          <span
                            className="text-xs font-bold"
                            style={{ color: workshop.color + '80' }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Texto */}
                        <div className="flex-1 pt-1">
                          <h4 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#1A3020] mb-1">
                            {phase.title}
                          </h4>
                          <p className="text-sm text-[#1A3020]/65 leading-relaxed">
                            {phase.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Duración total */}
                  <div
                    className="mt-6 rounded-2xl p-4 flex items-center gap-3"
                    style={{ backgroundColor: workshop.color + '12' }}
                  >
                    <span className="text-2xl" aria-hidden="true">⏱</span>
                    <div>
                      <p className="font-semibold text-sm text-[#1A3020]">Duración total: {workshop.duration}</p>
                      <p className="text-xs text-[#1A3020]/55">Adaptable según el grupo y el espacio disponible</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === 'galeria' && (
                <motion.div
                  key="galeria"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="px-7 py-6"
                >
                  <p className="text-sm text-[#1A3020]/50 font-semibold uppercase tracking-widest mb-4">
                    Vídeos y fotos reales
                  </p>

                  <div className="flex flex-col gap-5">
                    {workshop.media.map(item => (
                      <div key={item.shortcode} className="rounded-2xl overflow-hidden border border-[#1A3020]/8 shadow-sm">
                        {/* Label */}
                        <div className="px-4 py-2.5 bg-[#F7FAF2] flex items-center gap-2 border-b border-[#1A3020]/8">
                          <span className="text-sm" aria-hidden="true">{item.type === 'reel' ? '🎬' : '📷'}</span>
                          <span className="text-xs font-semibold text-[#1A3020]/70">{item.label}</span>
                          <a
                            href={`https://www.instagram.com/${item.type === 'reel' ? 'reel' : 'p'}/${item.shortcode}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-xs font-semibold hover:underline"
                            style={{ color: workshop.color }}
                          >
                            Ver en IG →
                          </a>
                        </div>
                        {/* Video local o iframe IG */}
                        {item.type === 'reel' && LOCAL_REELS.has(item.shortcode) ? (
                          <VideoPlayer
                            src={`/videos/${item.shortcode}.mp4`}
                            title={item.label}
                            instagramUrl={`https://www.instagram.com/reel/${item.shortcode}/`}
                            className="rounded-none"
                          />
                        ) : (
                          <div className="overflow-hidden" style={{ height: 380 }}>
                            <iframe
                              src={`https://www.instagram.com/${item.type === 'reel' ? 'reel' : 'p'}/${item.shortcode}/embed/`}
                              width="100%"
                              height="560"
                              style={{ border: 'none', marginTop: 0, display: 'block' }}
                              allowFullScreen
                              loading="lazy"
                              title={item.label}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
