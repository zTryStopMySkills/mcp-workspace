'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, MessageCircle, Clock, MapPin, ChevronDown } from 'lucide-react'

interface HorarioDia {
  abierto: boolean
  turnos: string[]
}

interface ReservaProps {
  telefono: string
  whatsapp: string
  horario: Record<string, HorarioDia>
}

const DIAS_LABELS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export default function Reserva({ telefono, whatsapp, horario }: ReservaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: '2',
    nota: '',
  })
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hola Rincón! Quería reservar una mesa para ${form.personas} personas el ${form.fecha} a las ${form.hora}. Mi nombre es ${form.nombre}${form.nota ? `. Nota: ${form.nota}` : ''}. ¿Tenéis disponibilidad?`
    )
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  const inputClass =
    'w-full bg-[#1A1008]/80 border border-[#D4A853]/20 text-[#F5EFE6] font-body text-base rounded-sm px-4 py-3 ' +
    'placeholder-[#8B7355]/60 outline-none transition-all duration-200 ' +
    'focus:border-[#D4A853]/60 focus:ring-2 focus:ring-[#D4A853]/10 focus:bg-[#2D1F0D]/60'

  return (
    <section id="reserva" className="py-24 sm:py-32 bg-[#1A1008] relative overflow-hidden">
      {/* Fondo glow sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      bg-[#8B1A1A]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-xs font-body font-semibold tracking-widest uppercase text-[#D4A853] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
            Reservas y contacto
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl text-[#F5EFE6] mb-4"
          >
            ¿Te guardamos tu mesa?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-[#8B7355] text-lg max-w-xl mx-auto"
          >
            Escríbenos o llámanos. Respondemos siempre, normalmente antes de que termines el café.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: 'center' }}
            className="h-[1px] w-16 mx-auto mt-5 bg-gradient-to-r from-transparent via-[#D4A853] to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Formulario — 3/5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="¿Cómo te llamas?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Para confirmarte"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                    Fecha
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="fecha"
                      required
                      value={form.fecha}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={inputClass + ' [color-scheme:dark]'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                    Hora
                  </label>
                  <input
                    type="time"
                    name="hora"
                    required
                    value={form.hora}
                    onChange={handleChange}
                    className={inputClass + ' [color-scheme:dark]'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                    Personas
                  </label>
                  <div className="relative">
                    <select
                      name="personas"
                      value={form.personas}
                      onChange={handleChange}
                      className={inputClass + ' appearance-none cursor-pointer'}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                        <option key={n} value={n} className="bg-[#2D1F0D]">
                          {n} {n === 1 ? 'persona' : 'personas'}
                        </option>
                      ))}
                      <option value="mas" className="bg-[#2D1F0D]">Más de 20</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A853]/60 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                  Algo más que quieras contarnos
                </label>
                <textarea
                  name="nota"
                  value={form.nota}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Alergias, celebraciones, preferencias de mesa..."
                  className={inputClass + ' resize-none'}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-[#8B1A1A] text-[#F5EFE6] font-body font-bold text-base
                             rounded-sm transition-all duration-300
                             hover:bg-[#A52020] hover:shadow-[0_8px_32px_rgba(139,26,26,0.5)] hover:-translate-y-1
                             active:translate-y-0 disabled:opacity-50"
                  disabled={sent}
                >
                  {sent ? '¡Reserva enviada por WhatsApp!' : 'Confirmar reserva'}
                </button>
                <p className="mt-3 text-xs font-body text-[#8B7355]">
                  Se abrirá WhatsApp con tu solicitud prellenada. Confirmamos en minutos.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Info lateral — 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contacto directo */}
            <div className="p-6 rounded-sm border border-[#D4A853]/20 bg-[#2D1F0D]/60">
              <h3 className="font-display font-bold text-lg text-[#F5EFE6] mb-4">Contacto directo</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${telefono.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-[#8B7355] hover:text-[#F5EFE6] transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#D4A853]/20 bg-[#1A1008]/50
                                  group-hover:border-[#D4A853]/50 transition-colors duration-200">
                    <Phone size={14} className="text-[#D4A853]" />
                  </div>
                  <span className="font-body text-sm">{telefono}</span>
                </a>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola Rincón! Quería reservar una mesa. ¿Tenéis disponibilidad?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#8B7355] hover:text-[#F5EFE6] transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#D4A853]/20 bg-[#1A1008]/50
                                  group-hover:border-[#D4A853]/50 transition-colors duration-200">
                    <MessageCircle size={14} className="text-[#D4A853]" />
                  </div>
                  <span className="font-body text-sm">WhatsApp — Reservas</span>
                </a>
                <div className="flex items-start gap-3 text-[#8B7355]">
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#D4A853]/20 bg-[#1A1008]/50 shrink-0">
                    <MapPin size={14} className="text-[#D4A853]" />
                  </div>
                  <span className="font-body text-sm">C/ Juan Ramón Jiménez, 29<br />41909 Salteras, Sevilla</span>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="p-6 rounded-sm border border-[#D4A853]/20 bg-[#2D1F0D]/60">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-[#D4A853]" />
                <h3 className="font-display font-bold text-lg text-[#F5EFE6]">Horario</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(horario).map(([dia, info]) => (
                  <div key={dia} className="flex items-start justify-between text-sm font-body">
                    <span className={`${info.abierto ? 'text-[#8B7355]' : 'text-[#8B7355]/40'} w-24 shrink-0`}>
                      {DIAS_LABELS[dia]}
                    </span>
                    {info.abierto ? (
                      <span className="text-[#F5EFE6]/80 text-right">
                        {info.turnos.join(' · ')}
                      </span>
                    ) : (
                      <span className="text-[#8B1A1A]/60 italic text-right">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-sm overflow-hidden border border-[#D4A853]/15 h-40">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.8923!2d-6.0905!3d37.4082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126f89!2sC%2F+Juan+Ram%C3%B3n+Jim%C3%A9nez%2C+29%2C+41909+Salteras!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="El Rincón de Salteras en Google Maps"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
