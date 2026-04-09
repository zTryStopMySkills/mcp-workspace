'use client'

import { useState, useEffect, useRef } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'

type Photo = { id: string; url: string; alt: string; category: string }

const STORAGE_KEY = 'dn_galeria'

const categories = ['Todos', 'Cumpleaños', 'Talleres', 'Comuniones', 'Eventos']

export default function AdminGaleria() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filter, setFilter] = useState('Todos')
  const [saved, setSaved] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ url: '', alt: '', category: 'Cumpleaños' })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setPhotos(JSON.parse(stored))
  }, [])

  const save = (updated: Photo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setPhotos(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const url = ev.target?.result as string
        const photo: Photo = {
          id: Date.now().toString() + Math.random(),
          url,
          alt: file.name.replace(/\.[^.]+$/, ''),
          category: newPhoto.category,
        }
        setPhotos(prev => {
          const updated = [...prev, photo]
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          setSaved(true)
          setTimeout(() => setSaved(false), 2500)
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
    if (fileRef.current) fileRef.current.value = ''
  }

  const addByUrl = () => {
    if (!newPhoto.url) return
    const photo: Photo = { id: Date.now().toString(), ...newPhoto }
    save([...photos, photo])
    setNewPhoto({ url: '', alt: '', category: 'Cumpleaños' })
    setAdding(false)
  }

  const deletePhoto = (id: string) => {
    if (confirm('¿Eliminar esta foto?')) save(photos.filter(p => p.id !== id))
  }

  const filtered = filter === 'Todos' ? photos : photos.filter(p => p.category === filter)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#F7FAF2]">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-fredoka)] text-4xl font-bold text-[#1A3020]">📸 Galería de fotos</h1>
              <p className="text-[#1A3020]/60 mt-1">Sube y organiza las fotos de vuestras animaciones</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {saved && <span className="bg-[#E87838] text-white px-4 py-2 rounded-xl font-semibold text-sm" role="status">✓ Guardado</span>}
              <label className="bg-[#3D7848] text-white font-[family-name:var(--font-fredoka)] text-base font-bold px-5 py-3 rounded-2xl hover:bg-[#2f6038] transition-all cursor-pointer">
                📁 Subir fotos
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                  aria-label="Subir imágenes desde tu dispositivo"
                />
              </label>
              <button onClick={() => setAdding(true)} className="bg-[#E87838] text-white font-[family-name:var(--font-fredoka)] text-base font-bold px-5 py-3 rounded-2xl hover:bg-[#d06828] transition-all">
                🔗 Por URL
              </button>
            </div>
          </div>

          {/* Filtro de categorías */}
          <div className="flex gap-2 mb-6 flex-wrap" role="group" aria-label="Filtrar por categoría">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-[family-name:var(--font-fredoka)] px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === cat ? 'bg-[#3D7848] text-white' : 'bg-white text-[#1A3020] hover:bg-[#3D7848]/10 border border-[#3D7848]/15'
                }`}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de fotos */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#1A3020]/40">
              <div className="text-6xl mb-4" aria-hidden="true">📷</div>
              <p className="font-[family-name:var(--font-fredoka)] text-xl">No hay fotos todavía</p>
              <p className="text-sm mt-2">Sube las primeras fotos de vuestras animaciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(photo => (
                <div key={photo.id} className="relative group rounded-2xl overflow-hidden bg-white shadow-sm border border-[#3D7848]/10 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <span className="text-white text-xs font-semibold text-center bg-black/40 px-2 py-1 rounded-lg">
                      {photo.category}
                    </span>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                      aria-label={`Eliminar foto: ${photo.alt}`}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal añadir por URL */}
          {adding && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-photo-title">
              <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h2 id="add-photo-title" className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-6">Añadir foto por URL</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">URL de la imagen</label>
                    <input type="url" value={newPhoto.url} onChange={e => setNewPhoto({ ...newPhoto, url: e.target.value })} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Descripción (alt)</label>
                    <input type="text" value={newPhoto.alt} onChange={e => setNewPhoto({ ...newPhoto, alt: e.target.value })} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none" placeholder="Descripción de la foto" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3020] mb-1.5">Categoría</label>
                    <select value={newPhoto.category} onChange={e => setNewPhoto({ ...newPhoto, category: e.target.value })} className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 focus:border-[#3D7848] focus:outline-none bg-white">
                      {categories.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={addByUrl} className="flex-1 bg-[#E87838] text-white font-[family-name:var(--font-fredoka)] text-lg font-bold py-3 rounded-2xl hover:bg-[#d06828] transition-all">Añadir</button>
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
