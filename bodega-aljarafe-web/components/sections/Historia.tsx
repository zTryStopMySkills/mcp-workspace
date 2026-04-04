'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Flame, Users, Award } from 'lucide-react'

const pillars = [
  {
    icon: Flame,
    titulo: 'Fuego de encina',
    texto: 'La misma brasa que usaba el abuelo. Encina y olivo — el aromático que marca la diferencia.',
  },
  {
    icon: Users,
    titulo: '4 generaciones',
    texto: 'Desde los años 70 en Castilleja. Una familia que ha convertido la brasa en legado.',
  },
  {
    icon: Award,
    titulo: 'Selección extrema',
    texto: 'Solo las mejores piezas: T-Bone, Rubia Gallega y Lomo de Buey con más de 120 días de maduración.',
  },
]

export default function Historia() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="historia"
      className="section-brand overflow-hidden"
      style={{ background: 'var(--color-cream)' }}
      ref={ref}
    >
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Columna izquierda — VÍDEO ───────────────────────── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Contenedor vídeo con proporción 4:5 */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4/5',
                background: 'var(--color-dark)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/historia-dueno.mp4"
                muted
                loop
                playsInline
                autoPlay
                poster="/gallery/historia-poster.jpg"
              />
              {/* Overlay gradiente inferior */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(26,15,16,0.55) 0%, transparent 55%)',
                }}
              />
              {/* Texto sobre el vídeo */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p
                  className="font-display italic text-base leading-snug"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'rgba(245,237,216,0.95)',
                  }}
                >
                  &ldquo;No elegí este trabajo. Nací en él.&rdquo;
                </p>
              </div>
            </div>

            {/* Badge flotante de rating */}
            <div
              className="absolute -bottom-4 -right-4 lg:-right-6 px-5 py-4 rounded-xl shadow-lg"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-cream)',
              }}
            >
              <p
                className="font-display text-3xl font-bold leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                9/10
              </p>
              <p className="text-xs opacity-80 mt-1">Google Maps</p>
              <p className="text-xs opacity-60">+1.100 reseñas</p>
            </div>

            {/* Ornamental circle */}
            <div
              className="absolute -top-5 -left-5 w-24 h-24 rounded-full opacity-[0.07] pointer-events-none"
              style={{ background: 'var(--color-accent)' }}
            />
          </motion.div>

          {/* ── Columna derecha — TEXTO ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Nuestra historia</span>

            <h2 className="section-title mb-6">
              Una bodega de barrio
              <br />
              que se convirtió en{' '}
              <em className="not-italic" style={{ color: 'var(--color-primary)' }}>
                referencia.
              </em>
            </h2>

            <p
              className="text-base md:text-[1.05rem] leading-relaxed mb-5"
              style={{ color: 'var(--color-muted)' }}
            >
              Nació como bodega de barrio en Castilleja de la Cuesta, en los
              años 70, cuando el abuelo encendió la primera brasa de encina.
              Lo que empezó como un lugar para el vino y el tapeo se convirtió,
              generación a generación, en referencia de la carne en el Aljarafe.
            </p>

            <p
              className="text-base md:text-[1.05rem] leading-relaxed mb-8"
              style={{ color: 'var(--color-muted)' }}
            >
              Hoy seguimos eligiendo las mismas maderas, los mismos proveedores
              de confianza y el mismo criterio: solo la pieza que merece estar
              en tu mesa llega a la brasa.
            </p>

            {/* Pull quote */}
            <blockquote
              className="border-l-4 pl-5 mb-10"
              style={{ borderColor: 'var(--color-primary)' }}
            >
              <p
                className="font-display italic text-xl leading-snug"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-dark)',
                }}
              >
                &ldquo;Cuatro generaciones de hosteleros que se nota
                en cada detalle.&rdquo;
              </p>
            </blockquote>

            {/* Pilares */}
            <div className="flex flex-col gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.titulo}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.45,
                    delay: 0.3 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5"
                    style={{
                      background: 'rgba(123,45,59,0.1)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <p.icon size={18} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm mb-0.5"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      {p.titulo}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {p.texto}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
