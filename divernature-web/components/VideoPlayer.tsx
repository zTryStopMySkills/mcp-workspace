'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  desc?: string
  instagramUrl?: string
  className?: string
}

export default function VideoPlayer({ src, title, desc, instagramUrl, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // IntersectionObserver: autoplay when ≥40% visible, pause otherwise
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          video.play().then(() => setPlaying(true)).catch(() => {})
        } else {
          video.pause()
          setPlaying(false)
        }
      },
      { threshold: [0.4] }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    hideTimeout.current = setTimeout(() => setShowControls(false), 2500)
  }, [])

  useEffect(() => () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden bg-[#1A3020] shadow-2xl group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={() => {
        setShowControls(true)
        if (hideTimeout.current) clearTimeout(hideTimeout.current)
        hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        style={{ minHeight: 480, maxHeight: 600 }}
        aria-label={title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Dark gradient overlay — always visible at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A3020]/90 via-[#1A3020]/20 to-transparent pointer-events-none" />

      {/* Text info — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
        <h3 className="font-[family-name:var(--font-fredoka)] text-white text-xl font-bold drop-shadow">
          {title}
        </h3>
        {desc && (
          <p className="text-white/70 text-sm mt-1 leading-relaxed">
            {desc}
          </p>
        )}
      </div>

      {/* Controls — appear on hover/touch */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-end justify-between p-4 pb-[4.5rem]"
          >
            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/35 text-white flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 border border-white/25"
            >
              {muted ? '🔇' : '🔊'}
            </button>

            {/* Ver en IG */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-[#E87838] to-[#D44F8F] text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                aria-label={`Ver ${title} en Instagram`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Ver en @divernature
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playing indicator (top-right) — subtle pulse when playing */}
      {playing && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-none">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-white text-[10px] font-semibold uppercase tracking-wider">En vivo</span>
        </div>
      )}
    </div>
  )
}
