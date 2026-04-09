'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { siteConfig } from '@/lib/content'

export default function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState({ name: '', phone: '', event: '', message: '' })
  const [sent, setSent] = useState(false)

  const waHref = `https://wa.me/34${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Hola DiverNature 👋\n\nMe llamo ${form.name}.\nTeléfono: ${form.phone}\nEvento: ${form.event}\n\n${form.message}`
    const url = `https://wa.me/34${siteConfig.whatsapp}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section
      id="contacto"
      ref={ref}
      aria-labelledby="contacto-heading"
      className="py-24 px-6 bg-[#F7FAF2]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#E87838]/10 text-[#E87838] font-[family-name:var(--font-fredoka)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ¡Hablemos!
          </span>
          <h2
            id="contacto-heading"
            className="font-[family-name:var(--font-fredoka)] text-4xl md:text-5xl font-bold text-[#1A3020] mb-4"
          >
            ¿Lista la
            <span className="text-[#E87838]"> aventura</span>?
          </h2>
          <p className="text-lg text-[#1A3020]/65 max-w-xl mx-auto leading-relaxed">
            Cuéntanos qué celebráis y te preparamos algo único.
            Respondemos siempre por WhatsApp.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* WhatsApp directo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#3D7848] rounded-3xl p-8 text-white flex flex-col gap-6"
          >
            <div className="text-5xl" aria-hidden="true">💬</div>
            <div>
              <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold mb-2">
                Escríbenos ahora
              </h3>
              <p className="text-white/75 leading-relaxed">
                La forma más rápida de poneros en marcha. Cuéntanos tu evento y
                te contamos todo lo que podemos hacer por ti.
              </p>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-[family-name:var(--font-fredoka)] text-xl font-bold px-6 py-4 rounded-2xl hover:bg-[#20b85a] transition-all hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Contactar por WhatsApp"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              615 538 380
            </a>

            {/* Info adicional */}
            <div className="flex flex-col gap-3 text-white/65 text-sm">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">📍</span> Sevilla, Andalucía
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden="true">📱</span>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @divernature
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden="true">⏰</span> Respondemos siempre
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-[#3D7848]/10"
          >
            <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-6">
              O escríbenos aquí
            </h3>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-[#1A3020] mb-1.5">
                  Tu nombre <span aria-hidden="true" className="text-[#E87838]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: María García"
                  className="w-full border-2 border-[#3D7848]/15 rounded-xl px-4 py-3 text-[#1A3020] placeholder-[#1A3020]/30 focus:border-[#3D7848] focus:outline-none transition-colors text-base"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-sm font-semibold text-[#1A3020] mb-1.5">
                  Teléfono
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="Ej: 626 98 43 52"
                  className="w-full border-2 border-[#3D7848]/15 rounded-xl px-4 py-3 text-[#1A3020] placeholder-[#1A3020]/30 focus:border-[#3D7848] focus:outline-none transition-colors text-base"
                />
              </div>

              <div>
                <label htmlFor="contact-event" className="block text-sm font-semibold text-[#1A3020] mb-1.5">
                  ¿Qué celebráis?
                </label>
                <select
                  id="contact-event"
                  value={form.event}
                  onChange={e => setForm({ ...form, event: e.target.value })}
                  className="w-full border-2 border-[#3D7848]/15 rounded-xl px-4 py-3 text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors bg-white text-base"
                >
                  <option value="">Selecciona un evento</option>
                  <option>Cumpleaños</option>
                  <option>Comunión</option>
                  <option>Bautizo</option>
                  <option>Evento escolar</option>
                  <option>Evento de empresa</option>
                  <option>Taller ambiental</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-[#1A3020] mb-1.5">
                  ¿En qué podemos ayudarte?
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder="Cuéntanos: número de niños, fecha aproximada, lugar..."
                  className="w-full border-2 border-[#3D7848]/15 rounded-xl px-4 py-3 text-[#1A3020] placeholder-[#1A3020]/30 focus:border-[#3D7848] focus:outline-none transition-colors resize-none text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full font-[family-name:var(--font-fredoka)] bg-[#E87838] hover:bg-[#d06828] text-white text-xl font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                aria-live="polite"
              >
                {sent ? '¡Enviado! 🎉' : 'Enviar por WhatsApp →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
