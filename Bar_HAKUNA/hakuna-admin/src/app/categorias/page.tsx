'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DeleteModal from '@/components/DeleteModal'
import { useStore } from '@/lib/store'
import type { Category } from '@/lib/types'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface CategoryFormData {
  name: string
  icon: string
  description: string
  active: boolean
}

const emptyForm: CategoryFormData = { name: '', icon: '🍽️', description: '', active: true }

const COMMON_ICONS = ['🍽️', '🥗', '🥬', '🥩', '🐟', '🍢', '🥖', '🍮', '🍺', '🍹', '🍜', '🍕', '🥐', '☕', '🍰', '🥗', '🌮', '🥚', '🧀', '🍖']

function generateCatId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36)
}

export default function CategoriasPage() {
  const { categories, menuItems, addCategory, updateCategory, deleteCategory } = useStore()

  const sorted = [...categories].sort((a, b) => a.order - b.order)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryFormData>(emptyForm)
  const [editForm, setEditForm] = useState<CategoryFormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [formErrors, setFormErrors] = useState<Partial<CategoryFormData>>({})

  function getItemCount(catId: string) {
    return menuItems.filter(i => i.category === catId).length
  }

  function validate(data: CategoryFormData): boolean {
    const errors: Partial<CategoryFormData> = {}
    if (!data.name.trim()) errors.name = 'El nombre es obligatorio'
    if (!data.icon.trim()) errors.icon = 'El icono es obligatorio'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleAdd() {
    if (!validate(form)) return
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0)
    addCategory({
      id: generateCatId(form.name),
      name: form.name.trim(),
      icon: form.icon.trim(),
      description: form.description.trim(),
      order: maxOrder + 1,
      active: form.active,
    })
    setForm(emptyForm)
    setShowAddModal(false)
    setFormErrors({})
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, icon: cat.icon, description: cat.description, active: cat.active })
    setFormErrors({})
  }

  function saveEdit(cat: Category) {
    if (!validate(editForm)) return
    updateCategory({ ...cat, ...editForm, name: editForm.name.trim(), icon: editForm.icon.trim(), description: editForm.description.trim() })
    setEditingId(null)
    setFormErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setFormErrors({})
  }

  function moveUp(cat: Category) {
    const index = sorted.findIndex(c => c.id === cat.id)
    if (index <= 0) return
    const prev = sorted[index - 1]
    updateCategory({ ...cat, order: prev.order })
    updateCategory({ ...prev, order: cat.order })
  }

  function moveDown(cat: Category) {
    const index = sorted.findIndex(c => c.id === cat.id)
    if (index >= sorted.length - 1) return
    const next = sorted[index + 1]
    updateCategory({ ...cat, order: next.order })
    updateCategory({ ...next, order: cat.order })
  }

  function toggleActive(cat: Category) {
    updateCategory({ ...cat, active: !cat.active })
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const IconPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="admin-label">Icono (emoji)</label>
      <div className="flex gap-2 flex-wrap mb-2">
        {COMMON_ICONS.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={`w-9 h-9 rounded-lg text-lg transition-all ${value === emoji ? 'bg-admin-primary ring-2 ring-admin-primary/50 ring-offset-1 ring-offset-gray-900' : 'bg-gray-800 border border-admin-border hover:bg-gray-700'}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="admin-input"
        placeholder="O escribe un emoji personalizado..."
        maxLength={4}
      />
      {formErrors.icon && <p className="text-admin-danger text-xs mt-1">{formErrors.icon}</p>}
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Gestión de Categorías" subtitle={`${categories.length} categorías configuradas`} />

        <div className="flex-1 p-6 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Organiza las categorías para estructurar la carta del restaurante.
            </p>
            <button
              onClick={() => { setShowAddModal(true); setForm(emptyForm); setFormErrors({}) }}
              className="admin-btn-primary flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Nueva categoría
            </button>
          </div>

          {/* Category list */}
          <div className="space-y-3">
            {sorted.map((cat, index) => {
              const isEditing = editingId === cat.id
              const itemCount = getItemCount(cat.id)

              return (
                <div
                  key={cat.id}
                  className={`admin-card transition-all duration-200 ${!cat.active ? 'opacity-60' : ''} ${isEditing ? 'border-admin-primary/50 bg-yellow-900/5' : 'hover:border-gray-600'}`}
                >
                  {isEditing ? (
                    /* Edit mode */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-admin-primary">Editando categoría</h3>
                        <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-300 transition-colors">
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Nombre *</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="admin-input"
                            placeholder="Nombre de la categoría"
                          />
                          {formErrors.name && <p className="text-admin-danger text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <label className="admin-label">Descripción</label>
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                            className="admin-input"
                            placeholder="Descripción breve..."
                          />
                        </div>
                      </div>

                      <IconPicker
                        value={editForm.icon}
                        onChange={v => setEditForm(f => ({ ...f, icon: v }))}
                      />

                      <label className="flex items-center gap-3 cursor-pointer">
                        <div
                          onClick={() => setEditForm(f => ({ ...f, active: !f.active }))}
                          className={`relative w-11 h-6 rounded-full transition-all duration-200 ${editForm.active ? 'bg-admin-primary' : 'bg-gray-700'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow ${editForm.active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-sm text-gray-300">Categoría activa (visible en la carta)</span>
                      </label>

                      <div className="flex gap-2">
                        <button onClick={cancelEdit} className="admin-btn-secondary flex items-center gap-1.5">
                          <XMarkIcon className="w-4 h-4" /> Cancelar
                        </button>
                        <button onClick={() => saveEdit(cat)} className="admin-btn-primary flex items-center gap-1.5">
                          <CheckIcon className="w-4 h-4" /> Guardar cambios
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-center gap-4">
                      {/* Order buttons */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => moveUp(cat)}
                          disabled={index === 0}
                          className="p-1 rounded text-gray-600 hover:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Subir"
                        >
                          <ChevronUpIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveDown(cat)}
                          disabled={index === sorted.length - 1}
                          className="p-1 rounded text-gray-600 hover:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Bajar"
                        >
                          <ChevronDownIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Order badge */}
                      <div className="w-7 h-7 rounded-lg bg-gray-800 border border-admin-border flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gray-800 border border-admin-border flex items-center justify-center flex-shrink-0 text-2xl">
                        {cat.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-200">{cat.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${cat.active ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40' : 'bg-gray-800 text-gray-500 border border-admin-border'}`}>
                            {cat.active ? 'Activa' : 'Inactiva'}
                          </span>
                          <span className="text-xs bg-gray-800 border border-admin-border text-gray-400 px-2 py-0.5 rounded-full">
                            {itemCount} {itemCount === 1 ? 'plato' : 'platos'}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate">{cat.description}</p>
                        )}
                        <p className="text-xs text-gray-600 mt-0.5">ID: {cat.id}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(cat)}
                          className={`hidden sm:block text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${cat.active ? 'bg-gray-800 border-admin-border text-gray-400 hover:bg-gray-700' : 'bg-emerald-900/20 border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/30'}`}
                          title={cat.active ? 'Desactivar' : 'Activar'}
                        >
                          {cat.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 rounded-lg bg-gray-800 border border-admin-border text-gray-400 hover:text-admin-primary hover:border-admin-primary/40 transition-all"
                          title="Editar"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-2 rounded-lg bg-gray-800 border border-admin-border text-gray-400 hover:text-admin-danger hover:border-red-800/40 transition-all"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {categories.length === 0 && (
            <div className="admin-card text-center py-16">
              <p className="text-4xl mb-4">📁</p>
              <p className="text-gray-400 text-lg font-medium">No hay categorías</p>
              <p className="text-gray-600 text-sm mt-1 mb-6">Crea la primera categoría para organizar la carta</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="admin-btn-primary inline-flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Crear primera categoría
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add category modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 w-full max-w-lg bg-admin-card border border-admin-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-100">Nueva categoría</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Nombre *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="admin-input"
                    placeholder="Ej: Entrantes"
                    autoFocus
                  />
                  {formErrors.name && <p className="text-admin-danger text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="admin-label">Descripción</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="admin-input"
                    placeholder="Descripción breve..."
                  />
                </div>
              </div>

              <IconPicker
                value={form.icon}
                onChange={v => setForm(f => ({ ...f, icon: v }))}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`relative w-11 h-6 rounded-full transition-all duration-200 ${form.active ? 'bg-admin-primary' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-gray-300">Categoría activa al crear</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 admin-btn-secondary">
                  Cancelar
                </button>
                <button onClick={handleAdd} className="flex-1 admin-btn-primary">
                  Crear categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
