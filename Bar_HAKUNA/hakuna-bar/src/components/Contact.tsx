'use client'
import { motion } from 'framer-motion'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { businessInfo } from '@/lib/data'
import ScrollAnimation from './ScrollAnimation'

export default function Contact() {
  const today = new Date()
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const todayName = dayNames[today.getDay()]

  return (
    <section id="contacto" className="section-padding bg-gradient-to-b from-hakuna-dark to-hakuna-brown/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-14">
            <p className="text-hakuna-gold tracking-[0.3em] text-sm uppercase font-medium mb-3">
              Encuéntranos
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="gold-gradient">Contacto</span> y Ubicación
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Estamos en Mairena del Aljarafe, esperándote. Ven a disfrutar de la mejor experiencia.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left: Info */}
          <div className="flex flex-col gap-6">
            {/* Contact cards */}
            <ScrollAnimation direction="right">
              <div className="glass-card p-6 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-hakuna-gold/15 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 text-hakuna-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-0.5">Dirección</p>
                    <p className="text-white/60 text-sm">{businessInfo.address}</p>
                    <a
                      href={businessInfo.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-hakuna-gold text-sm hover:underline mt-1 inline-block"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-hakuna-gold/15 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-5 h-5 text-hakuna-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-0.5">Teléfono</p>
                    <a href={`tel:${businessInfo.phone}`} className="text-white/60 text-sm hover:text-hakuna-gold transition-colors">
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-hakuna-gold/15 flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-5 h-5 text-hakuna-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-0.5">Email</p>
                    <a href={`mailto:${businessInfo.email}`} className="text-white/60 text-sm hover:text-hakuna-gold transition-colors">
                      {businessInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Schedule */}
            <ScrollAnimation direction="right" delay={0.1}>
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <ClockIcon className="w-5 h-5 text-hakuna-gold" />
                  <h3 className="text-white font-semibold">Horario</h3>
                </div>
                <ul className="space-y-2">
                  {businessInfo.schedule.map((item) => {
                    const isToday = item.day === todayName
                    const isClosed = item.hours === 'Cerrado'
                    return (
                      <li
                        key={item.day}
                        className={`flex justify-between py-2 px-3 rounded-lg ${
                          isToday ? 'bg-hakuna-gold/10 border border-hakuna-gold/25' : ''
                        }`}
                      >
                        <span className={`text-sm ${isToday ? 'text-hakuna-gold font-semibold' : 'text-white/70'}`}>
                          {item.day}
                          {isToday && <span className="ml-2 text-xs bg-hakuna-gold text-hakuna-dark px-1.5 py-0.5 rounded-full font-bold">Hoy</span>}
                        </span>
                        <span className={`text-sm font-medium ${isClosed ? 'text-red-400' : isToday ? 'text-hakuna-gold' : 'text-white/55'}`}>
                          {item.hours}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </ScrollAnimation>

            {/* Social links */}
            <ScrollAnimation direction="right" delay={0.2}>
              <div className="glass-card p-6">
                <h3 className="text-white font-semibold mb-4">Síguenos</h3>
                <div className="flex gap-4">
                  {/* Instagram */}
                  <a
                    href={businessInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 flex-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 rounded-xl px-4 py-3 hover:border-pink-500/40 transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 text-pink-400 group-hover:text-pink-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <div>
                      <p className="text-white text-sm font-medium">Instagram</p>
                      <p className="text-white/40 text-xs">@hakuna_mairena</p>
                    </div>
                  </a>

                  {/* Facebook */}
                  <a
                    href={businessInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 flex-1 bg-blue-600/10 border border-white/10 rounded-xl px-4 py-3 hover:border-blue-500/40 transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <div>
                      <p className="text-white text-sm font-medium">Facebook</p>
                      <p className="text-white/40 text-xs">HakunaBarr</p>
                    </div>
                  </a>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right: Google Maps embed */}
          <ScrollAnimation direction="left" delay={0.1}>
            <div className="glass-card overflow-hidden h-full min-h-[500px]">
              <div className="relative h-full min-h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.0!2d-6.0626!3d37.3311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7395d6a044e65435!2sHakuna%20Bar!5e0!3m2!1ses!2ses!4v1699000000000!5m2!1ses!2ses"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Ubicación de Hakuna Bar en Google Maps"
                />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Hakuna Bar</p>
                  <p className="text-white/50 text-sm">Mairena del Aljarafe, Sevilla</p>
                </div>
                <a
                  href={businessInfo.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm py-2 px-5"
                >
                  Cómo llegar
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
