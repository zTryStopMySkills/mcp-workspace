'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { testimonials } from '@/lib/content'

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#F0CE55] text-lg" aria-hidden="true">★</span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="testimoniales"
      ref={ref}
      aria-labelledby="testimoniales-heading"
      className="py-24 px-6 bg-[#3D7848] relative overflow-hidden"
    >
      {/* Decoración */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-64 h-64 bg-[#4A8C56]/40 rounded-full blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-96 h-96 bg-[#2A5C38]/40 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#F0CE55]/20 text-[#F0CE55] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Lo que dicen las familias
          </span>
          <h2
            id="testimoniales-heading"
            className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Que lo cuenten
            <span className="text-[#F0CE55]"> ellos</span>
          </h2>
          <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
            Las mejores palabras son las de las familias que ya vivieron la aventura con nosotros.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all"
            >
              <div className="mb-4">
                <Stars count={t.stars} />
              </div>
              <blockquote className="text-[#1A3020]/75 leading-relaxed text-[15px] mb-5 italic">
                "{t.text}"
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3D7848]/15 flex items-center justify-center font-[family-name:var(--font-fredoka)] font-bold text-[#3D7848] text-lg" aria-hidden="true">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-fredoka)] font-bold text-[#1A3020] text-[15px]">{t.name}</div>
                  <div className="text-xs text-[#1A3020]/50">{t.event}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Google CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-white/60 text-sm mb-2">¿Ya fuiste con nosotros?</p>
          <a
            href="https://www.google.com/search?q=DiverNature+Sevilla"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-fredoka)] text-[#F0CE55] hover:text-white underline underline-offset-4 transition-colors font-semibold"
          >
            Déjanos tu reseña en Google ⭐
          </a>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true" className="overflow-hidden leading-none mt-16">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0 0L48 10.7C96 21.3 192 42.7 288 48C384 53.3 480 42.7 576 37.3C672 32 768 32 864 37.3C960 42.7 1056 53.3 1152 56C1248 58.7 1344 53.3 1392 50.7L1440 48V80H0Z" fill="#F7FAF2"/>
        </svg>
      </div>
    </section>
  )
}
