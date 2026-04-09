'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { workshops as defaultWorkshops } from '@/lib/content'

type Workshop = {
  id: string
  emoji: string
  title: string
  description: string
  ageRange: string
  duration: string
  tags: string[]
}

const STORAGE_KEY = 'dn_talleres'

function WorkshopForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Workshop
  onSave: (w: Workshop) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [tagsStr, setTagsStr] = useState(initial.tags.join(', '))

  const handleSave = () => {
    onSave({ ...form, tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean) })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="taller-form-title"
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 id="taller-form-title" className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-6">
          {form.id === '__new__' ? 'Nuevo taller' : `Editando: ${form.title}`}
        </h2>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Emoji', key: 'emoji' as const, type: 'text' },
            { label: 'Título', key: 'title' as const, type: 'text' },
            { label: 'Rango de edad', key: 'ageRange' as const, type: 'text', placeholder: 'Ej: 4-12 años' },
            { label: 'Duración', key: 'duration' as const, type: 'text', placeholder: 'Ej: 60-90 min' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="Ej: Reciclaje, Manualidades, Valores"
              className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="flex-1 bg-[#8CC840] text-white font-[family-name:var(--font-fredoka)] text-lg font-bold py-3 rounded-2xl hover:bg-[#7ab835] transition-all">
            Guardar
          </button>
          <button onClick={onCancel} className="flex-1 bg-[#1A3020]/10 text-[#1A3020] font-semibold py-3 rounded-2xl hover:bg-[#1A3020]/20 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

const emptyWorkshop: Workshop = {
  id: '__new__',
  emoji: '🌿',
  title: '',
  description: '',
  ageRange: '',
  duration: '',
  tags: [],
}

export default function AdminTalleres() {
  const [workshops, setWorkshops] = useState<Workshop[]>(defaultWorkshops)
  const [editing, setEditing] = useState<Workshop | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setWorkshops(JSON.parse(stored))
  }, [])

  const save = (updated: Workshop[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setWorkshops(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSave = (w: Workshop) => {
    let updated: Workshop[]
    if (w.id === '__new__') {
      updated = [...workshops, { ...w, id: Date.now().toString() }]
    } else {
      updated = workshops.map(t => t.id === w.id ? w : t)
    }
    save(updated)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este taller?')) {
      save(workshops.filter(w => w.id !== id))
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#F7FAF2]">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-fredoka)] text-4xl font-bold text-[#1A3020]">
                🌱 Talleres Ambientales
              </h1>
              <p className="text-[#1A3020]/60 mt-1">Gestiona los talleres que se muestran en la web</p>
            </div>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="bg-[#8CC840] text-white px-4 py-2 rounded-xl font-semibold text-sm" role="status">✓ Guardado</span>
              )}
              <button
                onClick={() => setEditing(emptyWorkshop)}
                className="bg-[#8CC840] text-white font-[family-name:var(--font-fredoka)] text-lg font-bold px-5 py-3 rounded-2xl hover:bg-[#7ab835] transition-all"
              >
                + Nuevo taller
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {workshops.map(w => (
              <div key={w.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#8CC840]/20 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{w.emoji}</div>
                  <div className="text-right">
                    <div className="text-xs text-[#1A3020]/50">{w.duration}</div>
                    <div className="text-xs text-[#3D7848] font-semibold">{w.ageRange}</div>
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-fredoka)] text-xl font-bold text-[#1A3020] mb-2">{w.title}</h3>
                <p className="text-sm text-[#1A3020]/60 mb-3 leading-relaxed">{w.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {w.tags.map(t => (
                    <span key={t} className="text-xs bg-[#8CC840]/15 text-[#3D7848] font-semibold px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(w)} className="flex-1 bg-[#3D7848]/10 hover:bg-[#3D7848] text-[#3D7848] hover:text-white font-semibold py-2 rounded-xl transition-all text-sm">
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="flex-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-semibold py-2 rounded-xl transition-all text-sm">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editing && (
            <WorkshopForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
