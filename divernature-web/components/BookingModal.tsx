'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBooking, TIME_SLOTS, fetchBookingsByDate, hasConflict, type Booking } from '@/lib/bookings'
import { siteConfig } from '@/lib/content'

interface Pack {
  id: string
  name: string
  emoji: string
  color: string
  bg: string
}

interface Props {
  pack: Pack | null
  onClose: () => void
}

function buildWhatsAppMessage(pack: Pack, form: {
  name: string; phone: string; event_date: string; event_time: string;
  num_children: number; location: string; message: string
}) {
  const dateStr = form.event_date
    ? new Date(form.event_date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  return encodeURIComponent(
    `Hola DiverNature! 👋\n\nMe interesa el *${pack.name}* ${pack.emoji}\n\n` +
    `📅 Fecha: ${dateStr} a las ${form.event_time}h\n` +
    `👤 Nombre: ${form.name}\n` +
    `📞 Teléfono: ${form.phone}\n` +
    `👧 Niños: ${form.num_children}\n` +
    `📍 Lugar: ${form.location || 'Por determinar'}\n` +
    `💬 Notas: ${form.message || 'Ninguna'}\n\n` +
    `¡Espero vuestra respuesta! 🌿`
  )
}

export default function BookingModal({ pack, onClose }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', event_date: '', event_time: '17:00',
    num_children: 15, location: '', message: '',
  })
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [conflict, setConflict] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Fetch bookings for selected date to check conflicts
  useEffect(() => {
    if (!form.event_date) { setDayBookings([]); setConflict(false); return }
    fetchBookingsByDate(form.event_date).then(b => {
      setDayBookings(b)
      setConflict(hasConflict(b, form.event_date, form.event_time))
    })
  }, [form.event_date, form.event_time])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pack || conflict) return
    setLoading(true)

    // Save to Supabase (if enabled — silently skips if not)
    await createBooking({
      pack_id: pack.id, pack_name: pack.name,
      name: form.name, phone: form.phone,
      event_date: form.event_date, event_time: form.event_time,
      num_children: form.num_children,
      location: form.location || undefined,
      message: form.message || undefined,
    })

    setLoading(false)
    setSubmitted(true)

    // Open WhatsApp after 800ms to let the success state show
    setTimeout(() => {
      window.open(`https://wa.me/34${siteConfig.whatsapp}?text=${buildWhatsAppMessage(pack, form)}`, '_blank')
    }, 800)
  }

  if (!pack) return null

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: 'rgba(26,48,32,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div
            className="px-7 pt-7 pb-5 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, ${pack.bg} 0%, #fff 100%)` }}
          >
            <span className="text-4xl" aria-hidden="true">{pack.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#3D7848] mb-0.5">Consulta de pack</p>
              <h2 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020]">{pack.name}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-9 h-9 rounded-full bg-[#1A3020]/8 hover:bg-[#1A3020]/15 flex items-center justify-center text-[#1A3020]/60 transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="px-7 py-10 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-2">¡Consulta enviada!</h3>
              <p className="text-[#1A3020]/65 mb-6">Abriendo WhatsApp para confirmar con el equipo de DiverNature...</p>
              <button
                onClick={onClose}
                className="font-[family-name:var(--font-fredoka)] text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#3D7848] text-white hover:bg-[#2f6038] transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bm-name" className="block text-xs font-bold text-[#1A3020] mb-1.5">Nombre *</label>
                  <input
                    id="bm-name" type="text" required
                    placeholder="Tu nombre"
                    value={form.name} onChange={e => set('name', e.target.value)}
                    className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="bm-phone" className="block text-xs font-bold text-[#1A3020] mb-1.5">Teléfono *</label>
                  <input
                    id="bm-phone" type="tel" required
                    placeholder="626 98 43 52"
                    value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bm-date" className="block text-xs font-bold text-[#1A3020] mb-1.5">Fecha del evento *</label>
                  <input
                    id="bm-date" type="date" required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.event_date} onChange={e => set('event_date', e.target.value)}
                    className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="bm-time" className="block text-xs font-bold text-[#1A3020] mb-1.5">Hora *</label>
                  <select
                    id="bm-time" required
                    value={form.event_time} onChange={e => set('event_time', e.target.value)}
                    className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors bg-white"
                  >
                    {TIME_SLOTS.map(t => {
                      const taken = form.event_date && dayBookings.some(b => b.event_time === t && b.status !== 'cancelled')
                      return (
                        <option key={t} value={t}>
                          {t}h{taken ? ' · ocupado' : ''}
                        </option>
                      )
                    })}
                  </select>
                  {conflict && (
                    <p className="text-amber-600 text-xs mt-1 font-semibold">
                      ⚠️ Esta hora ya tiene una reserva. Elige otra.
                    </p>
                  )}
                </div>
              </div>

              {/* Children + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bm-children" className="block text-xs font-bold text-[#1A3020] mb-1.5">Nº de niños *</label>
                  <input
                    id="bm-children" type="number" required min={1} max={200}
                    value={form.num_children} onChange={e => set('num_children', parseInt(e.target.value) || 1)}
                    className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="bm-location" className="block text-xs font-bold text-[#1A3020] mb-1.5">Lugar (opcional)</label>
                  <input
                    id="bm-location" type="text"
                    placeholder="Dirección o local"
                    value={form.location} onChange={e => set('location', e.target.value)}
                    className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="bm-msg" className="block text-xs font-bold text-[#1A3020] mb-1.5">Mensaje adicional (opcional)</label>
                <textarea
                  id="bm-msg" rows={3}
                  placeholder="Cuéntanos algo más sobre la celebración..."
                  value={form.message} onChange={e => set('message', e.target.value)}
                  className="w-full border-2 border-[#3D7848]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Bookings count hint */}
              {form.event_date && dayBookings.length > 0 && (
                <p className="text-xs text-[#1A3020]/50 -mt-1">
                  📅 Este día ya tiene {dayBookings.filter(b => b.status !== 'cancelled').length} reserva(s).
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || conflict}
                style={{ backgroundColor: conflict ? '#9CA3AF' : pack.color }}
                className="font-[family-name:var(--font-fredoka)] text-white text-lg font-bold py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {loading ? 'Enviando...' : `Consultar por ${pack.name} → WhatsApp`}
              </button>
              <p className="text-center text-xs text-[#1A3020]/40 -mt-2">
                Te contactaremos en menos de 2 horas. Sin compromiso.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
