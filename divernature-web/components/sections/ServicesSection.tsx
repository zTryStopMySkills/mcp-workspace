'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { services } from '@/lib/content'

const colors = ['#3D7848', '#E87838', '#8CC840', '#F0CE55']

export default function ServicesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="servicios"
      ref={ref}
      aria-labelledby="servicios-heading"
      className="py-24 px-6 bg-[#F7FAF2]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#E87838]/10 text-[#E87838] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Para cada momento especial
          </span>
          <h2
            id="servicios-heading"
            className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-[#1A3020]"
          >
            Nuestras animaciones
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <motion.article
              key={svc.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[#3D7848]/10 hover:shadow-md transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                style={{ backgroundColor: colors[i] + '18' }}
                aria-hidden="true"
              >
                {svc.icon}
              </div>
              <h3
                className="font-[family-name:var(--font-fredoka)] text-2xl font-bold mb-3"
                style={{ color: colors[i] }}
              >
                {svc.title}
              </h3>
              <p className="text-[#1A3020]/65 leading-relaxed">{svc.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
