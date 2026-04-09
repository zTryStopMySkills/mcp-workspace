'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { team } from '@/lib/content'

const bgColors = ['#3D7848', '#E87838', '#8CC840', '#F0CE55']
const textColors = ['#FFFFFF', '#FFFFFF', '#1A3020', '#1A3020']

export default function TeamSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="equipo"
      ref={ref}
      aria-labelledby="equipo-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#F0CE55]/30 text-[#B8930F] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            El corazón de DiverNature
          </span>
          <h2
            id="equipo-heading"
            className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-[#1A3020] mb-4"
          >
            Algunos de nuestros
            <span className="text-[#3D7848]"> monitores</span>
          </h2>
          <p className="text-lg text-[#1A3020]/65 max-w-xl mx-auto leading-relaxed">
            Monitores con vocación. Entrenados para que cada niño viva su momento. Sin mirar el reloj.
          </p>
        </motion.div>

        {/* Foto grupal real — imagen de los monitores */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-10 rounded-3xl overflow-hidden shadow-lg border border-[#3D7848]/10 relative"
        >
          <div className="relative w-full h-72 md:h-96">
            <Image
              src="/images/monitores.png"
              alt="El equipo de DiverNature: Samuel (fundador), Irene, Paula y Adrián — monitores de animación infantil en Sevilla"
              fill
              className="object-cover object-top"
            />
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A3020]/70 via-[#1A3020]/10 to-transparent" />
            {/* Label superpuesto */}
            <div className="absolute bottom-5 left-6 right-6">
              <p className="font-[family-name:var(--font-fredoka)] text-white text-2xl font-bold mb-1">
                Samuel · Irene · Paula · Adrián
              </p>
              <p className="text-white/70 text-sm">Nuestros monitores en DiverNature, Sevilla</p>
            </div>
          </div>
        </motion.div>

        {/* Cards individuales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 40, scale: 0.93 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, type: 'spring', stiffness: 220, damping: 18 }}
              whileHover={{ y: -8, rotateZ: i % 2 === 0 ? 2 : -2 }}
              className="rounded-3xl p-7 text-center shadow-sm hover:shadow-lg transition-all"
              style={{ backgroundColor: bgColors[i], color: textColors[i] }}
            >
              <div
                className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                aria-hidden="true"
              >
                {member.emoji}
              </div>
              <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-semibold mb-3" style={{ opacity: 0.75 }}>
                {member.role}
              </p>
              <p className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>
                {member.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Samuel founder callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-10 bg-[#F7FAF2] border border-[#3D7848]/15 rounded-3xl p-8 md:flex gap-8 items-center"
        >
          <div className="text-6xl mb-4 md:mb-0 flex-none text-center" aria-hidden="true">🌍</div>
          <div>
            <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-2">
              Samuel, fundador de DiverNature
            </h3>
            <p className="text-[#1A3020]/65 leading-relaxed">
              Samuel no abrió una empresa de animación. Creó un proyecto con alma de educador y corazón
              de animador. Lo que empezó como una pasión por hacer que los niños disfruten mientras
              aprenden se convirtió en DiverNature — una familia de monitores comprometidos con cada celebración.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
