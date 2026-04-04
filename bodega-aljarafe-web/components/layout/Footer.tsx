import { Camera, Phone, MapPin } from 'lucide-react'
import type { Config } from '@/types'

interface Props {
  config: Config
}

export default function Footer({ config }: Props) {
  return (
    <footer
      className="py-14"
      style={{
        background: 'var(--color-dark)',
        color: 'rgba(245,237,216,0.7)',
      }}
    >
      <div className="container-brand">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Marca */}
          <div>
            <p
              className="font-display text-2xl font-bold mb-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-cream)',
              }}
            >
              Bodega Aljarafe
            </p>
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Desde 1970 · Castilleja de la Cuesta
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>
              Cuatro generaciones de brasa, criterio y honestidad
              en la mesa. La bodega de barrio que se convirtió en referencia.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Contacto
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <span>{config.direccion}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                <a
                  href={`tel:${config.telefonoHref}`}
                  className="hover:text-[var(--color-cream)] transition-colors"
                >
                  {config.telefono}
                </a>
              </li>
              {config.redesSociales.instagram && (
                <li className="flex items-center gap-2">
                  <Camera size={14} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                  <a
                    href={config.redesSociales.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-cream)] transition-colors"
                  >
                    @bodegasaljarafe
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Horario */}
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Horario
            </p>
            <p className="text-sm">
              Todos los días
            </p>
            <p
              className="font-display font-bold text-base mt-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-cream)',
              }}
            >
              11:30 – 17:00
            </p>
            <p className="text-sm mt-1">y por las noches</p>
            <p
              className="font-display font-bold text-base mt-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-cream)',
              }}
            >
              20:00 – 00:00
            </p>
          </div>
        </div>

        {/* Divider + copyright */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: '1px solid rgba(245,237,216,0.08)',
            color: 'rgba(245,237,216,0.35)',
          }}
        >
          <p>© {new Date().getFullYear()} Bodega Aljarafe. La carne habla por sí sola.</p>
          <div className="flex gap-6">
            <a href="/admin" className="hover:text-[var(--color-cream)] transition-colors">
              Panel admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
