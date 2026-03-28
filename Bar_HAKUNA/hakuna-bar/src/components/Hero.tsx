'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { motion } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { galleryImages, businessInfo } from '@/lib/data'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background carousel */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="absolute inset-0 w-full h-full"
      >
        {galleryImages.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-screen relative">
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <p className="text-hakuna-gold tracking-[0.4em] text-sm md:text-base uppercase mb-4 font-medium">
            Mairena del Aljarafe · Sevilla
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest mb-2 leading-none">
            <span className="gold-gradient">HAKUNA</span>
            <br />
            <span className="text-white">BAR</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-white/80 text-lg md:text-2xl mt-6 mb-10 max-w-xl font-light"
        >
          {businessInfo.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={() => handleScroll('#carta')}
            className="btn-primary text-base min-w-[160px]"
          >
            Ver Carta
          </button>
          <button
            onClick={() => handleScroll('#contacto')}
            className="border-2 border-hakuna-gold text-hakuna-gold font-bold py-3 px-8 rounded-full hover:bg-hakuna-gold hover:text-hakuna-dark transition-all duration-300 hover:scale-105 text-base min-w-[160px]"
          >
            Reservar Mesa
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDownIcon className="w-7 h-7 text-hakuna-gold/70" />
        </motion.div>
      </div>
    </section>
  )
}
