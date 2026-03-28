'use client'
import { businessInfo } from '@/lib/data'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Carta', href: '#carta' },
  { label: 'Reseñas', href: '#resenas' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-black/60 border-t border-white/10 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display text-2xl font-bold tracking-widest gold-gradient">HAKUNA</span>
              <span className="font-display text-2xl font-light tracking-widest text-white/70">BAR</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Tu rincón favorito en Mairena del Aljarafe. Tapas, raciones, brasa y los mejores cócteles.
            </p>
            <p className="text-white/40 text-sm mt-4">{businessInfo.address}</p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Navegación</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    className="text-white/50 hover:text-hakuna-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Síguenos</h4>
            <div className="flex gap-3 mb-6">
              {/* Instagram */}
              <a
                href={businessInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-pink-400 hover:border-pink-500/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={businessInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Google Maps */}
              <a
                href={businessInfo.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-500/30 transition-all duration-300"
                aria-label="Google Maps"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.102 0 4 3.025 4 7.854C4 13.297 11.193 22.76 11.505 23.158C11.73 23.44 12 23.581 12 23.581s.27-.141.495-.423C12.807 22.76 20 13.297 20 7.854 20 3.025 15.898 0 12 0zm0 11.286a3.429 3.429 0 110-6.857 3.429 3.429 0 010 6.857z"/>
                </svg>
              </a>
            </div>

            <div className="space-y-2">
              <a href={`tel:${businessInfo.phone}`} className="block text-white/50 hover:text-hakuna-gold transition-colors text-sm">
                {businessInfo.phone}
              </a>
              <a href={`mailto:${businessInfo.email}`} className="block text-white/50 hover:text-hakuna-gold transition-colors text-sm">
                {businessInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm text-center md:text-left">
            &copy; 2024 Hakuna Bar. Todos los derechos reservados.
          </p>
          <p className="text-white/20 text-xs">
            Mairena del Aljarafe, Sevilla, España
          </p>
        </div>
      </div>
    </footer>
  )
}
