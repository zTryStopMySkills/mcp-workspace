'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const values = [
  { emoji: '🎨', title: 'Calidad y originalidad', desc: 'Cada animación es diferente. Nada de plantillas — cada fiesta es única.' },
  { emoji: '❤️', title: 'Diversión con valores', desc: 'Jugamos y aprendemos a la vez. Cooperación, respeto e imaginación.' },
  { emoji: '♻️', title: 'Economía circular', desc: 'Materiales sostenibles y reutilizados. Cuidamos el planeta mientras nos divertimos.' },
  { emoji: '🤝', title: 'Trabajo en equipo', desc: 'Nuestros monitores se apoyan mutuamente para que todo salga perfecto.' },
]

export default function WhatIsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="que-es"
      ref={ref}
      aria-labelledby="quees-heading"
      className="py-24 px-6 bg-[#F7FAF2]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#3D7848]/10 text-[#3D7848] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ¿Qué es DiverNature?
          </span>
          <h2
            id="quees-heading"
            className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-[#1A3020] mb-4"
          >
            Más que animación.
            <span className="text-[#3D7848]"> Más que diversión.</span>
          </h2>
          <p className="text-lg text-[#1A3020]/70 max-w-2xl mx-auto leading-relaxed">
            DiverNature es un proyecto de animación infantil y ocio educativo que transforma celebraciones
            y actividades para niños en experiencias divertidas con valores.
          </p>
        </motion.div>

        {/* Bloque principal */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 — texto con icono */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#3D7848]/10 flex flex-col"
          >
            {/* Icono decorativo en cabecera */}
            <div
              className="w-full flex items-center justify-center py-10 bg-gradient-to-br from-[#F7FAF2] to-[#E8F5E9]"
              aria-hidden="true"
            >
              <div className="relative">
                <span className="text-8xl select-none">🌿</span>
                <span className="absolute -top-2 -right-3 text-3xl animate-bounce-soft">🎨</span>
                <span className="absolute -bottom-1 -left-3 text-3xl animate-float-slow">♻️</span>
              </div>
            </div>
            <div className="p-8 flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {['Juego', 'Creatividad', 'Naturaleza'].map(tag => (
                  <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-[#3D7848]/10 text-[#3D7848]">{tag}</span>
                ))}
              </div>
              <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-3">
                No es solo entretenimiento
              </h3>
              <p className="text-[#1A3020]/70 leading-relaxed">
                Es un juego, creatividad y naturaleza para que los niños se diviertan mientras descubren
                cosas importantes como la cooperación, la imaginación, el respeto por el entorno y el cuidado del planeta.
              </p>
            </div>
          </motion.div>

          {/* Card 2 — texto con icono */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="bg-[#3D7848] rounded-3xl overflow-hidden text-white shadow-sm flex flex-col"
          >
            {/* Icono decorativo en cabecera */}
            <div
              className="w-full flex items-center justify-center py-10 bg-gradient-to-br from-[#2A5C38] to-[#4A9C5A]"
              aria-hidden="true"
            >
              <div className="relative">
                <span className="text-8xl select-none">💫</span>
                <span className="absolute -top-2 -right-3 text-3xl animate-bounce-soft">🎂</span>
                <span className="absolute -bottom-1 -left-3 text-3xl animate-float">🤝</span>
              </div>
            </div>
            <div className="p-8 flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {['Cumpleaños', 'Comuniones', 'Eventos'].map(tag => (
                  <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-white/15 text-white/90">{tag}</span>
                ))}
              </div>
              <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold mb-3">
                Recuerdos que permanecen
              </h3>
              <p className="text-white/80 leading-relaxed">
                Nuestro objetivo es que momentos como cumpleaños, comuniones, talleres o eventos escolares
                se conviertan en experiencias que no solo hagan reír a los niños, sino que dejen
                recuerdos y aprendizajes para siempre.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pull quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-center text-3xl md:text-4xl font-[family-name:var(--font-fredoka)] font-bold text-[#3D7848] mb-16"
        >
          "Que se diviertan.{' '}
          <span className="text-[#E87838]">Y que lo recuerden</span>
          {' '}toda la vida."
        </motion.blockquote>

        {/* Valores grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.45 + i * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -8, scale: 1.03, rotateZ: 1 }}
              style={{ transition: 'box-shadow 0.2s' }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#3D7848]/10 hover:shadow-md cursor-default"
            >
              <div className="text-4xl mb-3" aria-hidden="true">{v.emoji}</div>
              <h4 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#1A3020] mb-2">{v.title}</h4>
              <p className="text-sm text-[#1A3020]/60 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
