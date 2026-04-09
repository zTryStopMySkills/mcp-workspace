'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { packs as defaultPacks } from '@/lib/content'

type Pack = typeof defaultPacks[0]

const STORAGE_KEY = 'dn_packs'

export default function AdminPacks() {
  const [packs, setPacks] = useState<Pack[]>(defaultPacks)
  const [editing, setEditing] = useState<Pack | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setPacks(JSON.parse(stored))
  }, [])

  const save = (updated: Pack[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setPacks(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleEdit = (pack: Pack) => setEditing({ ...pack })

  const handleSave = () => {
    if (!editing) return
    const updated = packs.map(p => p.id === editing.id ? editing : p)
    save(updated)
    setEditing(null)
  }

  const handleChange = (field: keyof Pack, value: string) => {
    if (!editing) return
    setEditing({ ...editing, [field]: value })
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#F7FAF2]">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-[family-name:var(--font-fredoka)] text-4xl font-bold text-[#1A3020]">
                🎮 Gestionar Packs
              </h1>
              <p className="text-[#1A3020]/60 mt-1">Edita los packs de animación que se muestran en la web</p>
            </div>
            {saved && (
              <span className="bg-[#8CC840] text-white px-4 py-2 rounded-xl font-semibold text-sm" role="status">
                ✓ Guardado
              </span>
            )}
          </div>

          {/* Grid de packs */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {packs.map(pack => (
              <div
                key={pack.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#3D7848]/10 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl" aria-hidden="true">{pack.emoji}</div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: pack.color }}
                  >
                    {pack.tag}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-fredoka)] text-xl font-bold text-[#1A3020] mb-2">
                  {pack.name}
                </h3>
                <p className="text-sm text-[#1A3020]/60 leading-relaxed mb-4">{pack.description}</p>
                <button
                  onClick={() => handleEdit(pack)}
                  className="w-full bg-[#3D7848]/10 hover:bg-[#3D7848] text-[#3D7848] hover:text-white font-semibold py-2 rounded-xl transition-all text-sm"
                >
                  ✏️ Editar
                </button>
              </div>
            ))}
          </div>

          {/* Modal de edición */}
          {editing && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-pack-title"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 id="edit-pack-title" className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-6">
                  Editando: {editing.name}
                </h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Emoji</label>
                    <input
                      type="text"
                      value={editing.emoji}
                      onChange={e => handleChange('emoji', e.target.value)}
                      className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 text-2xl focus:border-[#3D7848] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Nombre del pack</label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={e => handleChange('name', e.target.value)}
                      className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Descripción</label>
                    <textarea
                      value={editing.description}
                      onChange={e => handleChange('description', e.target.value)}
                      rows={3}
                      className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Etiqueta</label>
                    <input
                      type="text"
                      value={editing.tag}
                      onChange={e => handleChange('tag', e.target.value)}
                      className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Color del pack (hex)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={editing.color}
                        onChange={e => handleChange('color', e.target.value)}
                        className="w-12 h-12 rounded-lg border-2 border-[#3D7848]/20 cursor-pointer"
                        aria-label="Selector de color"
                      />
                      <input
                        type="text"
                        value={editing.color}
                        onChange={e => handleChange('color', e.target.value)}
                        className="flex-1 border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#3D7848] text-white font-[family-name:var(--font-fredoka)] text-lg font-bold py-3 rounded-2xl hover:bg-[#2f6038] transition-all"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex-1 bg-[#1A3020]/10 text-[#1A3020] font-semibold py-3 rounded-2xl hover:bg-[#1A3020]/20 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
