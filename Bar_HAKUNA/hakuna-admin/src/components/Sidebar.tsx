'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  Bars3Icon,
  XMarkIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  PhotoIcon,
  StarIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'

const navSections = [
  {
    title: 'General',
    items: [
      { href: '/', label: 'Dashboard', icon: HomeIcon },
    ],
  },
  {
    title: 'Carta',
    items: [
      { href: '/carta', label: 'Platos', icon: ClipboardDocumentListIcon },
      { href: '/categorias', label: 'Categorías', icon: TagIcon },
      { href: '/menu-dia', label: 'Menú del Día', icon: CalendarDaysIcon },
    ],
  },
  {
    title: 'Contenido',
    items: [
      { href: '/galeria', label: 'Galería', icon: PhotoIcon },
      { href: '/resenas', label: 'Reseñas', icon: StarIcon },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { href: '/negocio', label: 'Datos del Negocio', icon: BuildingStorefrontIcon },
      { href: '/qr', label: 'Código QR', icon: QrCodeIcon },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-admin-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-admin-primary flex items-center justify-center">
            <span className="text-gray-900 font-black text-sm">H</span>
          </div>
          <div>
            <p className="text-admin-primary font-black text-lg leading-none tracking-widest">HAKUNA</p>
            <p className="text-gray-500 text-xs mt-0.5">Panel Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navSections.map(section => (
          <div key={section.title}>
            <p className="px-4 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-admin-primary text-gray-900 font-semibold shadow-lg shadow-yellow-900/20'
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="text-sm">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-admin-border">
        <p className="text-xs text-gray-600 text-center">Hakuna Bar &copy; 2025</p>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-admin-sidebar border border-admin-border rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 z-40 w-64 bg-admin-sidebar border-r border-admin-border flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </aside>

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-admin-sidebar border-r border-admin-border flex-col z-30">
        <NavContent />
      </aside>
    </>
  )
}
