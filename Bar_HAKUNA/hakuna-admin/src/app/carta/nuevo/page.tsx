'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import MenuItemForm from '@/components/MenuItemForm'
import { useStore } from '@/lib/store'
import type { MenuItem } from '@/lib/types'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NuevoPlatoPage() {
  const router = useRouter()
  const { addItem } = useStore()

  function handleSubmit(data: MenuItem) {
    addItem(data)
    router.push('/carta')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Nuevo Plato" subtitle="Añadir un nuevo elemento a la carta" />

        <div className="flex-1 p-6 max-w-2xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/carta" className="hover:text-admin-primary transition-colors flex items-center gap-1.5">
              <ArrowLeftIcon className="w-4 h-4" />
              Volver a la carta
            </Link>
            <span>/</span>
            <span className="text-gray-400">Nuevo plato</span>
          </div>

          <div className="admin-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-100">Información del plato</h2>
              <p className="text-sm text-gray-500 mt-1">Completa todos los campos para añadir el plato a la carta.</p>
            </div>
            <MenuItemForm
              onSubmit={handleSubmit}
              onCancel={() => router.push('/carta')}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
