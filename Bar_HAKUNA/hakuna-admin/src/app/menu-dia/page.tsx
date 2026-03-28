'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/lib/store'
import type { DailyMenuItem } from '@/lib/types'
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const TODAY = new Date().toISOString().split('T')[0]

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-admin-success' : 'bg-gray-700'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  )
}

interface ItemRowProps {
  item: DailyMenuItem
  onEdit: (item: DailyMenuItem) => void
  onDelete: (id: string) => void
}

function ItemRow({ item, onEdit, onDelete }: ItemRowProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [desc, setDesc] = useState(item.description)

  function save() {
    if (!name.trim()) return
    onEdit({ ...item, name: name.trim(), description: desc.trim() })
    setEditing(false)
  }

  function cancel() {
    setName(item.name)
    setDesc(item.description)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-800/60 rounded-lg border border-admin-primary/40">
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre del plato"
            className="admin-input text-sm"
            autoFocus
          />
          <input
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Descripción (opcional)"
            className="admin-input text-sm"
          />
        </div>
        <div className="flex sm:flex-col gap-2">
          <button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 bg-admin-success/20 border border-admin-success/40 text-admin-success rounded-lg text-sm hover:bg-admin-success/30 transition-all">
            <CheckIcon className="w-4 h-4" /> Guardar
          </button>
          <button onClick={cancel} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 border border-admin-border text-gray-400 rounded-lg text-sm hover:bg-gray-600 transition-all">
            <XMarkIcon className="w-4 h-4" /> Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-admin-border hover:border-gray-600 transition-all group">
      <div className="w-1.5 h-1.5 rounded-full bg-admin-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200">{item.name}</p>
        {item.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-admin-primary hover:bg-gray-700 transition-all"
          title="Editar"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-admin-danger hover:bg-gray-700 transition-all"
          title="Eliminar"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface AddItemFormProps {
  onAdd: (item: DailyMenuItem) => void
}

function AddItemForm({ onAdd }: AddItemFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  function submit() {
    if (!name.trim()) return
    onAdd({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      description: desc.trim(),
    })
    setName('')
    setDesc('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-admin-border text-gray-500 hover:border-admin-primary/50 hover:text-admin-primary transition-all text-sm"
      >
        <PlusIcon className="w-4 h-4" />
        Añadir plato
      </button>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-800/60 rounded-lg border border-admin-primary/40">
      <div className="flex-1 flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre del plato *"
          className="admin-input text-sm"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <input
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Descripción (opcional)"
          className="admin-input text-sm"
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
      </div>
      <div className="flex sm:flex-col gap-2">
        <button onClick={submit} disabled={!name.trim()} className="flex items-center gap-1.5 px-3 py-1.5 bg-admin-primary text-gray-900 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          <PlusIcon className="w-4 h-4" /> Añadir
        </button>
        <button onClick={() => { setOpen(false); setName(''); setDesc('') }} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 border border-admin-border text-gray-400 rounded-lg text-sm hover:bg-gray-600 transition-all">
          <XMarkIcon className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </div>
  )
}

function CourseSection({
  title,
  emoji,
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string
  emoji: string
  items: DailyMenuItem[]
  onAdd: (item: DailyMenuItem) => void
  onEdit: (item: DailyMenuItem) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="admin-card space-y-3">
      <h3 className="font-semibold text-gray-200 flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        {title}
        <span className="ml-auto text-xs font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full border border-admin-border">
          {items.length} plato{items.length !== 1 ? 's' : ''}
        </span>
      </h3>
      <div className="space-y-2">
        {items.map(item => (
          <ItemRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <AddItemForm onAdd={onAdd} />
    </div>
  )
}

export default function MenuDiaPage() {
  const { dailyMenu, updateDailyMenu } = useStore()

  const [menu, setMenu] = useState(dailyMenu)
  const [saved, setSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  function save() {
    updateDailyMenu(menu)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function addItem(section: 'firstCourses' | 'secondCourses' | 'desserts', item: DailyMenuItem) {
    setMenu(prev => ({ ...prev, [section]: [...prev[section], item] }))
  }

  function editItem(section: 'firstCourses' | 'secondCourses' | 'desserts', updated: DailyMenuItem) {
    setMenu(prev => ({ ...prev, [section]: prev[section].map(i => i.id === updated.id ? updated : i) }))
  }

  function deleteItem(section: 'firstCourses' | 'secondCourses' | 'desserts', id: string) {
    setMenu(prev => ({ ...prev, [section]: prev[section].filter(i => i.id !== id) }))
  }

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T12:00:00')
    return dt.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Menú del Día" subtitle="Configura y gestiona el menú diario" />

        <div className="flex-1 p-6 space-y-6">

          {/* Status banner */}
          {saved && (
            <div className="flex items-center gap-3 px-4 py-3 bg-admin-success/10 border border-admin-success/30 rounded-xl text-admin-success text-sm font-medium">
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
              Menú guardado correctamente
            </div>
          )}

          {/* Top controls */}
          <div className="admin-card">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
              <Toggle
                checked={menu.active}
                onChange={v => setMenu(prev => ({ ...prev, active: v }))}
                label={menu.active ? 'Menú activo (visible en la web)' : 'Menú inactivo (oculto en la web)'}
              />
              <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border ${menu.active ? 'bg-admin-success/10 border-admin-success/30 text-admin-success' : 'bg-gray-800 border-admin-border text-gray-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${menu.active ? 'bg-admin-success' : 'bg-gray-600'}`} />
                {menu.active ? 'Visible para clientes' : 'No visible'}
              </div>
            </div>
          </div>

          {/* Date & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="admin-card space-y-2">
              <label className="admin-label flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4" /> Fecha del menú
              </label>
              <input
                type="date"
                value={menu.date}
                onChange={e => setMenu(prev => ({ ...prev, date: e.target.value }))}
                className="admin-input"
              />
              <p className="text-xs text-gray-500 capitalize">{formatDate(menu.date)}</p>
            </div>
            <div className="admin-card space-y-2">
              <label className="admin-label flex items-center gap-2">
                <BanknotesIcon className="w-4 h-4" /> Precio del menú
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={menu.price}
                  onChange={e => setMenu(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="admin-input pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">€</span>
              </div>
              <p className="text-xs text-gray-500">Precio por persona, bebida e incluidos aparte</p>
            </div>
          </div>

          {/* Courses */}
          <CourseSection
            title="Primeros platos"
            emoji="🥗"
            items={menu.firstCourses}
            onAdd={item => addItem('firstCourses', item)}
            onEdit={item => editItem('firstCourses', item)}
            onDelete={id => deleteItem('firstCourses', id)}
          />
          <CourseSection
            title="Segundos platos"
            emoji="🍽️"
            items={menu.secondCourses}
            onAdd={item => addItem('secondCourses', item)}
            onEdit={item => editItem('secondCourses', item)}
            onDelete={id => deleteItem('secondCourses', id)}
          />
          <CourseSection
            title="Postres"
            emoji="🍮"
            items={menu.desserts}
            onAdd={item => addItem('desserts', item)}
            onEdit={item => editItem('desserts', item)}
            onDelete={id => deleteItem('desserts', id)}
          />

          {/* Extras & Notes */}
          <div className="admin-card space-y-4">
            <h3 className="font-semibold text-gray-200">Extras e información</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <Toggle
                checked={menu.includesDrink}
                onChange={v => setMenu(prev => ({ ...prev, includesDrink: v }))}
                label="Incluye bebida"
              />
              <Toggle
                checked={menu.includesBread}
                onChange={v => setMenu(prev => ({ ...prev, includesBread: v }))}
                label="Incluye pan"
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" /> Notas adicionales
              </label>
              <textarea
                value={menu.notes}
                onChange={e => setMenu(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Ej: Menú disponible de 13:00 a 16:00, solo entre semana..."
                className="admin-input resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="admin-btn-secondary flex items-center justify-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
            </button>
            <button onClick={save} className="admin-btn-primary flex items-center justify-center gap-2 sm:ml-auto">
              <CheckIcon className="w-4 h-4" />
              Guardar menú
            </button>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="admin-card border-admin-primary/40 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-admin-border">
                <EyeIcon className="w-5 h-5 text-admin-primary" />
                <h3 className="font-semibold text-gray-200">Vista previa del menú</h3>
                <span className="text-xs text-gray-500 ml-auto">Así lo verán los clientes</span>
              </div>

              {/* Preview card */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 max-w-md mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-br from-admin-primary/20 to-yellow-900/10 border-b border-gray-700 p-6 text-center">
                  <p className="text-xs text-admin-primary uppercase tracking-widest font-semibold mb-1">Hakuna Bar</p>
                  <h2 className="text-2xl font-black text-gray-100">Menú del Día</h2>
                  <p className="text-gray-400 text-sm mt-1 capitalize">{formatDate(menu.date)}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-admin-primary text-gray-900 font-black text-xl px-6 py-2 rounded-full">
                    {menu.price.toFixed(2)} €
                  </div>
                  {(menu.includesDrink || menu.includesBread) && (
                    <p className="text-xs text-gray-400 mt-2">
                      Incluye: {[menu.includesDrink && 'bebida', menu.includesBread && 'pan'].filter(Boolean).join(' + ')}
                    </p>
                  )}
                </div>

                <div className="p-5 space-y-5">
                  {/* First courses */}
                  {menu.firstCourses.length > 0 && (
                    <div>
                      <p className="text-xs text-admin-primary uppercase tracking-widest font-semibold mb-2">🥗 Primeros</p>
                      <ul className="space-y-1.5">
                        {menu.firstCourses.map(i => (
                          <li key={i.id}>
                            <p className="text-sm text-gray-200 font-medium">{i.name}</p>
                            {i.description && <p className="text-xs text-gray-500">{i.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {menu.firstCourses.length > 0 && menu.secondCourses.length > 0 && (
                    <div className="border-t border-gray-700/50" />
                  )}

                  {/* Second courses */}
                  {menu.secondCourses.length > 0 && (
                    <div>
                      <p className="text-xs text-admin-primary uppercase tracking-widest font-semibold mb-2">🍽️ Segundos</p>
                      <ul className="space-y-1.5">
                        {menu.secondCourses.map(i => (
                          <li key={i.id}>
                            <p className="text-sm text-gray-200 font-medium">{i.name}</p>
                            {i.description && <p className="text-xs text-gray-500">{i.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {menu.secondCourses.length > 0 && menu.desserts.length > 0 && (
                    <div className="border-t border-gray-700/50" />
                  )}

                  {/* Desserts */}
                  {menu.desserts.length > 0 && (
                    <div>
                      <p className="text-xs text-admin-primary uppercase tracking-widest font-semibold mb-2">🍮 Postres</p>
                      <ul className="space-y-1.5">
                        {menu.desserts.map(i => (
                          <li key={i.id}>
                            <p className="text-sm text-gray-200 font-medium">{i.name}</p>
                            {i.description && <p className="text-xs text-gray-500">{i.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  {menu.notes && (
                    <>
                      <div className="border-t border-gray-700/50" />
                      <p className="text-xs text-gray-500 italic text-center">{menu.notes}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
