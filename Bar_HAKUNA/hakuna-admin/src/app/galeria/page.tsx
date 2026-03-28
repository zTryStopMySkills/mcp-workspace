'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DeleteModal from '@/components/DeleteModal'
import { useStore } from '@/lib/store'
import type { GalleryImage } from '@/lib/types'
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PhotoIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function GaleriaPage() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useStore()

  const sorted = [...galleryImages].sort((a, b) => a.order - b.order)

  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [toast, setToast] = useState('')

  // Add form state
  const [addMode, setAddMode] = useState<'url' | 'file'>('url')
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')
  const [newSrc, setNewSrc] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = evt => {
      setNewSrc(evt.target?.result as string)
      if (!newAlt) setNewAlt(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  function handleAdd() {
    const src = addMode === 'url' ? newUrl.trim() : newSrc
    if (!src) return
    const maxOrder = galleryImages.length > 0 ? Math.max(...galleryImages.map(i => i.order)) : 0
    addGalleryImage({
      id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      src,
      alt: newAlt.trim() || 'Imagen de galería',
      order: maxOrder + 1,
      active: true,
    })
    setNewUrl('')
    setNewAlt('')
    setNewSrc('')
    setAddOpen(false)
    if (fileRef.current) fileRef.current.value = ''
    showToast('Imagen añadida correctamente')
  }

  function toggleActive(img: GalleryImage) {
    updateGalleryImage({ ...img, active: !img.active })
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id)
    setEditAlt(img.alt)
  }

  function saveEdit(img: GalleryImage) {
    updateGalleryImage({ ...img, alt: editAlt.trim() || img.alt })
    setEditingId(null)
    showToast('Texto alternativo actualizado')
  }

  function moveUp(img: GalleryImage, index: number) {
    if (index === 0) return
    const prev = sorted[index - 1]
    updateGalleryImage({ ...img, order: prev.order })
    updateGalleryImage({ ...prev, order: img.order })
  }

  function moveDown(img: GalleryImage, index: number) {
    if (index === sorted.length - 1) return
    const next = sorted[index + 1]
    updateGalleryImage({ ...img, order: next.order })
    updateGalleryImage({ ...next, order: img.order })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteGalleryImage(deleteTarget.id)
    setDeleteTarget(null)
    showToast('Imagen eliminada')
  }

  const activeCount = galleryImages.filter(i => i.active).length

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Gestión de Galería" subtitle={`${galleryImages.length} imágenes · ${activeCount} activas`} />

        <div className="flex-1 p-6 space-y-6">

          {/* Toast */}
          {toast && (
            <div className="flex items-center gap-3 px-4 py-3 bg-admin-success/10 border border-admin-success/30 rounded-xl text-admin-success text-sm font-medium">
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
              {toast}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total imágenes', value: galleryImages.length, color: 'text-gray-200' },
              { label: 'Activas', value: activeCount, color: 'text-admin-success' },
              { label: 'Inactivas', value: galleryImages.length - activeCount, color: 'text-gray-500' },
              { label: 'Posiciones', value: sorted.length, color: 'text-admin-primary' },
            ].map(stat => (
              <div key={stat.label} className="admin-card text-center py-4">
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Add image form */}
          <div className="admin-card">
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="flex items-center gap-2 w-full text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-admin-primary/10 border border-admin-primary/20 flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-admin-primary" />
              </div>
              <span className="font-semibold text-gray-200">Añadir nueva imagen</span>
              <span className={`ml-auto text-gray-500 transition-transform duration-200 ${addOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {addOpen && (
              <div className="mt-5 space-y-4 pt-4 border-t border-admin-border">
                {/* Mode selector */}
                <div className="flex gap-1 bg-gray-800 border border-admin-border rounded-lg p-1 w-fit">
                  <button
                    onClick={() => { setAddMode('url'); setNewSrc('') }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${addMode === 'url' ? 'bg-admin-primary text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    URL
                  </button>
                  <button
                    onClick={() => { setAddMode('file'); setNewUrl('') }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${addMode === 'file' ? 'bg-admin-primary text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <PhotoIcon className="w-3.5 h-3.5" />
                    Subir archivo
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addMode === 'url' ? (
                    <div>
                      <label className="admin-label">URL de la imagen</label>
                      <input
                        type="url"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        className="admin-input"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="admin-label">Seleccionar archivo</label>
                      <div className="flex flex-col gap-2">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="admin-input text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-admin-primary file:text-gray-900 file:text-sm file:font-medium file:cursor-pointer cursor-pointer"
                        />
                        {uploading && <p className="text-xs text-gray-500">Procesando imagen...</p>}
                        {newSrc && !uploading && (
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-admin-border">
                            <Image src={newSrc} alt="Vista previa" fill className="object-cover" unoptimized />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="admin-label">Texto alternativo (alt)</label>
                    <input
                      type="text"
                      value={newAlt}
                      onChange={e => setNewAlt(e.target.value)}
                      className="admin-input"
                      placeholder="Describe la imagen..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    disabled={addMode === 'url' ? !newUrl.trim() : !newSrc}
                    className="admin-btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Añadir imagen
                  </button>
                  <button
                    onClick={() => { setAddOpen(false); setNewUrl(''); setNewAlt(''); setNewSrc('') }}
                    className="admin-btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Empty state */}
          {sorted.length === 0 && (
            <div className="admin-card text-center py-16">
              <PhotoIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No hay imágenes en la galería</p>
              <p className="text-gray-600 text-sm mt-1">Añade la primera imagen para empezar</p>
            </div>
          )}

          {/* Gallery grid */}
          {sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((img, index) => (
                <div
                  key={img.id}
                  className={`admin-card !p-0 overflow-hidden group transition-all duration-200 hover:border-gray-600 ${!img.active ? 'opacity-60' : ''}`}
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-800">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    {/* Order badge */}
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-gray-200 border border-gray-700">
                      {img.order}
                    </div>
                    {/* Active badge */}
                    <div className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${img.active ? 'bg-admin-success/80 text-white' : 'bg-gray-800/80 text-gray-400'}`}>
                      {img.active ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
                      {img.active ? 'Activa' : 'Oculta'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Alt text */}
                    {editingId === img.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editAlt}
                          onChange={e => setEditAlt(e.target.value)}
                          className="admin-input text-sm flex-1"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(img)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                        />
                        <button onClick={() => saveEdit(img)} className="p-1.5 rounded-lg bg-admin-success/20 border border-admin-success/40 text-admin-success hover:bg-admin-success/30 transition-all">
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-gray-700 border border-admin-border text-gray-400 hover:bg-gray-600 transition-all">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-300 flex-1 truncate">{img.alt}</p>
                        <button
                          onClick={() => startEdit(img)}
                          className="p-1 rounded text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
                          title="Editar alt text"
                        >
                          <PencilSquareIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-admin-border">
                      {/* Reorder */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveUp(img, index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-gray-800 border border-admin-border text-gray-500 hover:text-gray-200 hover:border-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Subir"
                        >
                          <ArrowUpIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveDown(img, index)}
                          disabled={index === sorted.length - 1}
                          className="p-1.5 rounded-lg bg-gray-800 border border-admin-border text-gray-500 hover:text-gray-200 hover:border-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Bajar"
                        >
                          <ArrowDownIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Toggle active */}
                      <button
                        onClick={() => toggleActive(img)}
                        className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all border ${img.active ? 'bg-admin-success/10 text-admin-success border-admin-success/30 hover:bg-admin-success/20' : 'bg-gray-800 text-gray-500 border-admin-border hover:bg-gray-700'}`}
                      >
                        {img.active ? 'Activa' : 'Inactiva'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(img)}
                        className="p-1.5 rounded-lg bg-gray-800 border border-admin-border text-gray-500 hover:text-admin-danger hover:border-red-800/40 transition-all"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.alt}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
