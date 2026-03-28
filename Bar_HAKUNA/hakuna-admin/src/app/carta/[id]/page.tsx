'use client'

import { useRouter } from 'next/navigation'
import { use } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import MenuItemForm from '@/components/MenuItemForm'
import { useStore } from '@/lib/store'
import type { MenuItem } from '@/lib/types'
import { ArrowLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default function EditarPlatoPage({ params }: EditPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { menuItems, updateItem } = useStore()

  const item = menuItems.find(i => i.id === id)

  function handleSubmit(data: MenuItem) {
    updateItem(data)
    router.push('/carta')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header
          title={item ? `Editar: ${item.name}` : 'Editar Plato'}
          subtitle="Modifica los datos del plato"
        />

        <div className="flex-1 p-6 max-w-2xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/carta" className="hover:text-admin-primary transition-colors flex items-center gap-1.5">
              <ArrowLeftIcon className="w-4 h-4" />
              Volver a la carta
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-[200px]">{item?.name ?? 'Editar plato'}</span>
          </div>

          {/* Not found state */}
          {!item && (
            <div className="admin-card text-center py-16">
              <ExclamationCircleIcon className="w-12 h-12 text-admin-danger mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-200 mb-2">Plato no encontrado</h2>
              <p className="text-gray-500 text-sm mb-6">No existe ningún plato con el ID especificado.</p>
              <Link href="/carta" className="admin-btn-primary inline-flex items-center gap-2">
                <ArrowLeftIcon className="w-4 h-4" />
                Volver a la carta
              </Link>
            </div>
          )}

          {/* Edit form */}
          {item && (
            <div className="admin-card">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-100">Editar plato</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ID: <code className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">{item.id}</code>
                </p>
              </div>
              <MenuItemForm
                initialData={item}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/carta')}
                isEditing
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
