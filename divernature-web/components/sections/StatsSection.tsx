'use client'

import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function Counter({ to, duration = 1800 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / (duration / 16)
    const id = setInterval(() => {
      start = Math.min(start + step, to)
      setVal(Math.floor(start))
      if (start >= to) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [inView, to, duration])

  return <span ref={ref}>{val}</span>
}

const stats = [
  { emoji: '🎂', prefix: '', value: 500, suffix: '+', label: 'Fiestas realizadas' },
  { emoji: '⭐', prefix: '', value: 5,   suffix: '.0', label: 'Valoración Google' },
  { emoji: '🎮', prefix: '', value: 8,   suffix: '',   label: 'Packs temáticos' },
  { emoji: '🌍', prefix: '', value: 4,   suffix: '',   label: 'Monitores expertos' },
]

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="py-16 px-6 bg-[#1A3020]"
      aria-label="Nuestros números"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, type: 'spring', stiffness: 200 }}
            className="text-center"
          >
            <div className="text-4xl mb-3" aria-hidden="true">{s.emoji}</div>
            <div className="font-[family-name:var(--font-fredoka)] text-5xl md:text-6xl font-bold text-[#F0CE55]">
              {s.prefix}<Counter to={s.value} />{s.suffix}
            </div>
            <div className="text-white/55 text-sm mt-2 font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
