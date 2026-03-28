'use client'

import { useState, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DeleteModal from '@/components/DeleteModal'
import { useStore } from '@/lib/store'
import type { Review } from '@/lib/types'
import {
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid, CheckCircleIcon } from '@heroicons/react/24/solid'

type FilterType = 'all' | 'visible' | 'hidden' | 'featured'

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const effective = hovered || rating
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHovered(s)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
        >
          <StarSolid className={`w-5 h-5 transition-colors ${s <= effective ? 'text-admin-primary' : 'text-gray-700'}`} />
        </button>
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase()).join('')
}

const AVATAR_COLORS = [
  'bg-amber-700', 'bg-blue-700', 'bg-purple-700', 'bg-green-700',
  'bg-rose-700', 'bg-teal-700', 'bg-indigo-700', 'bg-orange-700',
]

function avatarColor(id: string) {
  const sum = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

interface AddReviewModalProps {
  onSave: (review: Review) => void
  onClose: () => void
}

function AddReviewModal({ onSave, onClose }: AddReviewModalProps) {
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  function submit() {
    if (!author.trim()) { setError('El nombre del autor es obligatorio'); return }
    if (!text.trim()) { setError('El texto de la reseña es obligatorio'); return }
    const initials = getInitials(author.trim())
    onSave({
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      author: author.trim(),
      rating,
      text: text.trim(),
      date,
      avatar: initials,
      visible: true,
      featured: false,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-admin-card border border-admin-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h2 className="text-lg font-bold text-gray-100">Nueva reseña</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-all">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-admin-danger bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className="admin-label">Autor *</label>
            <input
              type="text"
              value={author}
              onChange={e => { setAuthor(e.target.value); setError('') }}
              className="admin-input"
              placeholder="Nombre del cliente"
              autoFocus
            />
          </div>

          <div>
            <label className="admin-label">Valoración</label>
            <StarRating rating={rating} onChange={setRating} />
          </div>

          <div>
            <label className="admin-label">Texto de la reseña *</label>
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setError('') }}
              rows={4}
              className="admin-input resize-none"
              placeholder="Escribe la reseña del cliente..."
            />
          </div>

          <div>
            <label className="admin-label">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="admin-input"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 admin-btn-secondary">Cancelar</button>
          <button onClick={submit} className="flex-1 admin-btn-primary flex items-center justify-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Añadir reseña
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResenasPage() {
  const { reviews, addReview, updateReview, deleteReview } = useStore()

  const [filter, setFilter] = useState<FilterType>('all')
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (filter === 'visible') return r.visible
      if (filter === 'hidden') return !r.visible
      if (filter === 'featured') return r.featured
      return true
    })
  }, [reviews, filter])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const featuredCount = reviews.filter(r => r.featured).length
  const visibleCount = reviews.filter(r => r.visible).length

  function toggleVisible(r: Review) {
    updateReview({ ...r, visible: !r.visible })
  }

  function toggleFeatured(r: Review) {
    updateReview({ ...r, featured: !r.featured })
  }

  function handleAdd(review: Review) {
    addReview(review)
    showToast('Reseña añadida correctamente')
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteReview(deleteTarget.id)
    setDeleteTarget(null)
    showToast('Reseña eliminada')
  }

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T12:00:00')
    return dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'visible', label: 'Visibles' },
    { value: 'hidden', label: 'Ocultas' },
    { value: 'featured', label: 'Destacadas' },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Gestión de Reseñas" subtitle={`${reviews.length} reseñas · media ${avgRating} estrellas`} />

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
            <div className="admin-card text-center py-4">
              <p className="text-2xl font-black text-gray-200">{reviews.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total reseñas</p>
            </div>
            <div className="admin-card text-center py-4">
              <div className="flex items-center justify-center gap-1 mb-1">
                <StarSolid className="w-5 h-5 text-admin-primary" />
                <p className="text-2xl font-black text-admin-primary">{avgRating}</p>
              </div>
              <p className="text-xs text-gray-500">Media valoración</p>
            </div>
            <div className="admin-card text-center py-4">
              <p className="text-2xl font-black text-admin-success">{visibleCount}</p>
              <p className="text-xs text-gray-500 mt-1">Visibles</p>
            </div>
            <div className="admin-card text-center py-4">
              <p className="text-2xl font-black text-admin-primary">{featuredCount}</p>
              <p className="text-xs text-gray-500 mt-1">Destacadas</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-gray-800 border border-admin-border rounded-lg p-1">
              <FunnelIcon className="w-4 h-4 text-gray-600 ml-1.5" />
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f.value ? 'bg-admin-primary text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  {f.label}
                  {f.value === 'all' && ` (${reviews.length})`}
                  {f.value === 'visible' && ` (${visibleCount})`}
                  {f.value === 'hidden' && ` (${reviews.length - visibleCount})`}
                  {f.value === 'featured' && ` (${featuredCount})`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="admin-btn-primary flex items-center gap-2 sm:ml-auto whitespace-nowrap"
            >
              <PlusIcon className="w-4 h-4" />
              Nueva reseña
            </button>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="admin-card text-center py-16">
              <StarIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">
                {filter === 'all' ? 'No hay reseñas todavía' : `No hay reseñas ${filter === 'visible' ? 'visibles' : filter === 'hidden' ? 'ocultas' : 'destacadas'}`}
              </p>
              {filter === 'all' && (
                <button onClick={() => setShowAddModal(true)} className="admin-btn-primary inline-flex items-center gap-2 mt-4">
                  <PlusIcon className="w-4 h-4" />
                  Añadir primera reseña
                </button>
              )}
            </div>
          )}

          {/* Reviews list */}
          <div className="space-y-4">
            {filtered.map(review => (
              <div
                key={review.id}
                className={`admin-card transition-all duration-200 hover:border-gray-600 ${!review.visible ? 'opacity-70' : ''} ${review.featured ? 'border-admin-primary/30' : ''}`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${avatarColor(review.id)}`}>
                      {review.avatar || getInitials(review.author)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-200 text-sm">{review.author}</h3>
                        {review.featured && (
                          <span className="inline-flex items-center gap-1 text-xs bg-admin-primary/10 border border-admin-primary/30 text-admin-primary px-2 py-0.5 rounded-full">
                            <StarSolid className="w-3 h-3" />
                            Destacada
                          </span>
                        )}
                        {!review.visible && (
                          <span className="text-xs bg-gray-800 border border-admin-border text-gray-500 px-2 py-0.5 rounded-full">
                            Oculta
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <StarSolid
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-admin-primary' : 'text-gray-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                      </div>

                      <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {/* Toggle visible */}
                    <button
                      onClick={() => toggleVisible(review)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${review.visible ? 'bg-admin-success/10 border-admin-success/30 text-admin-success hover:bg-admin-success/20' : 'bg-gray-800 border-admin-border text-gray-500 hover:bg-gray-700'}`}
                      title={review.visible ? 'Ocultar reseña' : 'Mostrar reseña'}
                    >
                      {review.visible ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeSlashIcon className="w-3.5 h-3.5" />}
                      {review.visible ? 'Visible' : 'Oculta'}
                    </button>

                    {/* Toggle featured */}
                    <button
                      onClick={() => toggleFeatured(review)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${review.featured ? 'bg-admin-primary/10 border-admin-primary/30 text-admin-primary hover:bg-admin-primary/20' : 'bg-gray-800 border-admin-border text-gray-500 hover:bg-gray-700'}`}
                      title={review.featured ? 'Quitar destacado' : 'Destacar reseña'}
                    >
                      <StarSolid className="w-3.5 h-3.5" />
                      {review.featured ? 'Destacada' : 'Destacar'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(review)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-admin-border bg-gray-800 text-gray-500 hover:text-admin-danger hover:border-red-800/40 transition-all font-medium"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddReviewModal onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}

      {deleteTarget && (
        <DeleteModal
          itemName={`la reseña de ${deleteTarget.author}`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
