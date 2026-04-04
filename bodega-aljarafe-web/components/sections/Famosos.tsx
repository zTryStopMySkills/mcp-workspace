'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Fotos de famosos/influencers que han visitado el local
const VISITAS = [
  { src: '/gallery/famosos-4.jpg', nombre: 'Visita especial', tag: 'Influencer' },
  { src: '/gallery/famosos-1.jpg', nombre: 'Cristian Venturas', tag: 'Influencer' },
  { src: '/gallery/famosos-2.jpg', nombre: 'Visita VIP', tag: 'Famoso' },
  { src: '/gallery/famosos-3.jpg', nombre: 'Celebración', tag: 'Famoso' },
  { src: '/gallery/famosos-5.jpg', nombre: 'Invitado especial', tag: 'VIP' },
  { src: '/gallery/famosos-6.jpg', nombre: 'Visita notable', tag: 'VIP' },
  { src: '/gallery/famosos-7.jpg', nombre: 'Evento exclusivo', tag: 'Evento' },
]

export default function Famosos() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      className="section-brand overflow-hidden"
      style={{ background: 'var(--color-dark)' }}
      ref={ref}
    >
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>
            Nos han visitado
          </span>
          <h2 className="section-title" style={{ color: 'var(--color-cream)' }}>
            Caras conocidas
            <br />
            <em className="not-italic" style={{ color: 'var(--color-accent)' }}>en nuestra mesa.</em>
          </h2>
          <p className="mt-3 text-base max-w-xl" style={{ color: 'rgba(245,237,216,0.55)' }}>
            La Bodega Aljarafe ha recibido a influencers, figuras del deporte
            y la televisión que han querido vivir la experiencia de nuestra brasa.
          </p>
        </motion.div>

        {/* Layout: vídeo Venturas grande + grid fotos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Vídeo Venturas — protagonista */}
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            style={{ background: 'rgba(245,237,216,0.05)', border: '1px solid rgba(184,149,106,0.2)' }}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <video
              src="/videos/venturas.mp4"
              controls
              playsInline
              poster="/videos/venturas.jpg"
              className="w-full rounded-2xl"
              style={{ maxHeight: '480px', objectFit: 'cover' }}
            />
            <div className="p-4">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full mr-2"
                style={{ background: 'rgba(184,149,106,0.15)', color: 'var(--color-accent)' }}
              >
                Cristian Venturas
              </span>
              <span className="text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}>
                Influencer / @venturasscristian
              </span>
            </div>
          </motion.div>

          {/* Grid de fotos visitas */}
          <div className="grid grid-cols-2 gap-3">
            {VISITAS.map((v, i) => (
              <motion.div
                key={v.src + i}
                className="relative overflow-hidden rounded-xl group"
                style={{
                  aspectRatio: '1/1',
                  background: 'rgba(245,237,216,0.05)',
                  border: '1px solid rgba(184,149,106,0.1)',
                }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={v.src}
                  alt={v.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3"
                  style={{ background: 'linear-gradient(to top, rgba(26,15,16,0.75) 0%, transparent 60%)' }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'rgba(245,237,216,0.9)' }}
                  >
                    {v.nombre}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
