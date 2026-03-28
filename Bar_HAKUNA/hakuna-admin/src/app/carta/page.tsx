'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import DeleteModal from '@/components/DeleteModal'
import { useStore } from '@/lib/store'
import type { MenuItem } from '@/lib/types'
import { ALLERGENS } from '@/lib/types'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

const spicyEmojis = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️']

function CartaContent() {
  const { menuItems, categories, updateItem, deleteItem, toggleSoldOut } = useStore()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') ?? 'all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setFilterCategory(cat)
  }, [searchParams])

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCategory === 'all' || item.category === filterCategory
      const matchStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && item.active) ||
        (filterStatus === 'inactive' && !item.active)
      return matchSearch && matchCat && matchStatus
    })
  }, [menuItems, search, filterCategory, filterStatus])

  const getCategoryName = (catId: string) => categories.find(c => c.id === catId)?.name ?? catId
  const getCategoryIcon = (catId: string) => categories.find(c => c.id === catId)?.icon ?? '🍽️'

  function toggleActive(item: MenuItem) {
    updateItem({ ...item, active: !item.active })
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteItem(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const renderStars = (rating: number) => (
    <span className="flex items-center gap-0.5">
      <StarSolid className="w-3.5 h-3.5 text-admin-primary" />
      <span className="text-xs text-gray-300 ml-0.5">{rating.toFixed(1)}</span>
    </span>
  )

  const getAllergenIcon = (allergenId: string) => {
    return ALLERGENS.find(a => a.id === allergenId)?.icon ?? ''
  }

  return (
    <>
      <Header title="Gestión de Carta" subtitle={`${filtered.length} de ${menuItems.length} platos`} />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters + actions bar */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="admin-input pl-9"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="admin-input pl-9 pr-8 appearance-none min-w-[180px]"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="admin-input min-w-[140px]"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-800 border border-admin-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-admin-primary text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-admin-primary text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Cuadrícula
            </button>
          </div>

          {/* Add button */}
          <Link href="/carta/nuevo" className="admin-btn-primary flex items-center gap-2 whitespace-nowrap">
            <PlusIcon className="w-4 h-4" />
            Añadir plato
          </Link>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="admin-card text-center py-16">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-gray-400 text-lg font-medium">No se encontraron platos</p>
            <p className="text-gray-600 text-sm mt-1">Prueba con otros filtros o añade un nuevo plato</p>
            <Link href="/carta/nuevo" className="admin-btn-primary inline-flex items-center gap-2 mt-4">
              <PlusIcon className="w-4 h-4" />
              Añadir primer plato
            </Link>
          </div>
        )}

        {/* Table view */}
        {filtered.length > 0 && viewMode === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-admin-border">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-admin-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Plato</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Valoración</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Extras</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Agotado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border bg-admin-card">
                {filtered.map(item => (
                  <tr key={item.id} className={`hover:bg-gray-800/40 transition-colors ${item.soldOut ? 'opacity-75' : ''}`}>
                    {/* Name + thumbnail */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border border-admin-border">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-lg">
                              {getCategoryIcon(item.category)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate max-w-[160px]">{item.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-800 border border-admin-border px-2.5 py-1 rounded-full text-gray-300">
                        {getCategoryIcon(item.category)} {getCategoryName(item.category)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="text-admin-primary font-bold text-sm">{item.price.toFixed(2)} €</span>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {renderStars(item.rating)}
                    </td>

                    {/* Extras: badges + allergen icons */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                        {item.isRecommended && (
                          <span className="inline-flex items-center gap-1 text-xs bg-yellow-900/30 border border-yellow-800/40 text-yellow-300 px-2 py-0.5 rounded-full">
                            <StarIcon className="w-3 h-3" /> Chef
                          </span>
                        )}
                        {item.isNew && (
                          <span className="text-xs bg-blue-900/30 border border-blue-800/40 text-blue-300 px-2 py-0.5 rounded-full">
                            Nuevo
                          </span>
                        )}
                        {item.spicy && item.spicy > 0 ? (
                          <span className="text-xs">{spicyEmojis[item.spicy]}</span>
                        ) : null}
                        {item.allergens && item.allergens.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 flex-wrap" title={`Alérgenos: ${item.allergens.join(', ')}`}>
                            {item.allergens.slice(0, 5).map(allergenId => (
                              <span key={allergenId} className="text-sm leading-none" title={ALLERGENS.find(a => a.id === allergenId)?.name}>
                                {getAllergenIcon(allergenId)}
                              </span>
                            ))}
                            {item.allergens.length > 5 && (
                              <span className="text-xs text-gray-500">+{item.allergens.length - 5}</span>
                            )}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Active status toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(item)}
                        className={`relative w-10 h-5 rounded-full transition-all duration-200 ${item.active ? 'bg-admin-success' : 'bg-gray-700'}`}
                        title={item.active ? 'Desactivar' : 'Activar'}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </td>

                    {/* Sold out toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSoldOut(item.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 ${
                          item.soldOut
                            ? 'bg-red-900/40 border-red-700/50 text-red-400 hover:bg-red-900/60'
                            : 'bg-gray-800 border-admin-border text-gray-500 hover:border-gray-500 hover:text-gray-300'
                        }`}
                        title={item.soldOut ? 'Marcar como disponible' : 'Marcar como agotado'}
                      >
                        {item.soldOut ? 'AGOTADO' : 'Disponible'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/carta/${item.id}`}
                          className="p-2 rounded-lg bg-gray-800 border border-admin-border text-gray-400 hover:text-admin-primary hover:border-admin-primary/40 transition-all"
                          title="Editar"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 rounded-lg bg-gray-800 border border-admin-border text-gray-400 hover:text-admin-danger hover:border-red-800/40 transition-all"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid view */}
        {filtered.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item.id} className={`admin-card !p-0 overflow-hidden group hover:border-gray-600 transition-all duration-200 ${!item.active ? 'opacity-60' : ''}`}>
                {/* Image */}
                <div className="relative w-full h-44 bg-gray-800 flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
                      {getCategoryIcon(item.category)}
                    </div>
                  )}
                  {/* Badges overlay */}
                  <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                    {item.isRecommended && (
                      <span className="text-xs bg-admin-primary text-gray-900 font-semibold px-2 py-0.5 rounded-full">Chef</span>
                    )}
                    {item.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Nuevo</span>
                    )}
                  </div>
                  {/* Sold out overlay */}
                  {item.soldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-lg tracking-widest uppercase bg-black/70 px-4 py-1.5 rounded-lg border border-red-700/60">
                        Agotado
                      </span>
                    </div>
                  )}
                  {/* Price overlay */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-sm font-bold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {item.price.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-200 text-sm leading-tight">{item.name}</h3>
                      {renderStars(item.rating)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {getCategoryIcon(item.category)} {getCategoryName(item.category)}
                    </span>
                    {item.spicy && item.spicy > 0 ? <span className="text-xs">{spicyEmojis[item.spicy]}</span> : null}
                  </div>

                  {/* Allergen icons */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.allergens.map(allergenId => (
                        <span
                          key={allergenId}
                          className="text-sm leading-none"
                          title={ALLERGENS.find(a => a.id === allergenId)?.name}
                        >
                          {getAllergenIcon(allergenId)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1 border-t border-admin-border">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${item.active ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40' : 'bg-gray-800 text-gray-500 border border-admin-border'}`}
                    >
                      {item.active ? 'Activo' : 'Inactivo'}
                    </button>
                    <button
                      onClick={() => toggleSoldOut(item.id)}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-medium border transition-all ${
                        item.soldOut
                          ? 'bg-red-900/30 text-red-400 border-red-800/40'
                          : 'bg-gray-800 text-gray-500 border-admin-border'
                      }`}
                    >
                      {item.soldOut ? 'Agotado' : 'Stock ok'}
                    </button>
                    <Link
                      href={`/carta/${item.id}`}
                      className="p-1.5 rounded-lg bg-gray-800 border border-admin-border text-gray-400 hover:text-admin-primary hover:border-admin-primary/40 transition-all"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg bg-gray-800 border border-admin-border text-gray-400 hover:text-admin-danger hover:border-red-800/40 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filtered.length > 0 && (
          <p className="text-xs text-gray-600 text-center">
            Mostrando {filtered.length} de {menuItems.length} platos
          </p>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}

export default function CartaPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 flex items-center gap-3">
              <span className="inline-block w-5 h-5 border-2 border-gray-700 border-t-admin-primary rounded-full animate-spin" />
              Cargando carta...
            </div>
          </div>
        }>
          <CartaContent />
        </Suspense>
      </main>
    </div>
  )
}
