'use client'

import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'

const stats = [
  { emoji: '🎮', label: 'Packs activos', value: '8', color: '#3D7848' },
  { emoji: '🌱', label: 'Talleres', value: '4', color: '#8CC840' },
  { emoji: '⭐', label: 'Testimoniales', value: '3', color: '#F0CE55' },
  { emoji: '📸', label: 'Fotos galería', value: '0', color: '#E87838' },
]

const quickLinks = [
  { href: '/admin/packs', emoji: '🎮', title: 'Gestionar Packs', desc: 'Edita nombre, descripción, emoji y colores de cada pack' },
  { href: '/admin/talleres', emoji: '🌱', title: 'Gestionar Talleres', desc: 'Añade, edita o elimina talleres ambientales' },
  { href: '/admin/testimoniales', emoji: '⭐', title: 'Testimoniales', desc: 'Añade reseñas de familias y controla cuáles se muestran' },
  { href: '/admin/galeria', emoji: '📸', title: 'Galería de fotos', desc: 'Sube y organiza las fotos de vuestras animaciones' },
]

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#F7FAF2]">
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-fredoka)] text-4xl font-bold text-[#1A3020]">
              ¡Hola, equipo! 👋
            </h1>
            <p className="text-[#1A3020]/60 mt-1">
              Desde aquí gestionáis todo el contenido de la web de DiverNature.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#3D7848]/10 flex flex-col gap-2"
              >
                <div className="text-3xl" aria-hidden="true">{s.emoji}</div>
                <div
                  className="font-[family-name:var(--font-fredoka)] text-3xl font-bold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-sm text-[#1A3020]/60 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <h2 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020] mb-4">
            Acceso rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quickLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D7848]/10 hover:shadow-md hover:border-[#3D7848]/30 hover:-translate-y-0.5 transition-all flex items-start gap-4"
              >
                <div className="text-3xl flex-none" aria-hidden="true">{link.emoji}</div>
                <div>
                  <h3 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#1A3020]">
                    {link.title}
                  </h3>
                  <p className="text-sm text-[#1A3020]/55 leading-relaxed mt-0.5">{link.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-[#3D7848]/8 border border-[#3D7848]/15 rounded-2xl p-6">
            <h3 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#3D7848] mb-2">
              💡 ¿Cómo funciona?
            </h3>
            <ul className="text-sm text-[#1A3020]/65 leading-relaxed flex flex-col gap-2">
              <li>• <strong>Packs:</strong> Edita los 8 packs de animación — nombre, descripción, emoji y colores</li>
              <li>• <strong>Talleres:</strong> Añade nuevos talleres ambientales con título, descripción y etiquetas</li>
              <li>• <strong>Testimoniales:</strong> Gestiona las reseñas que aparecen en la web</li>
              <li>• <strong>Galería:</strong> Sube fotos de vuestras animaciones (se muestran en la web automáticamente)</li>
            </ul>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
