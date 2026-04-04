'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown, Star, MapPin } from 'lucide-react'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section className="relative min-h-screen flex overflow-hidden">
      {/* ── LEFT PANEL — editorial cream ──────────────── */}
      <div
        className="relative z-10 flex flex-col justify-center w-full md:w-[55%] px-8 md:px-16 lg:px-20 pt-28 pb-16 md:pt-16"
        style={{ background: 'var(--color-cream)' }}
      >
        {/* Trust badge */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill="var(--color-accent)"
                color="var(--color-accent)"
              />
            ))}
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-muted)' }}
          >
            9/10 en 1.100+ reseñas
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-dark)',
          }}
        >
          Cuatro
          <br />
          <em
            className="not-italic"
            style={{ color: 'var(--color-primary)' }}
          >
            generaciones
          </em>
          <br />
          de brasa.
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl leading-relaxed mb-10 max-w-[38ch]"
          style={{ color: 'var(--color-muted)' }}
        >
          La mejor carne madurada del Aljarafe. T-Bone, Rubia Gallega,
          Lomo de Buey y Joselito — a la brasa de encina y olivo.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-12">
          <a href="tel:+34633208857" className="btn-primary gap-2 text-base">
            Reservar mesa
          </a>
          <a href="#carta" className="btn-outline text-base">
            Ver la carta
          </a>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin size={15} style={{ color: 'var(--color-accent)' }} />
          <span
            className="text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            C/ Virgen de Loreto 51, Castilleja de la Cuesta
          </span>
        </div>

        {/* Decorative vertical line */}
        <div
          className="absolute top-0 right-0 bottom-0 w-px hidden md:block"
          style={{
            background:
              'linear-gradient(to bottom, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)',
          }}
        />
      </div>

      {/* ── RIGHT PANEL — imagen/video ─────────────── */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden">
        {/* Vídeo de fondo — si existe */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-brasa.mp4"
          muted
          loop
          playsInline
          poster="/gallery/hero-poster.jpg"
        />
        {/* Fallback imagen si no hay vídeo */}
        {/* Overlay sutil */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(245,237,216,0.15) 0%, transparent 30%), linear-gradient(to bottom, rgba(26,15,16,0.1) 0%, transparent 40%)',
          }}
        />
        {/* Ornamental tag */}
        <div
          className="absolute bottom-8 left-8 right-8 p-5 rounded-lg backdrop-blur-sm"
          style={{
            background: 'rgba(245,237,216,0.9)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            className="font-display text-sm italic leading-snug"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-dark)',
            }}
          >
            &ldquo;La mejor carne del Aljarafe, con su toque idóneo de sal.
            Tierna y jugosa, en su punto justo.&rdquo;
          </p>
          <p
            className="text-xs mt-2 font-medium"
            style={{ color: 'var(--color-muted)' }}
          >
            — María G., Google Reviews
          </p>
        </div>
      </div>

      {/* Mobile image strip */}
      <div
        className="md:hidden absolute bottom-0 left-0 right-0 h-48 overflow-hidden"
        style={{ background: 'var(--color-dark)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'var(--color-dark)', opacity: 0.6 }}
        />
      </div>

      {/* Scroll indicator */}
      <a
        href="#especialidades"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 group"
        aria-label="Ver más"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'var(--color-muted)' }}
        >
          Descubrir
        </span>
        <ChevronDown
          size={18}
          style={{ color: 'var(--color-accent)' }}
          className="animate-bounce"
        />
      </a>
    </section>
  )
}
