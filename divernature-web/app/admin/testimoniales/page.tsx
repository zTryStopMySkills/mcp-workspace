'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { testimonials as defaultTestimonials } from '@/lib/content'

type Testimonial = { id: number; name: string; stars: number; text: string; event: string; active?: boolean }

const STORAGE_KEY = 'dn_testimoniales'

export default function AdminTestimoniales() {
  const [items, setItems] = useState<Testimonial[]>(defaultTestimonials.map(t => ({ ...t, active: true })))
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', stars: 5, text: '', event: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setItems(JSON.parse(stored))
  }, [])

  const save = (updated: Testimonial[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setItems(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleActive = (id: number) => {
    save(items.map(t => t.id === id ? { ...t, active: !t.active } : t))
  }

  const deleteItem = (id: number) => {
    if (confirm('¿Eliminar este testimonio?')) save(items.filter(t => t.id !== id))
  }

  const addItem = () => {
    if (!newItem.name || !newItem.text) return
    const item: Testimonial = { ...newItem, id: Date.now(), active: true }
    save([...items, item])
    setNewItem({ name: '', stars: 5, text: '', event: '' })
    setAdding(false)
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#F7FAF2]">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-fredoka)] text-4xl font-bold text-[#1A3020]">⭐ Testimoniales</h1>
              <p className="text-[#1A3020]/60 mt-1">Gestiona las reseñas que aparecen en la web</p>
            </div>
            <div className="flex items-center gap-3">
              {saved && <span className="bg-[#F0CE55] text-[#1A3020] px-4 py-2 rounded-xl font-semibold text-sm" role="status">✓ Guardado</span>}
              <button onClick={() => setAdding(true)} className="bg-[#F0CE55] text-[#1A3020] font-[family-name:var(--font-fredoka)] text-lg font-bold px-5 py-3 rounded-2xl hover:bg-[#e8c440] transition-all">
                + Añadir reseña
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {items.map(t => (
              <div
                key={t.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${t.active ? 'border-[#F0CE55]/40' : 'border-[#1A3020]/10 opacity-60'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-[#3D7848]/15 flex items-center justify-center font-bold text-[#3D7848]" aria-hidden="true">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-[family-name:var(--font-fredoka)] font-bold text-[#1A3020]">{t.name}</div>
                        <div className="text-xs text-[#1A3020]/50">{t.event}</div>
                      </div>
                      <div className="flex gap-0.5 ml-2" role="img" aria-label={`${t.stars} estrellas`}>
                        {Array.from({ length: t.stars }).map((_, i) => (
                          <span key={i} className="text-[#F0CE55]" aria-hidden="true">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#1A3020]/65 italic leading-relaxed">"{t.text}"</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-none">
                    <button
                      onClick={() => toggleActive(t.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${t.active ? 'bg-[#8CC840] text-white' : 'bg-[#1A3020]/10 text-[#1A3020]/50'}`}
                      aria-label={t.active ? 'Desactivar testimonio' : 'Activar testimonio'}
                    >
                      {t.active ? '✓ Visible' : '○ Oculto'}
                    </button>
                    <button
                      onClick={() => deleteItem(t.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal añadir */}
          {adding && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-testimonial-title">
              <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                <h2 id="add-testimonial-title" className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-6">
                  Nueva reseña
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Nombre</label>
                    <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none" placeholder="Nombre de la familia" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Evento</label>
                    <input type="text" value={newItem.event} onChange={e => setNewItem({ ...newItem, event: e.target.value })} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none" placeholder="Ej: Cumpleaños 6 años" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Estrellas</label>
                    <select value={newItem.stars} onChange={e => setNewItem({ ...newItem, stars: Number(e.target.value) })} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none bg-white">
                      {[5, 4, 3].map(n => <option key={n} value={n}>{n} estrellas</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Texto de la reseña</label>
                    <textarea value={newItem.text} onChange={e => setNewItem({ ...newItem, text: e.target.value })} rows={4} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none resize-none" placeholder="Escribe la reseña aquí..." />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={addItem} className="flex-1 bg-[#F0CE55] text-[#1A3020] font-[family-name:var(--font-fredoka)] text-lg font-bold py-3 rounded-2xl hover:bg-[#e8c440] transition-all">Añadir</button>
                  <button onClick={() => setAdding(false)} className="flex-1 bg-[#1A3020]/10 text-[#1A3020] font-semibold py-3 rounded-2xl hover:bg-[#1A3020]/20 transition-all">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
