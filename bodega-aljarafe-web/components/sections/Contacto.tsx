'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, MapPin, Clock, Camera } from 'lucide-react'
import type { Config } from '@/types'

interface Props {
  config: Config
}

const dias = [
  ['Lunes', 'lunes'],
  ['Martes', 'martes'],
  ['Miércoles', 'miercoles'],
  ['Jueves', 'jueves'],
  ['Viernes', 'viernes'],
  ['Sábado', 'sabado'],
  ['Domingo', 'domingo'],
] as const

export default function Contacto({ config }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="contacto"
      className="section-brand"
      style={{ background: 'var(--color-cream)' }}
      ref={ref}
    >
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">¿Vamos a la bodega?</span>
          <h2 className="section-title mb-3">Encuéntranos</h2>
          <p className="section-subtitle mx-auto">
            Llama para reservar y te guardamos la mejor mesa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Info ── */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Teléfono */}
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(123,45,59,0.1)',
                  color: 'var(--color-primary)',
                }}
              >
                <Phone size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-dark)' }}>
                  Teléfono / Reservas
                </p>
                <a
                  href={`tel:${config.telefonoHref}`}
                  className="text-xl font-bold transition-colors hover:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-dark)' }}
                >
                  {config.telefono}
                </a>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                  Llamada directa — sin intermediarios
                </p>
              </div>
            </div>

            {/* Dirección */}
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(123,45,59,0.1)',
                  color: 'var(--color-primary)',
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-dark)' }}>
                  Dirección
                </p>
                <p className="text-base" style={{ color: 'var(--color-text)' }}>
                  {config.direccion}
                </p>
                <a
                  href={config.mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium mt-1 inline-block hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </div>

            {/* Horario */}
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(123,45,59,0.1)',
                  color: 'var(--color-primary)',
                }}
              >
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm mb-3" style={{ color: 'var(--color-dark)' }}>
                  Horario
                </p>
                <div className="space-y-1.5">
                  {dias.map(([label, key]) => (
                    <div key={key} className="flex items-center justify-between gap-8 text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>{label}</span>
                      <span className="font-medium text-right" style={{ color: 'var(--color-text)' }}>
                        {config.horario[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instagram */}
            {config.redesSociales.instagram && (
              <div className="flex items-center gap-4">
                <div
                  className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(123,45,59,0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Camera size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-dark)' }}>
                    Instagram @bodegasaljarafe
                  </p>
                  <a
                    href={config.redesSociales.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    @bodegasaljarafe
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Mapa ── */}
          <motion.div
            className="rounded-2xl overflow-hidden shadow-[var(--shadow-lg)] min-h-[350px] lg:min-h-[420px]"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <iframe
              src={config.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Bodega Aljarafe"
            />
          </motion.div>
        </div>

        {/* CTA reservar */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href={`tel:${config.telefonoHref}`} className="btn-primary text-lg px-8 py-4 gap-3">
            <Phone size={18} />
            Llamar y reservar ahora
          </a>
          <p className="text-xs mt-3" style={{ color: 'var(--color-muted)' }}>
            Respondemos siempre · Sin formularios · Confirmación inmediata
          </p>
        </motion.div>
      </div>
    </section>
  )
}
