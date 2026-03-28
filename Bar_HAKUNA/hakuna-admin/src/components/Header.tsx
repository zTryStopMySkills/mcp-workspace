'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-admin-border bg-admin-dark/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="pl-10 lg:pl-0">
        <h1 className="text-xl font-bold text-gray-100">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-admin-sidebar border border-admin-border rounded-lg">
          <UserCircleIcon className="w-5 h-5 text-admin-primary" />
          <span className="text-sm text-gray-300">Admin</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-admin-success animate-pulse" title="Sistema activo" />
      </div>
    </header>
  )
}
