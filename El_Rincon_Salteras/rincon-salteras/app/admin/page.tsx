'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Flame, Settings, Star, Clock,
  Save, LogOut, Eye, EyeOff, RefreshCw, Plus, Trash2,
  BarChart3, Users
} from 'lucide-react'

// ── Tipos ────────────────────────────────────────────────────────────────────
interface ContentData {
  negocio: {
    nombre: string
    tagline: string
    telefono: string
    whatsapp: string
    email: string
    direccion: string
    instagram: string
    horario: Record<string, { abierto: boolean; turnos: string[] }>
    rating: { google: string; reseñas: string; thefork: string }
  }
  hero: {
    headline: string
    subheadline: string
    ctaPrimario: string
    ctaSecundario: string
    badge: string
  }
  especialidades: Array<{
    id: string
    nombre: string
    descripcion: string
    emoji: string
    destacado: boolean
  }>
  testimoniales: Array<{
    texto: string
    nombre: string
    rating: number
    fuente: string
  }>
  secciones: Record<string, boolean>
  updatedAt: string
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [content, setContent] = useState<ContentData | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const auth = localStorage.getItem('rincon_admin_auth')
    if (auth === 'ok') setIsAuthed(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'rincon2024') {
      localStorage.setItem('rincon_admin_auth', 'ok')
      setIsAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Contraseña incorrecta')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('rincon_admin_auth')
    setIsAuthed(false)
    setContent(null)
  }

