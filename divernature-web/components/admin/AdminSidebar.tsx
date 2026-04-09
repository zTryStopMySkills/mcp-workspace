'use client'

import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

const navItems = [
  { href: '/admin', label: 'Dashboard', emoji: '📊' },
  { href: '/admin/agenda', label: 'Agenda', emoji: '📅' },
  { href: '/admin/packs', label: 'Packs', emoji: '🎮' },
  { href: '/admin/talleres', label: 'Talleres', emoji: '🌱' },
  { href: '/admin/testimoniales', label: 'Testimoniales', emoji: '⭐' },
  { href: '/admin/galeria', label: 'Galería', emoji: '📸' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <aside
      className="w-64 bg-[#1A3020] min-h-screen flex flex-col p-6"
      role="navigation"
      aria-label="Panel de administración"
    >
      {/* Logo */}
      <div className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.png"
          alt="DiverNature Admin"
          className="h-9 w-auto brightness-[1.2]"
        />
        <p className="text-white/40 text-xs mt-2">Panel de administración</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname === item.href
                ? 'bg-[#3D7848] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            <span aria-hidden="true" className="text-lg">{item.emoji}</span>
            {item.label}
          </a>
        ))}
      </nav>

      {/* Acciones bottom */}
      <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-white/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
        >
          <span aria-hidden="true">🌐</span> Ver web
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 text-sm font-medium transition-all text-left"
        >
          <span aria-hidden="true">🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
