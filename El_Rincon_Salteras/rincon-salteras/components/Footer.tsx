import { Flame, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0F0A04] border-t border-[#D4A853]/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={22} className="text-[#8B1A1A]" />
              <div>
                <span className="font-display font-bold text-xl text-[#F5EFE6]">El Rincón</span>
                <span className="font-body text-[#8B7355] text-sm ml-1">de Salteras</span>
              </div>
            </div>
            <p className="font-body font-light text-[#8B7355] text-sm leading-relaxed max-w-xs mb-5">
              Sabor, tradición y excelencia. Desde Salteras, para siempre.
            </p>
            <blockquote className="border-l-2 border-[#8B1A1A] pl-4">
              <p className="font-display italic text-[#D4A853] text-sm">
                &ldquo;Hay brasas que alimentan, y hay brasas que enamoran. Las nuestras llevan quince años haciéndolo.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F5EFE6] tracking-wider uppercase mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#D4A853] mt-0.5 shrink-0" />
                <span className="font-body text-[#8B7355] text-sm">
                  C/ Juan Ramón Jiménez, 29<br />
                  41909 Salteras, Sevilla
                </span>
              </li>
              <li>
                <a
                  href="tel:+34954966184"
                  className="flex items-center gap-2 text-[#8B7355] hover:text-[#D4A853] transition-colors duration-200 font-body text-sm"
                >
                  <Phone size={14} className="text-[#D4A853]" />
                  +34 954 96 61 84
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/elrincondesalteras/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#8B7355] hover:text-[#D4A853] transition-colors duration-200 font-body text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#D4A853]" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  @elrincondesalteras
                </a>
              </li>
            </ul>
          </div>

          {/* Horario */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F5EFE6] tracking-wider uppercase mb-4">
              Horario
            </h4>
            <ul className="space-y-1.5 font-body text-xs">
              <li className="flex justify-between text-[#8B7355]">
                <span>Lunes</span>
                <span>20:30–23:30</span>
              </li>
              <li className="flex justify-between text-[#8B7355]/40">
                <span>Martes</span>
                <span className="text-[#8B1A1A]/60 italic">Cerrado</span>
              </li>
              <li className="flex justify-between text-[#8B7355]">
                <span>Mié–Jue</span>
                <span>13:00–17:00</span>
              </li>
              <li className="flex justify-between text-[#8B7355]">
                <span>Viernes</span>
                <span>12:30–17:30 · 20:30–23:30</span>
              </li>
              <li className="flex justify-between text-[#8B7355]">
                <span>Sábado</span>
                <span>13:00–17:30 · 20:30–23:30</span>
              </li>
              <li className="flex justify-between text-[#8B7355]">
                <span>Domingo</span>
                <span>13:00–17:30 · 20:30–23:45</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-[#8B7355]/60">
          <p>© {currentYear} El Rincón de Salteras. Con fuego y con alma.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-[#8B1A1A]" />
              Salteras, Sevilla
            </span>
            <span>Rating Google: 4.4 ★</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
