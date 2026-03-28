'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import type { MenuItem, AllergenId } from '@/lib/types'
import { ALLERGENS } from '@/lib/types'

interface MenuItemFormProps {
  initialData?: Partial<MenuItem>
  onSubmit: (data: MenuItem) => void
  onCancel: () => void
  isEditing?: boolean
}

const spicyLabels = ['Sin picante', 'Ligeramente picante', 'Picante', 'Muy picante']
const spicyEmojis = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️']

function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function MenuItemForm({ initialData, onSubmit, onCancel, isEditing = false }: MenuItemFormProps) {
  const { categories } = useStore()
  const activeCategories = categories.filter(c => c.active)

  const [form, setForm] = useState<Omit<MenuItem, 'id'>>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? 0,
    category: initialData?.category ?? (activeCategories[0]?.id ?? ''),
    image: initialData?.image ?? '',
    rating: initialData?.rating ?? 4.0,
    isRecommended: initialData?.isRecommended ?? false,
    spicy: initialData?.spicy ?? 0,
    isNew: initialData?.isNew ?? false,
    active: initialData?.active ?? true,
    soldOut: initialData?.soldOut ?? false,
    allergens: initialData?.allergens ?? [],
  })

  const [errors, setErrors] = useState<Partial<Record<keyof MenuItem, string>>>({})
  const [imageError, setImageError] = useState(false)

  function validate(): boolean {
    const newErrors: Partial<Record<keyof MenuItem, string>> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria'
    if (form.price <= 0) newErrors.price = 'El precio debe ser mayor que 0'
    if (!form.category) newErrors.category = 'La categoría es obligatoria'
    if (form.rating < 0 || form.rating > 5) newErrors.rating = 'La valoración debe estar entre 0 y 5'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      id: initialData?.id ?? generateId(),
      ...form,
    })
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key as keyof MenuItem]) {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  function toggleAllergen(allergenId: AllergenId) {
    const current = form.allergens
    if (current.includes(allergenId)) {
      set('allergens', current.filter(a => a !== allergenId))
    } else {
      set('allergens', [...current, allergenId])
    }
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      set('image', base64)
      setImageError(false)
    }
    reader.readAsDataURL(file)
  }

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-admin-primary' : 'bg-gray-700'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
      <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">{label}</span>
    </label>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name + Category row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Nombre del plato *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className="admin-input"
            placeholder="Ej: Croquetas de Jamón"
          />
          {errors.name && <p className="text-admin-danger text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="admin-label">Categoría *</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="admin-input"
          >
            <option value="">Seleccionar categoría...</option>
            {activeCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-admin-danger text-xs mt-1">{errors.category}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="admin-label">Descripción *</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          className="admin-input resize-none"
          rows={3}
          placeholder="Describe el plato, ingredientes, forma de preparación..."
        />
        {errors.description && <p className="text-admin-danger text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Price + Rating row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Precio (€) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
            <input
              type="number"
              value={form.price === 0 ? '' : form.price}
              onChange={e => set('price', parseFloat(e.target.value) || 0)}
              className="admin-input pl-7"
              placeholder="0.00"
              min="0"
              step="0.5"
            />
          </div>
          {errors.price && <p className="text-admin-danger text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="admin-label">Valoración (0–5)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={e => set('rating', parseFloat(e.target.value))}
              className="flex-1 accent-admin-primary"
            />
            <span className="text-admin-primary font-bold text-lg w-10 text-center">{form.rating.toFixed(1)}</span>
          </div>
          {errors.rating && <p className="text-admin-danger text-xs mt-1">{errors.rating}</p>}
        </div>
      </div>

      {/* Image URL + file upload */}
      <div>
        <label className="admin-label">Imagen del plato</label>
        <p className="text-xs text-gray-500 mb-2">Sube una foto desde tu dispositivo o pega una URL</p>
        <div className="space-y-2">
          <input
            type="url"
            value={form.image.startsWith('data:') ? '' : form.image}
            onChange={e => { set('image', e.target.value); setImageError(false) }}
            className="admin-input"
            placeholder="https://images.unsplash.com/..."
          />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-admin-border text-gray-300 text-sm font-medium hover:border-gray-500 hover:text-gray-100 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Subir imagen
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
            </label>
            {form.image.startsWith('data:') && (
              <span className="text-xs text-emerald-400">Imagen cargada desde dispositivo</span>
            )}
          </div>
        </div>
        {form.image && !imageError && (
          <div className="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-admin-border bg-gray-800">
            <Image
              src={form.image}
              alt="Vista previa"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
            <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-gray-300 px-2 py-0.5 rounded-full">
              Vista previa
            </span>
          </div>
        )}
        {form.image && imageError && (
          <p className="text-admin-warning text-xs mt-1">No se pudo cargar la imagen. Verifica la URL.</p>
        )}
      </div>

      {/* Allergens */}
      <div>
        <label className="admin-label">Alérgenos (normativa UE)</label>
        <p className="text-xs text-gray-500 mb-3">Selecciona los alérgenos presentes en este plato</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ALLERGENS.map(allergen => {
            const isSelected = form.allergens.includes(allergen.id as AllergenId)
            return (
              <button
                key={allergen.id}
                type="button"
                onClick={() => toggleAllergen(allergen.id as AllergenId)}
                className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-yellow-700/40 border-admin-primary text-admin-primary shadow-sm shadow-yellow-900/30'
                    : 'bg-gray-800 border-admin-border text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
                title={allergen.name}
              >
                <span className="text-lg leading-none">{allergen.icon}</span>
                <span className="leading-tight text-center line-clamp-2">{allergen.name}</span>
              </button>
            )
          })}
        </div>
        {form.allergens.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {form.allergens.length} alérgeno{form.allergens.length !== 1 ? 's' : ''} seleccionado{form.allergens.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Spicy level */}
      <div>
        <label className="admin-label">Nivel de picante</label>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => set('spicy', level)}
              className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                form.spicy === level
                  ? 'bg-admin-primary border-admin-primary text-gray-900 font-semibold'
                  : 'bg-gray-800 border-admin-border text-gray-400 hover:border-gray-500'
              }`}
            >
              {level === 0 ? '— Sin picante' : spicyEmojis[level]} {level > 0 && spicyLabels[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="admin-card !py-4 space-y-4">
        <p className="text-sm font-medium text-gray-400 mb-2">Opciones adicionales</p>
        <Toggle
          checked={form.isRecommended}
          onChange={v => set('isRecommended', v)}
          label="Plato recomendado por el chef"
        />
        <Toggle
          checked={form.isNew ?? false}
          onChange={v => set('isNew', v)}
          label="Marcar como novedad"
        />
        <Toggle
          checked={form.active}
          onChange={v => set('active', v)}
          label="Activo (visible en la carta)"
        />
        <Toggle
          checked={form.soldOut}
          onChange={v => set('soldOut', v)}
          label="Agotado temporalmente (no disponible hoy)"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 sm:flex-none admin-btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="flex-1 admin-btn-primary">
          {isEditing ? 'Guardar cambios' : 'Crear plato'}
        </button>
      </div>
    </form>
  )
}
