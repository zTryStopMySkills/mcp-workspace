'use client'

import { motion } from 'framer-motion'
import { Star, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface HeroProps {
  data: {
    headline: string
    subheadline: string
    ctaPrimario: string
    ctaSecundario: string
    badge: string
    imagen: string
  }
}

export default function Hero({ data }: HeroProps) {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A1008]">
      {/* Background image con overlay */}
      <div className="absolute inset-0">
        <Image
          src={data.imagen}
          alt="El Rincón de Salteras — brasa"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        {/* Gradient overlay — fuego desde abajo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1008] via-[#1A1008]/60 to-[#1A1008]/70" />
        {/* Viñeta lateral */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1008]/60 via-transparent to-[#1A1008]/60" />
      </div>

      {/* Partículas de luz (simuladas con CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#D4A853]"
            style={{
              left: `${15 + i * 14}%`,
              top: `${60 + (i % 3) * 10}%`,
            }}
            animate={{
              y: [-20, -60, -20],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8
                     backdrop-blur-sm bg-[#2D1F0D]/60 border border-[#D4A853]/30 rounded-full
                     text-sm font-body text-[#D4A853]"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={12}
              className={i <= 4 ? 'fill-[#D4A853] text-[#D4A853]' : 'fill-[#D4A853]/30 text-[#D4A853]/30'}
            />
          ))}
          <span className="ml-1">{data.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-[#F5EFE6] leading-tight mb-6"
        >
          <span className="block">A fuego lento,</span>
          <span className="block italic text-[#D4A853]">desde el corazón</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-body font-light text-lg sm:text-xl text-[#8B7355] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {data.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => handleScroll('#reserva')}
            className="group relative px-8 py-4 bg-[#8B1A1A] text-[#F5EFE6] font-body font-bold text-base
                       rounded-sm overflow-hidden transition-all duration-300
                       hover:bg-[#A52020] hover:-translate-y-1
                       hover:shadow-[0_8px_32px_rgba(139,26,26,0.6)]
                       active:translate-y-0 w-full sm:w-auto"
          >
            <span className="relative z-10">{data.ctaPrimario}</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0
                            bg-gradient-to-r from-transparent via-white/10 to-transparent
                            transition-transform duration-500" />
          </button>

          <button
            onClick={() => handleScroll('#especialidades')}
            className="px-8 py-4 border border-[#D4A853]/60 text-[#D4A853] font-body font-semibold text-base
                       rounded-sm transition-all duration-300
                       hover:bg-[#D4A853]/10 hover:border-[#D4A853] hover:-translate-y-1
                       hover:shadow-[0_4px_16px_rgba(212,168,83,0.2)]
                       w-full sm:w-auto"
          >
            {data.ctaSecundario}
          </button>
        </motion.div>

        {/* Info breve */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-body text-[#8B7355]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#D4A853]" />
            Salteras, Sevilla
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#D4A853]" />
            15 años de brasa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#D4A853]" />
            ~140 plazas · Terraza VIP
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   cursor-pointer text-[#8B7355] hover:text-[#D4A853] transition-colors duration-300"
        onClick={() => handleScroll('#especialidades')}
      >
        <span className="text-xs font-body tracking-widest uppercase">Descubre</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
