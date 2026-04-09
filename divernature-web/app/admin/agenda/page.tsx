'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchBookings, updateBookingStatus, deleteBooking,
  getAvailableSlots, getDayLoad, hasConflict, TIME_SLOTS,
  type Booking, type BookingStatus,
} from '@/lib/bookings'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'

// ── helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay() // 0=Sun
}
function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
}
const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500 line-through',
}
const LOAD_DOT: Record<string, string> = {
  free: 'bg-[#8CC840]',
  busy: 'bg-[#F0CE55]',
  full: 'bg-[#E87838]',
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function AgendaPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string>(toISO(today.getFullYear(), today.getMonth(), today.getDate()))
  const [bookings, setBookings] = useState<Booking[]>([])
  const [view, setView] = useState<'month' | 'day'>('month')
  const [newEntry, setNewEntry] = useState({ pack_name: '', name: '', phone: '', event_time: '17:00', num_children: 15, location: '', message: '' })
  const [saving, setSaving] = useState(false)
  const [newBookingConflict, setNewBookingConflict] = useState(false)

  const load = useCallback(async () => {
    const data = await fetchBookings()
    setBookings(data)
  }, [])

  useEffect(() => { load() }, [load])

  // Real-time subscription (Supabase)
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('bookings-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => load())
      .subscribe()
    return () => { supabase!.removeChannel(channel) }
  }, [load])

  // Conflict check for new entry
  useEffect(() => {
    setNewBookingConflict(hasConflict(bookings, selectedDate, newEntry.event_time))
  }, [bookings, selectedDate, newEntry.event_time])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  // ── Derived data ───────────────────────────────────────────────────────────
  const totalDays = daysInMonth(year, month)
  const startDay = firstDayOfMonth(year, month)
  const dayBookings = bookings.filter(b => b.event_date === selectedDate)
  const availableSlots = getAvailableSlots(bookings, selectedDate)
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate())

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    thisMonth: bookings.filter(b => b.event_date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length,
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status)
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return
    await deleteBooking(id)
    await load()
  }

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newBookingConflict) return
    setSaving(true)
    const { createBooking } = await import('@/lib/bookings')
    await createBooking({
      pack_id: 'manual', pack_name: newEntry.pack_name,
      name: newEntry.name, phone: newEntry.phone,
      event_date: selectedDate, event_time: newEntry.event_time,
      num_children: newEntry.num_children,
      location: newEntry.location || undefined,
      message: newEntry.message || undefined,
    })
    setNewEntry({ pack_name: '', name: '', phone: '', event_time: '17:00', num_children: 15, location: '', message: '' })
    setSaving(false)
    await load()
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-fredoka)] text-3xl font-bold text-[#1A3020]">
            📅 Agenda de Reservas
          </h1>
          <p className="text-sm text-[#1A3020]/55 mt-1">
            {isSupabaseEnabled ? '🟢 Sincronización en tiempo real activa' : '🔴 Sin Supabase — activa el sync en .env.local'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('month')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === 'month' ? 'bg-[#3D7848] text-white' : 'bg-white border border-[#3D7848]/20 text-[#3D7848]'}`}>
            Mes
          </button>
          <button onClick={() => setView('day')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === 'day' ? 'bg-[#3D7848] text-white' : 'bg-white border border-[#3D7848]/20 text-[#3D7848]'}`}>
            Día
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total reservas', value: stats.total, color: '#3D7848' },
          { label: 'Pendientes', value: stats.pending, color: '#E87838' },
          { label: 'Confirmadas', value: stats.confirmed, color: '#8CC840' },
          { label: 'Este mes', value: stats.thisMonth, color: '#6B4FBB' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#3D7848]/10">
            <p className="text-xs font-semibold text-[#1A3020]/50 mb-1">{s.label}</p>
            <p className="font-[family-name:var(--font-fredoka)] text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Calendar ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-[#3D7848]/10 overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3D7848]/10">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full hover:bg-[#3D7848]/10 flex items-center justify-center text-[#3D7848] text-xl transition-colors">‹</button>
            <h2 className="font-[family-name:var(--font-fredoka)] text-xl font-bold text-[#1A3020]">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full hover:bg-[#3D7848]/10 flex items-center justify-center text-[#3D7848] text-xl transition-colors">›</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-4 pt-3">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs font-bold text-[#1A3020]/40 py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 px-4 pb-6">
            {/* Empty cells for start offset */}
            {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}

            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1
              const iso = toISO(year, month, day)
              const load = getDayLoad(bookings, iso)
              const isToday = iso === todayISO
              const isSelected = iso === selectedDate
              const dayCount = bookings.filter(b => b.event_date === iso && b.status !== 'cancelled').length

              return (
                <button
                  key={day}
                  onClick={() => { setSelectedDate(iso); setView('day') }}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-semibold transition-all hover:bg-[#3D7848]/10 ${
                    isSelected ? 'bg-[#3D7848] text-white shadow-md' :
                    isToday ? 'border-2 border-[#3D7848] text-[#3D7848]' :
                    'text-[#1A3020]'
                  }`}
                >
                  {day}
                  {dayCount > 0 && (
                    <span
                      className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : LOAD_DOT[load]}`}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="px-6 pb-4 flex gap-4 text-xs text-[#1A3020]/50">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8CC840] inline-block" />Libre</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F0CE55] inline-block" />Ocupado</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E87838] inline-block" />Lleno</span>
          </div>
        </div>

        {/* ── Right: Day detail ── */}
        <div className="flex flex-col gap-4">
          {/* Day header */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#3D7848]/10 p-5">
            <h3 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#1A3020] capitalize mb-1">
              {fmtDate(selectedDate)}
            </h3>
            <p className="text-xs text-[#1A3020]/50">
              {availableSlots.length > 0
                ? `${availableSlots.length} horarios disponibles: ${availableSlots.slice(0, 4).join(', ')}${availableSlots.length > 4 ? '...' : ''}`
                : 'Sin horarios disponibles'}
            </p>
          </div>

          {/* Bookings for selected day */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#3D7848]/10 p-5 flex flex-col gap-3 flex-1">
            <h4 className="font-semibold text-sm text-[#1A3020] mb-1">
              Reservas ({dayBookings.length})
            </h4>
            {dayBookings.length === 0 ? (
              <p className="text-xs text-[#1A3020]/40 py-4 text-center">Sin reservas para este día</p>
            ) : (
              dayBookings.map(b => (
                <div key={b.id} className={`rounded-2xl border p-3.5 ${b.status === 'cancelled' ? 'opacity-50 border-red-100' : 'border-[#3D7848]/15'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-sm text-[#1A3020]">{b.name}</p>
                      <p className="text-xs text-[#1A3020]/60">{b.pack_name} · {b.event_time}h · {b.num_children} niños</p>
                      {b.location && <p className="text-xs text-[#1A3020]/50">📍 {b.location}</p>}
                      {b.phone && (
                        <a href={`tel:${b.phone}`} className="text-xs text-[#3D7848] hover:underline">📞 {b.phone}</a>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${STATUS_COLORS[b.status]}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                  {b.message && <p className="text-xs text-[#1A3020]/55 bg-[#F7FAF2] rounded-lg px-3 py-2 mb-2">{b.message}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {b.status !== 'confirmed' && (
                      <button onClick={() => handleStatusChange(b.id!, 'confirmed')} className="text-xs font-semibold px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        ✓ Confirmar
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button onClick={() => handleStatusChange(b.id!, 'cancelled')} className="text-xs font-semibold px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                        ✕ Cancelar
                      </button>
                    )}
                    <button onClick={() => handleDelete(b.id!)} className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors ml-auto">
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add manual booking */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#3D7848]/10 p-5">
            <h4 className="font-semibold text-sm text-[#1A3020] mb-3">+ Añadir reserva manual</h4>
            <form onSubmit={handleAddBooking} className="flex flex-col gap-2.5">
              <input
                required placeholder="Pack / tipo de evento"
                value={newEntry.pack_name} onChange={e => setNewEntry(n => ({ ...n, pack_name: e.target.value }))}
                className="w-full border border-[#3D7848]/20 rounded-xl px-3 py-2 text-sm focus:border-[#3D7848] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required placeholder="Nombre"
                  value={newEntry.name} onChange={e => setNewEntry(n => ({ ...n, name: e.target.value }))}
                  className="border border-[#3D7848]/20 rounded-xl px-3 py-2 text-sm focus:border-[#3D7848] focus:outline-none"
                />
                <input
                  required placeholder="Teléfono"
                  value={newEntry.phone} onChange={e => setNewEntry(n => ({ ...n, phone: e.target.value }))}
                  className="border border-[#3D7848]/20 rounded-xl px-3 py-2 text-sm focus:border-[#3D7848] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newEntry.event_time} onChange={e => setNewEntry(n => ({ ...n, event_time: e.target.value }))}
                  className={`border rounded-xl px-3 py-2 text-sm focus:outline-none bg-white ${newBookingConflict ? 'border-amber-400 text-amber-700' : 'border-[#3D7848]/20 focus:border-[#3D7848]'}`}
                >
                  {TIME_SLOTS.map(t => {
                    const taken = bookings.some(b => b.event_date === selectedDate && b.event_time === t && b.status !== 'cancelled')
                    return <option key={t} value={t}>{t}h{taken ? ' ⚠️' : ''}</option>
                  })}
                </select>
                <input
                  type="number" min={1} max={200}
                  value={newEntry.num_children} onChange={e => setNewEntry(n => ({ ...n, num_children: parseInt(e.target.value) || 1 }))}
                  className="border border-[#3D7848]/20 rounded-xl px-3 py-2 text-sm focus:border-[#3D7848] focus:outline-none"
                  placeholder="Nº niños"
                />
              </div>
              {newBookingConflict && (
                <p className="text-xs text-amber-600 font-semibold -mt-1">⚠️ Conflicto de horario — elige otra hora</p>
              )}
              <input
                placeholder="Lugar (opcional)"
                value={newEntry.location} onChange={e => setNewEntry(n => ({ ...n, location: e.target.value }))}
                className="border border-[#3D7848]/20 rounded-xl px-3 py-2 text-sm focus:border-[#3D7848] focus:outline-none"
              />
              <button
                type="submit" disabled={saving || newBookingConflict}
                className="font-[family-name:var(--font-fredoka)] text-sm font-bold py-2.5 rounded-xl bg-[#3D7848] text-white hover:bg-[#2f6038] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Guardando...' : 'Añadir reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Setup hint when Supabase not configured */}
      {!isSupabaseEnabled && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h4 className="font-bold text-amber-800 mb-2">🔧 Para activar la sincronización en tiempo real:</h4>
          <p className="text-sm text-amber-700 mb-3">Crea un proyecto gratuito en <strong>supabase.com</strong> y añade estas variables a tu <code className="bg-amber-100 px-1.5 py-0.5 rounded">.env.local</code>:</p>
          <pre className="bg-amber-100 rounded-xl p-4 text-xs text-amber-900 overflow-x-auto whitespace-pre-wrap">
{`NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

-- Ejecuta en Supabase → SQL Editor:
CREATE TABLE bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id text NOT NULL,
  pack_name text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  event_date date NOT NULL,
  event_time text NOT NULL,
  num_children int NOT NULL DEFAULT 10,
  location text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select" ON bookings FOR SELECT USING (true);
CREATE POLICY "public_update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON bookings FOR DELETE USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;`}
          </pre>
        </div>
      )}
    </div>
  )
}
