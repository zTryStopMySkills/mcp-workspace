'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { siteConfig } from '@/lib/content'

const ParticleCanvas = dynamic(() => import('@/components/ParticleCanvas'), { ssr: false })

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' as const },
})

// Cards que aparecen en el glassmorphism flotante
const glassCards = [
  { emoji: '🎂', label: 'Cumpleaños', color: '#E87838' },
  { emoji: '🌿', label: 'ECOfriendly', color: '#8CC840' },
  { emoji: '⭐', label: '5 estrellas', color: '#F0CE55' },
  { emoji: '👨‍👩‍👧', label: 'Familias felices', color: '#3D7848' },
]

export default function HeroSection() {
  const waHref = `https://wa.me/34${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`

  return (
    <section
      id="inicio"
      aria-label="Bienvenida a DiverNature"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#3D7848] pt-20"
    >
      {/* Canvas de partículas */}
      <ParticleCanvas />

      {/* Blobs de fondo */}
      {[
        { s: 500, x: '-15%', y: '-10%', c: '#2A5C38', d: 0 },
        { s: 400, x: '60%', y: '-5%', c: '#4A9C5A', d: 1 },
        { s: 300, x: '70%', y: '55%', c: '#E87838', d: 2 },
        { s: 250, x: '2%', y: '65%', c: '#8CC840', d: 1.5 },
      ].map((b, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: b.d }}
          style={{
            position: 'absolute', width: b.s, height: b.s,
            left: b.x, top: b.y,
            backgroundColor: b.c, opacity: 0.22,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(60px)',
          }}
        />
      ))}

      {/* Layout split */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ——— Columna izquierda: Texto ——— */}
        <div className="text-white text-center lg:text-left">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center lg:justify-start"
          >
            <Image
              src="/images/logo.png"
              alt="DiverNature Entretenimiento ECOfriendly"
              width={340}
              height={103}
              priority
              className="w-[260px] md:w-[320px] h-auto drop-shadow-lg"
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-5 text-white/90"
          >
            <span aria-hidden="true">⭐</span>
            <span>Cientos de familias felices en Sevilla</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-[family-name:var(--font-fredoka)] text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] mb-5"
          >
            La aventura empieza
            <span className="block text-[#F0CE55]">en su cumpleaños</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.35)}
            className="text-lg md:text-xl text-white/80 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0"
          >
            Animaciones infantiles con valores que los niños
            recordarán para siempre. Naturales, originales y llenas de energía.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.5)}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
          >
            <a
              href="#contacto"
              className="font-[family-name:var(--font-fredoka)] bg-[#E87838] hover:bg-[#d06828] text-white text-xl font-semibold px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
            >
              🎉 Reserva tu fiesta
            </a>
            <a
              href="#packs"
              className="font-[family-name:var(--font-fredoka)] bg-white/15 hover:bg-white/25 border-2 border-white/40 hover:border-white/70 text-white text-xl font-semibold px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Ver nuestros packs →
            </a>
          </motion.div>

          {/* WhatsApp */}
          <motion.div {...fadeUp(0.65)}>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors text-sm"
              aria-label="Contactar por WhatsApp al 615 538 380"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              615 538 380 — Respondemos siempre
            </a>
          </motion.div>
        </div>

        {/* ——— Columna derecha: Glassmorphism card ——— */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="hidden lg:flex flex-col gap-4"
          aria-hidden="true"
        >
          {/* Tarjeta principal glassmorphism */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            {/* Imagen del equipo con overlay */}
            <div className="relative w-full h-72 overflow-hidden">
              <Image
                src="/images/monitores.png"
                alt="El equipo de monitores de DiverNature: Samuel, Irene, Paula y Adrián"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A3020]/60 via-transparent to-transparent" />
            </div>

            {/* Info sobre la imagen */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/logo.png"
                  alt="DiverNature"
                  width={120}
                  height={36}
                  className="h-7 w-auto brightness-0 invert"
                />
                <span className="bg-[#8CC840] text-white text-xs font-bold px-3 py-1 rounded-full">
                  ECOfriendly ✓
                </span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Samuel, Irene, Paula y Adrián — monitores con vocación.
                Sin mirar el reloj. 🌍
              </p>
            </div>
          </motion.div>

          {/* Mini cards de stats */}
          <div className="grid grid-cols-2 gap-3">
            {glassCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.04 }}
                className="rounded-2xl p-4 flex items-center gap-3 shadow-md"
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.22)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-none"
                  style={{ backgroundColor: card.color + '30' }}
                >
                  {card.emoji}
                </div>
                <span className="text-white font-[family-name:var(--font-fredoka)] font-semibold text-sm leading-tight">
                  {card.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tarjeta de servicios con burbujas animadas */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="rounded-3xl p-6 shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <p className="text-white/70 font-[family-name:var(--font-fredoka)] text-xs font-semibold uppercase tracking-widest mb-4">
              Lo que hacemos
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🎂', label: 'Cumpleaños', color: '#E87838' },
                { emoji: '🌿', label: 'Talleres', color: '#8CC840' },
                { emoji: '🎉', label: 'Eventos', color: '#F0CE55' },
                { emoji: '🏢', label: 'Empresas', color: '#3D7848' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                  whileHover={{ scale: 1.06 }}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: item.color + '25', border: `1px solid ${item.color}40` }}
                >
                  <span className="text-2xl flex-none" aria-hidden="true">{item.emoji}</span>
                  <span className="text-white font-[family-name:var(--font-fredoka)] font-semibold text-sm leading-tight">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-2">
              <span className="text-[#F0CE55] text-sm" aria-hidden="true">⭐⭐⭐⭐⭐</span>
              <span className="text-white/65 font-[family-name:var(--font-fredoka)] text-xs">
                Valorados 5 estrellas en Google
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave inferior */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 72C960 74.7 1056 69.3 1152 61.3C1248 53.3 1344 42.7 1392 37.3L1440 32V80H0Z" fill="#F7FAF2"/>
        </svg>
      </div>
    </section>
  )
}
