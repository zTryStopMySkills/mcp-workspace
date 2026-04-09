import { siteConfig } from '@/lib/content'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1A3020] text-white py-14 px-6" role="contentinfo">
      <div className="max-w-5xl mx-auto">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo + tagline */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="DiverNature"
              className="h-10 w-auto mb-4 brightness-[1.2]"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              Diversión, naturaleza y momentos que dejan huella.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Navegación footer">
            <h4 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#F0CE55] mb-4">
              Ir a
            </h4>
            <ul className="flex flex-col gap-2 text-white/65 text-sm">
              {[
                { href: '#que-es', label: '¿Qué es DiverNature?' },
                { href: '#packs', label: 'Nuestros Packs' },
                { href: '#talleres', label: 'Talleres Ambientales' },
                { href: '#equipo', label: 'El Equipo' },
                { href: '#contacto', label: 'Contacto' },
              ].map(l => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h4 className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-[#F0CE55] mb-4">
              Contáctanos
            </h4>
            <ul className="flex flex-col gap-3 text-white/65 text-sm">
              <li>
                <a
                  href={`https://wa.me/34${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                  aria-label="WhatsApp 615 538 380"
                >
                  <span aria-hidden="true">📱</span> 615 538 380
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📍</span> Sevilla, Andalucía
              </li>
            </ul>

            {/* Redes sociales */}
            <div className="flex gap-3 mt-5">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de DiverNature"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E1306C] flex items-center justify-center transition-colors text-lg"
              >
                📸
              </a>
              <a
                href={siteConfig.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de DiverNature"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#010101] flex items-center justify-center transition-colors text-lg"
              >
                🎵
              </a>
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de DiverNature"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors text-lg"
              >
                📘
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>© {year} DiverNature Entretenimiento ECOfriendly. Hazlo siempre especial.</p>
          <a
            href="/admin/login"
            className="hover:text-white/70 transition-colors"
            aria-label="Acceso al panel de administración"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
