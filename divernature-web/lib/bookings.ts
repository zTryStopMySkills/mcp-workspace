import { supabase } from './supabase'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
  id?: string
  pack_id: string
  pack_name: string
  name: string
  phone: string
  event_date: string   // YYYY-MM-DD
  event_time: string   // HH:MM
  num_children: number
  location?: string
  message?: string
  status: BookingStatus
  created_at?: string
}

export const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00',
  '16:00', '17:00', '18:00', '19:00', '20:00',
]

// ── Create ──────────────────────────────────────────────────────────────────

export async function createBooking(data: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: null } // no Supabase → silently skip DB save

  const { error } = await supabase.from('bookings').insert([{ ...data, status: 'pending' }])
  return { error: error?.message ?? null }
}

// ── Read ─────────────────────────────────────────────────────────────────────

export async function fetchBookings(): Promise<Booking[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .order('event_date', { ascending: true })
  return (data as Booking[]) ?? []
}

export async function fetchBookingsByDate(date: string): Promise<Booking[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_date', date)
    .order('event_time', { ascending: true })
  return (data as Booking[]) ?? []
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  if (!supabase) return
  await supabase.from('bookings').update({ status }).eq('id', id)
}

export async function deleteBooking(id: string): Promise<void> {
  if (!supabase) return
  await supabase.from('bookings').delete().eq('id', id)
}

// ── Conflict detection ───────────────────────────────────────────────────────

export function hasConflict(bookings: Booking[], date: string, time: string, excludeId?: string): boolean {
  return bookings.some(
    b => b.event_date === date && b.event_time === time && b.status !== 'cancelled' && b.id !== excludeId,
  )
}

// ── Smart suggestions ────────────────────────────────────────────────────────

export function getAvailableSlots(bookings: Booking[], date: string): string[] {
  const occupied = bookings
    .filter(b => b.event_date === date && b.status !== 'cancelled')
    .map(b => b.event_time)
  return TIME_SLOTS.filter(t => !occupied.includes(t))
}

export function getDayLoad(bookings: Booking[], date: string): 'free' | 'busy' | 'full' {
  const count = bookings.filter(b => b.event_date === date && b.status !== 'cancelled').length
  if (count === 0) return 'free'
  if (count >= TIME_SLOTS.length) return 'full'
  if (count >= 4) return 'busy'
  return 'free'
}