  // ── Cargar datos ─────────────────────────────────────────────────────────
  const loadContent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/update')
      const data = await res.json()
      setContent(data)
    } catch {
      console.error('Error cargando contenido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthed) loadContent()
  }, [isAuthed, loadContent])

  // ── Guardar ───────────────────────────────────────────────────────────────
  const handleSave = async (partial?: Partial<ContentData>) => {
    setSaving(true)
    try {
      await fetch('/api/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial ?? content),
      })
      // Notificar otras pestañas abiertas
      try {
        new BroadcastChannel('admin-updates').postMessage({ type: 'CONTENT_UPDATED' })
      } catch {}
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      console.error('Error guardando')
    } finally {
      setSaving(false)
    }
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#1A1008] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Flame size={28} className="text-[#8B1A1A]" />
            <div>
              <p className="font-serif text-xl font-bold text-[#F5EFE6]">Panel Admin</p>
              <p className="text-[#8B7355] text-xs">El Rincón de Salteras</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="bg-[#2D1F0D] rounded-lg border border-[#D4A853]/20 p-7 space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[#D4A853]/80 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1008] border border-[#D4A853]/20 text-[#F5EFE6] text-base
                           rounded px-4 py-3 outline-none focus:border-[#D4A853]/60
                           transition-colors duration-200 placeholder-[#8B7355]/40"
                autoFocus
              />
              {authError && (
                <p className="mt-2 text-xs text-[#8B1A1A]">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8B1A1A] text-[#F5EFE6] font-bold rounded
                         hover:bg-[#A52020] transition-colors duration-200"
            >
              Entrar al panel
            </button>

            <div className="text-center pt-2 border-t border-[#D4A853]/10">
              <p className="text-xs text-[#8B7355]">Demo: contraseña <span className="text-[#D4A853] font-mono">rincon2024</span></p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-[#1A1008] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#D4A853]">
          <RefreshCw size={20} className="animate-spin" />
          <span className="font-sans text-sm">Cargando panel...</span>
        </div>
      </div>
    )
  }

  // ── Layout principal del admin ────────────────────────────────────────────
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'hero', label: 'Hero / Portada', icon: Eye },
    { id: 'especialidades', label: 'Especialidades', icon: Flame },
    { id: 'testimoniales', label: 'Testimoniales', icon: Star },
    { id: 'horario', label: 'Horario', icon: Clock },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
    { id: 'secciones', label: 'Visibilidad', icon: EyeOff },
  ]

  const DIAS_LABELS: Record<string, string> = {
    lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
    jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
  }

  const inputCls = 'w-full bg-[#1A1008] border border-[#D4A853]/20 text-[#F5EFE6] text-sm rounded px-3 py-2.5 outline-none focus:border-[#D4A853]/60 transition-colors duration-200'
  const labelCls = 'block text-xs font-semibold tracking-wider uppercase text-[#D4A853]/70 mb-1'
  const sectionTitle = (t: string) => (
    <h3 className="font-serif font-bold text-lg text-[#F5EFE6] mb-6 pb-3 border-b border-[#D4A853]/15">{t}</h3>
  )

  return (
    <div className="min-h-screen bg-[#0F0A04] text-[#F5EFE6] flex">
      {/* Sidebar */}
      <aside className="w-56 min-h-screen bg-[#1A1008] border-r border-[#D4A853]/10 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-4 border-b border-[#D4A853]/10">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#8B1A1A]" />
            <div>
              <p className="font-serif text-sm font-bold text-[#F5EFE6] leading-tight">El Rincón</p>
              <p className="text-[#8B7355] text-[10px]">Panel de administración</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-left transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-[#8B1A1A]/20 text-[#D4A853] border border-[#8B1A1A]/30'
                    : 'text-[#8B7355] hover:bg-[#2D1F0D] hover:text-[#F5EFE6]'
                  }`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[#D4A853]/10 space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded text-xs text-[#8B7355] hover:text-[#D4A853]
                       hover:bg-[#2D1F0D] transition-all duration-200"
          >
            <Eye size={13} />
            Ver la web
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-[#8B7355]
                       hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/10 transition-all duration-200"
          >
            <LogOut size={13} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-[#D4A853]/10 bg-[#1A1008]/60 flex items-center justify-between">
          <div>
            <h1 className="font-serif font-bold text-lg text-[#F5EFE6]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#8B7355]">
              Última actualización: {new Date(content.updatedAt).toLocaleString('es-ES')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadContent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8B7355]
                         border border-[#D4A853]/20 rounded hover:text-[#D4A853] hover:border-[#D4A853]/50
                         transition-all duration-200"
            >
              <RefreshCw size={12} />
              Recargar
            </button>
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold
                         bg-[#8B1A1A] text-[#F5EFE6] rounded
                         hover:bg-[#A52020] disabled:opacity-60
                         transition-all duration-200"
            >
              {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
              {saved ? '¡Guardado!' : 'Publicar cambios'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── DASHBOARD ────────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Rating Google', value: content.negocio.rating.google + ' ★', icon: Star, color: '#D4A853' },
                  { label: 'Reseñas', value: content.negocio.rating.reseñas, icon: Users, color: '#8B1A1A' },
                  { label: 'TheFork', value: content.negocio.rating.thefork + '/10', icon: BarChart3, color: '#D4A853' },
                  { label: 'Especialidades', value: content.especialidades.length.toString(), icon: Flame, color: '#8B1A1A' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="p-5 bg-[#1A1008] border border-[#D4A853]/15 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-[#8B7355] uppercase tracking-wider">{stat.label}</p>
                        <Icon size={16} style={{ color: stat.color }} />
                      </div>
                      <p className="font-serif font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                  )
                })}
              </div>

              {/* Info negocio */}
              <div className="bg-[#1A1008] border border-[#D4A853]/15 rounded-lg p-6">
                <h3 className="font-serif font-bold text-base text-[#F5EFE6] mb-4">Datos del negocio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    ['Nombre', content.negocio.nombre],
                    ['Teléfono', content.negocio.telefono],
                    ['Dirección', content.negocio.direccion],
                    ['Instagram', content.negocio.instagram],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-[#8B7355] w-20 shrink-0">{k}:</span>
                      <span className="text-[#F5EFE6]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div className="bg-[#2D1F0D]/40 border border-[#D4A853]/10 rounded-lg p-4 text-sm text-[#8B7355]">
                <span className="text-[#D4A853] font-semibold">Hoy: </span>
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          )}

          {/* ── HERO ─────────────────────────────────────────────────────── */}
          {activeTab === 'hero' && (
            <div className="max-w-2xl space-y-5">
              {sectionTitle('Portada — Texto principal')}
              {[
                { key: 'headline', label: 'Titular principal', type: 'text' },
                { key: 'subheadline', label: 'Subtítulo', type: 'text' },
                { key: 'ctaPrimario', label: 'Botón primario (CTA)', type: 'text' },
                { key: 'ctaSecundario', label: 'Botón secundario', type: 'text' },
                { key: 'badge', label: 'Badge de ratings', type: 'text' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="text"
                    value={(content.hero as Record<string, string>)[key] ?? ''}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, [key]: e.target.value } })
                    }
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── ESPECIALIDADES ────────────────────────────────────────────── */}
          {activeTab === 'especialidades' && (
            <div className="max-w-3xl">
              {sectionTitle('Especialidades del menú')}
              <div className="space-y-4">
                {content.especialidades.map((item, i) => (
                  <div key={item.id} className="p-5 bg-[#1A1008] border border-[#D4A853]/15 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className={labelCls}>Nombre</label>
                        <input
                          type="text"
                          value={item.nombre}
                          onChange={(e) => {
                            const updated = [...content.especialidades]
                            updated[i] = { ...updated[i], nombre: e.target.value }
                            setContent({ ...content, especialidades: updated })
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Emoji</label>
                        <input
                          type="text"
                          value={item.emoji}
                          onChange={(e) => {
                            const updated = [...content.especialidades]
                            updated[i] = { ...updated[i], emoji: e.target.value }
                            setContent({ ...content, especialidades: updated })
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Descripción</label>
                      <textarea
                        value={item.descripcion}
                        rows={2}
                        onChange={(e) => {
                          const updated = [...content.especialidades]
                          updated[i] = { ...updated[i], descripcion: e.target.value }
                          setContent({ ...content, especialidades: updated })
                        }}
                        className={inputCls + ' resize-none'}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-[#8B7355] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.destacado}
                          onChange={(e) => {
                            const updated = [...content.especialidades]
                            updated[i] = { ...updated[i], destacado: e.target.checked }
                            setContent({ ...content, especialidades: updated })
                          }}
                          className="accent-[#8B1A1A]"
                        />
                        Mostrar como destacado
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TESTIMONIALES ─────────────────────────────────────────────── */}
          {activeTab === 'testimoniales' && (
            <div className="max-w-2xl">
              {sectionTitle('Testimoniales y reseñas')}
              <div className="space-y-5">
                {content.testimoniales.map((item, i) => (
                  <div key={i} className="p-5 bg-[#1A1008] border border-[#D4A853]/15 rounded-lg space-y-3">
                    <div>
                      <label className={labelCls}>Texto de la reseña</label>
                      <textarea
                        value={item.texto}
                        rows={3}
                        onChange={(e) => {
                          const updated = [...content.testimoniales]
                          updated[i] = { ...updated[i], texto: e.target.value }
                          setContent({ ...content, testimoniales: updated })
                        }}
                        className={inputCls + ' resize-none'}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Nombre del autor</label>
                        <input
                          type="text"
                          value={item.nombre}
                          onChange={(e) => {
                            const updated = [...content.testimoniales]
                            updated[i] = { ...updated[i], nombre: e.target.value }
                            setContent({ ...content, testimoniales: updated })
                          }}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Fuente</label>
                        <input
                          type="text"
                          value={item.fuente}
                          onChange={(e) => {
                            const updated = [...content.testimoniales]
                            updated[i] = { ...updated[i], fuente: e.target.value }
                            setContent({ ...content, testimoniales: updated })
                          }}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HORARIO ──────────────────────────────────────────────────── */}
          {activeTab === 'horario' && (
            <div className="max-w-lg">
              {sectionTitle('Horario de apertura')}
              <div className="space-y-4">
                {Object.entries(content.negocio.horario).map(([dia, info]) => (
                  <div key={dia} className="p-4 bg-[#1A1008] border border-[#D4A853]/15 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm text-[#F5EFE6]">
                        {DIAS_LABELS[dia]}
                      </span>
                      <label className="flex items-center gap-2 text-xs text-[#8B7355] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={info.abierto}
                          onChange={(e) => {
                            setContent({
                              ...content,
                              negocio: {
                                ...content.negocio,
                                horario: {
                                  ...content.negocio.horario,
                                  [dia]: { ...info, abierto: e.target.checked },
                                },
                              },
                            })
                          }}
                          className="accent-[#8B1A1A]"
                        />
                        Abierto
                      </label>
                    </div>
                    {info.abierto && (
                      <div className="space-y-2">
                        {info.turnos.map((turno, ti) => (
                          <div key={ti} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={turno}
                              placeholder="13:00–17:00"
                              onChange={(e) => {
                                const newTurnos = [...info.turnos]
                                newTurnos[ti] = e.target.value
                                setContent({
                                  ...content,
                                  negocio: {
                                    ...content.negocio,
                                    horario: {
                                      ...content.negocio.horario,
                                      [dia]: { ...info, turnos: newTurnos },
                                    },
                                  },
                                })
                              }}
                              className={inputCls}
                            />
                            <button
                              onClick={() => {
                                const newTurnos = info.turnos.filter((_, i) => i !== ti)
                                setContent({
                                  ...content,
                                  negocio: {
                                    ...content.negocio,
                                    horario: {
                                      ...content.negocio.horario,
                                      [dia]: { ...info, turnos: newTurnos },
                                    },
                                  },
                                })
                              }}
                              className="p-1.5 text-[#8B7355] hover:text-[#8B1A1A] transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setContent({
                              ...content,
                              negocio: {
                                ...content.negocio,
                                horario: {
                                  ...content.negocio.horario,
                                  [dia]: { ...info, turnos: [...info.turnos, ''] },
                                },
                              },
                            })
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#D4A853] hover:text-[#F5EFE6] transition-colors"
                        >
                          <Plus size={12} />
                          Añadir turno
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CONFIGURACIÓN ─────────────────────────────────────────────── */}
          {activeTab === 'configuracion' && (
            <div className="max-w-2xl space-y-5">
              {sectionTitle('Datos del negocio')}
              {[
                { key: 'telefono', label: 'Teléfono de contacto', placeholder: '+34 954 96 61 84' },
                { key: 'whatsapp', label: 'WhatsApp (sin + ni espacios)', placeholder: '34954966184' },
                { key: 'email', label: 'Email', placeholder: 'info@elrincondesalteras.es' },
                { key: 'instagram', label: 'Instagram handle', placeholder: '@elrincondesalteras' },
                { key: 'tagline', label: 'Tagline', placeholder: 'Sabor, tradición y excelencia' },
                { key: 'direccion', label: 'Dirección', placeholder: 'C/ Juan Ramón Jiménez, 29...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="text"
                    value={(content.negocio as unknown as Record<string, string>)[key] ?? ''}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        negocio: { ...content.negocio, [key]: e.target.value },
                      })
                    }
                    className={inputCls}
                  />
                </div>
              ))}

              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'google', label: 'Rating Google' },
                  { key: 'reseñas', label: 'Nº Reseñas' },
                  { key: 'thefork', label: 'TheFork' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input
                      type="text"
                      value={content.negocio.rating[key as keyof typeof content.negocio.rating] ?? ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          negocio: {
                            ...content.negocio,
                            rating: { ...content.negocio.rating, [key]: e.target.value },
                          },
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── VISIBILIDAD ──────────────────────────────────────────────── */}
          {activeTab === 'secciones' && (
            <div className="max-w-sm">
              {sectionTitle('Mostrar / Ocultar secciones')}
              <div className="space-y-3">
                {Object.entries(content.secciones).map(([key, visible]) => {
                  const LABELS: Record<string, string> = {
                    hero: 'Portada (Hero)',
                    especialidades: 'Especialidades',
                    historia: 'Historia / About',
                    galeria: 'Galería de fotos',
                    testimoniales: 'Testimoniales',
                    reserva: 'Formulario de reserva',
                    contacto: 'Contacto / Mapa',
                  }
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-[#1A1008] border border-[#D4A853]/15 rounded-lg"
                    >
                      <span className="text-sm text-[#F5EFE6]">{LABELS[key] ?? key}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              secciones: { ...content.secciones, [key]: e.target.checked },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#2D1F0D] border border-[#D4A853]/20 rounded-full
                                        peer-checked:bg-[#8B1A1A] peer-checked:border-[#8B1A1A]/60
                                        after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                        after:bg-[#8B7355] after:rounded-full after:h-4 after:w-4
                                        after:transition-all peer-checked:after:translate-x-5
                                        peer-checked:after:bg-[#F5EFE6]" />
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
