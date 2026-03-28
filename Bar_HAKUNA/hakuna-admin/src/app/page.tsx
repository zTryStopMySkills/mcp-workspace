'use client'

import Link from 'next/link'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import { useStore } from '@/lib/store'
import {
  ClipboardDocumentListIcon,
  TagIcon,
  StarIcon,
  CurrencyEuroIcon,
  PlusIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { menuItems, categories, dailyMenu, toggleSoldOut } = useStore()

  const activeCategories = categories.filter(c => c.active).length
  const recommended = menuItems.filter(i => i.isRecommended).length
  const avgPrice = menuItems.length > 0
    ? (menuItems.reduce((sum, i) => sum + i.price, 0) / menuItems.length).toFixed(2)
    : '0.00'
  const recentItems = [...menuItems].reverse().slice(0, 5)
  const soldOutItems = menuItems.filter(i => i.soldOut)

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name ?? catId
  }

  const getCategoryIcon = (catId: string) => {
    return categories.find(c => c.id === catId)?.icon ?? '🍽️'
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header
          title="Panel de Administración"
          subtitle="Hakuna Bar — Gestión del restaurante"
        />

        <div className="flex-1 p-6 space-y-8">
          {/* Welcome banner */}
          <div className="rounded-2xl bg-gradient-to-r from-yellow-900/40 to-yellow-800/10 border border-yellow-800/30 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-admin-primary">Bienvenido al panel de administración</h2>
              <p className="text-gray-400 text-sm mt-1">Gestiona la carta, categorías y más desde aquí.</p>
            </div>
            <div className="hidden sm:block text-5xl opacity-30">🍺</div>
          </div>

          {/* Stats grid */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Resumen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
              <StatsCard
                label="Total de Platos"
                value={menuItems.length}
                icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
                accentColor="gold"
              />
              <StatsCard
                label="Categorías Activas"
                value={activeCategories}
                icon={<TagIcon className="w-6 h-6" />}
                accentColor="blue"
              />
              <StatsCard
                label="Platos Recomendados"
                value={recommended}
                icon={<StarIcon className="w-6 h-6" />}
                accentColor="orange"
              />
              <StatsCard
                label="Precio Medio"
                value={`${avgPrice} €`}
                icon={<CurrencyEuroIcon className="w-6 h-6" />}
                accentColor="green"
              />
              <StatsCard
                label="Platos Agotados"
                value={soldOutItems.length}
                icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                accentColor="red"
              />
              <StatsCard
                label="Menú del Día"
                value={dailyMenu?.active ? 'Activo' : 'Inactivo'}
                icon={<CalendarDaysIcon className="w-6 h-6" />}
                accentColor="blue"
              />
            </div>
          </section>

          {/* Sold-out quick panel */}
          {soldOutItems.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-widest">
                    Platos agotados ({soldOutItems.length})
                  </h3>
                </div>
                <Link href="/carta" className="text-xs text-admin-primary hover:text-yellow-400 transition-colors">
                  Ver carta completa →
                </Link>
              </div>
              <div className="admin-card !p-0 overflow-hidden divide-y divide-admin-border border-red-900/30">
                {soldOutItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 hover:bg-red-900/10 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border border-admin-border">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover opacity-60"
                          unoptimized
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-lg opacity-60">
                          {getCategoryIcon(item.category)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-300 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getCategoryIcon(item.category)} {getCategoryName(item.category)} — {item.price.toFixed(2)} €
                      </p>
                    </div>

                    {/* Badge + restore button */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-red-400 bg-red-900/30 border border-red-700/40 px-2.5 py-1 rounded-full">
                        AGOTADO
                      </span>
                      <button
                        onClick={() => toggleSoldOut(item.id)}
                        className="text-xs font-medium text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-3 py-1 rounded-lg hover:bg-emerald-900/40 transition-all"
                        title="Marcar como disponible"
                      >
                        Reponer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick actions + Recent items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Acciones rápidas</h3>

              <Link
                href="/carta/nuevo"
                className="admin-card flex items-center gap-4 hover:border-admin-primary/50 hover:bg-yellow-900/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-admin-primary/20 border border-admin-primary/30 flex items-center justify-center group-hover:bg-admin-primary/30 transition-colors">
                  <PlusIcon className="w-5 h-5 text-admin-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-200 text-sm">Añadir plato</p>
                  <p className="text-xs text-gray-500">Crea un nuevo elemento en la carta</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-600 group-hover:text-admin-primary transition-colors" />
              </Link>

              <Link
                href="/carta"
                className="admin-card flex items-center gap-4 hover:border-blue-500/30 hover:bg-blue-900/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-900/20 border border-blue-800/30 flex items-center justify-center group-hover:bg-blue-900/30 transition-colors">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-200 text-sm">Gestionar carta</p>
                  <p className="text-xs text-gray-500">Ver y editar todos los platos</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
              </Link>

              <Link
                href="/categorias"
                className="admin-card flex items-center gap-4 hover:border-purple-500/30 hover:bg-purple-900/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-800/30 flex items-center justify-center group-hover:bg-purple-900/30 transition-colors">
                  <TagIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-200 text-sm">Gestionar categorías</p>
                  <p className="text-xs text-gray-500">Organiza la estructura del menú</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
              </Link>
            </div>

            {/* Recent items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Últimos platos añadidos</h3>
                <Link href="/carta" className="text-xs text-admin-primary hover:text-yellow-400 transition-colors">
                  Ver todos →
                </Link>
              </div>

              <div className="admin-card !p-0 overflow-hidden divide-y divide-admin-border">
                {recentItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No hay platos todavía</p>
                  </div>
                ) : (
                  recentItems.map(item => (
                    <Link
                      key={item.id}
                      href={`/carta/${item.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-800/40 transition-colors group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border border-admin-border">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xl">
                            {getCategoryIcon(item.category)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-200 text-sm truncate group-hover:text-admin-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getCategoryIcon(item.category)} {getCategoryName(item.category)}
                        </p>
                      </div>

                      {/* Price + status */}
                      <div className="text-right flex-shrink-0 space-y-1">
                        <p className="text-admin-primary font-bold text-sm">{item.price.toFixed(2)} €</p>
                        <div className="flex items-center gap-1 justify-end">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                            {item.active ? 'Activo' : 'Inactivo'}
                          </span>
                          {item.soldOut && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">
                              Agotado
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Platos por categoría</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.filter(c => c.active).sort((a, b) => a.order - b.order).map(cat => {
                const count = menuItems.filter(i => i.category === cat.id).length
                return (
                  <Link
                    key={cat.id}
                    href={`/carta?category=${cat.id}`}
                    className="admin-card !p-4 text-center hover:border-admin-primary/40 hover:bg-yellow-900/5 transition-all duration-200 group"
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-admin-primary transition-colors truncate">{cat.name}</p>
                    <p className="text-lg font-bold text-gray-100 mt-0.5">{count}</p>
                    <p className="text-xs text-gray-600">platos</p>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
