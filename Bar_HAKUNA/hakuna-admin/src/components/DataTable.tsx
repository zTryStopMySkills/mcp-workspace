'use client'

import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
  keyExtractor: (row: T) => string
}

type SortDir = 'asc' | 'desc' | null

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  emptyMessage = 'No hay datos disponibles',
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null) }
      else setSortDir('asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal === undefined || bVal === undefined) return 0
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    return 0
  })

  if (data.length === 0) {
    return (
      <div className="admin-card text-center py-16">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-admin-border">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(String(col.key))}
                      className="flex items-center gap-1 hover:text-gray-200 transition-colors"
                    >
                      {col.header}
                      <span className="flex flex-col ml-1">
                        <ChevronUpIcon
                          className={`w-3 h-3 -mb-0.5 ${sortKey === String(col.key) && sortDir === 'asc' ? 'text-admin-primary' : 'text-gray-600'}`}
                        />
                        <ChevronDownIcon
                          className={`w-3 h-3 ${sortKey === String(col.key) && sortDir === 'desc' ? 'text-admin-primary' : 'text-gray-600'}`}
                        />
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border bg-admin-card">
            {sorted.map(row => (
              <tr key={keyExtractor(row)} className="hover:bg-gray-800/40 transition-colors duration-150">
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-sm text-gray-300 ${col.className ?? ''}`}
                  >
                    {col.render ? col.render(row) : String(row[col.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map(row => (
          <div key={keyExtractor(row)} className="admin-card space-y-3">
            {columns.map(col => (
              <div key={String(col.key)} className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide flex-shrink-0">
                  {col.header}
                </span>
                <span className="text-sm text-gray-300 text-right">
                  {col.render ? col.render(row) : String(row[col.key as string] ?? '')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
