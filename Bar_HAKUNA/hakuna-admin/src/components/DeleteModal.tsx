'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DeleteModalProps {
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ itemName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-admin-card border border-admin-border rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-800/40 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-7 h-7 text-admin-danger" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-100">Confirmar eliminación</h2>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              ¿Estás seguro de que quieres eliminar{' '}
              <span className="text-gray-200 font-semibold">&ldquo;{itemName}&rdquo;</span>?
              <br />
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 admin-btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 admin-btn-danger"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
