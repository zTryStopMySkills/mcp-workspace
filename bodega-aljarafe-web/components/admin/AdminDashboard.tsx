'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, RotateCcw, Eye, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContentData, CartaCategoria, Plato, Especialidad } from '@/types'

type Tab = 'config' | 'carta' | 'especialidades' | 'testimoniales'

const TABS: { id: Tab; label: string }[] = [
  { id: 'config', label: 'Configuración' },
  { id: 'carta', label: 'Carta / Menú' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'testimoniales', label: 'Testimoniales' },
]

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg text-sm border transition-colors focus:outline-none focus:ring-2'
const INPUT_STYLE = {
  border: '1px solid var(--color-border)',
  background: 'white',
  color: 'var(--color-text)',
  '--tw-ring-color': 'var(--color-primary)',
}

export default function AdminDashboard() {
  const [data, setData] = useState<ContentData | null>(null)
  const [draft, setDraft] = useState<ContentData | null>(null)
  const [tab, setTab] = useState<Tab>('config')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load
  const load = useCallback(async () => {
    const res = await fetch('/api/content')
    const json: ContentData = await res.json()
    setData(json)
    setDraft(structuredClone(json))
  }, [])

  useEffect(() => { load() }, [load])

  // Real-time broadcast to other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return
    const bc = new BroadcastChannel('bodega_admin')
    return () => bc.close()
  }, [])

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error('Error al guardar')
      const result = await res.json()
      setData(structuredClone(draft))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      // Notify other tabs
      if (typeof window !== 'undefined') {
        const bc = new BroadcastChannel('bodega_admin')
        bc.postMessage({ type: 'saved', updatedAt: result.updatedAt })
        bc.close()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (data) setDraft(structuredClone(data))
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(data)

  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3" style={{ color: 'var(--color-muted)' }}>
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          Cargando...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 border-b"
        style={{ background: 'var(--color-dark)', borderColor: 'rgba(245,237,216,0.1)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-display font-bold text-lg"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}
          >
            Bodega Aljarafe
          </span>
          <ChevronRight size={14} style={{ color: 'rgba(245,237,216,0.3)' }} />
          <span className="text-sm" style={{ color: 'rgba(245,237,216,0.6)' }}>Panel Admin</span>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <span className="text-sm text-red-400">{error}</span>
          )}
          {saved && (
            <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
              ✓ Guardado
            </span>
          )}
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg"
            style={{ color: 'rgba(245,237,216,0.7)', border: '1px solid rgba(245,237,216,0.15)' }}
          >
            <Eye size={14} />
            Ver web
          </a>
          <button
            onClick={handleReset}
            disabled={!isDirty}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg disabled:opacity-30 transition-opacity"
            style={{ color: 'rgba(245,237,216,0.7)', border: '1px solid rgba(245,237,216,0.15)' }}
          >
            <RotateCcw size={14} />
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className={cn(
              'flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-all',
              isDirty && !saving
                ? 'opacity-100'
                : 'opacity-50 cursor-not-allowed'
            )}
            style={{ background: 'var(--color-primary)', color: 'var(--color-cream)' }}
          >
            <Save size={14} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="w-52 shrink-0 border-r pt-6 hidden md:block"
          style={{ borderColor: 'var(--color-border)', background: 'white' }}
        >
          <nav className="flex flex-col gap-1 px-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.id
                    ? 'text-[var(--color-cream)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
                )}
                style={tab === t.id ? { background: 'var(--color-primary)' } : {}}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 max-w-3xl">
          {/* Mobile tab select */}
          <div className="md:hidden mb-6">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as Tab)}
              className={INPUT_CLASS}
              style={INPUT_STYLE as React.CSSProperties}
            >
              {TABS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {tab === 'config' && (
            <ConfigTab draft={draft} setDraft={setDraft} inputClass={INPUT_CLASS} inputStyle={INPUT_STYLE as React.CSSProperties} />
          )}
          {tab === 'carta' && (
            <CartaTab draft={draft} setDraft={setDraft} inputClass={INPUT_CLASS} inputStyle={INPUT_STYLE as React.CSSProperties} />
          )}
          {tab === 'especialidades' && (
            <EspecialidadesTab draft={draft} setDraft={setDraft} inputClass={INPUT_CLASS} inputStyle={INPUT_STYLE as React.CSSProperties} />
          )}
          {tab === 'testimoniales' && (
            <TestimonialesTab draft={draft} setDraft={setDraft} inputClass={INPUT_CLASS} inputStyle={INPUT_STYLE as React.CSSProperties} />
          )}
        </main>
      </div>
    </div>
  )
}

/* ── Tabs ─────────────────────────────────────────── */

interface TabProps {
  draft: ContentData
  setDraft: (d: ContentData) => void
  inputClass: string
  inputStyle: React.CSSProperties
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display text-xl font-bold mb-6"
      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-dark)' }}
    >
      {children}
    </h2>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Config ──
function ConfigTab({ draft, setDraft, inputClass, inputStyle }: TabProps) {
  const set = (key: string, value: string) =>
    setDraft({ ...draft, config: { ...draft.config, [key]: value } })

  const setHorario = (dia: string, value: string) =>
    setDraft({ ...draft, config: { ...draft.config, horario: { ...draft.config.horario, [dia]: value } } })

  const setRedes = (key: string, value: string) =>
    setDraft({ ...draft, config: { ...draft.config, redesSociales: { ...draft.config.redesSociales, [key]: value } } })

  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

  return (
    <div>
      <SectionTitle>Configuración general</SectionTitle>

      <Field label="Nombre del negocio">
        <input className={inputClass} style={inputStyle} value={draft.config.nombre} onChange={e => set('nombre', e.target.value)} />
      </Field>
      <Field label="Teléfono (mostrado)">
        <input className={inputClass} style={inputStyle} value={draft.config.telefono} onChange={e => set('telefono', e.target.value)} />
      </Field>
      <Field label="Teléfono (href, ej: +34633208857)">
        <input className={inputClass} style={inputStyle} value={draft.config.telefonoHref} onChange={e => set('telefonoHref', e.target.value)} />
      </Field>
      <Field label="Dirección">
        <input className={inputClass} style={inputStyle} value={draft.config.direccion} onChange={e => set('direccion', e.target.value)} />
      </Field>
      <Field label="Rating">
        <input className={inputClass} style={inputStyle} value={draft.config.rating} onChange={e => set('rating', e.target.value)} />
      </Field>
      <Field label="Número de reseñas">
        <input className={inputClass} style={inputStyle} value={draft.config.resenas} onChange={e => set('resenas', e.target.value)} />
      </Field>

      <div className="mt-6 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Horario</span>
      </div>
      {dias.map(dia => (
        <Field key={dia} label={dia.charAt(0).toUpperCase() + dia.slice(1)}>
          <input className={inputClass} style={inputStyle} value={draft.config.horario[dia] ?? ''} onChange={e => setHorario(dia, e.target.value)} />
        </Field>
      ))}

      <div className="mt-6 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Redes sociales</span>
      </div>
      <Field label="Instagram URL">
        <input className={inputClass} style={inputStyle} value={draft.config.redesSociales.instagram} onChange={e => setRedes('instagram', e.target.value)} />
      </Field>

      <div className="mt-6 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Mapa</span>
      </div>
      <Field label="Google Maps embed URL">
        <textarea className={inputClass} style={inputStyle} rows={3} value={draft.config.mapsEmbedUrl} onChange={e => set('mapsEmbedUrl', e.target.value)} />
      </Field>
      <Field label="Google Maps enlace directo">
        <input className={inputClass} style={inputStyle} value={draft.config.mapsDirectUrl} onChange={e => set('mapsDirectUrl', e.target.value)} />
      </Field>
    </div>
  )
}

// ── Carta ──
function CartaTab({ draft, setDraft, inputClass, inputStyle }: TabProps) {
  const [openCat, setOpenCat] = useState<string | null>(null)

  const updatePlato = (catIdx: number, platoIdx: number, field: keyof Plato, value: string) => {
    const carta = draft.carta.map((c, ci) =>
      ci === catIdx
        ? {
            ...c,
            platos: c.platos.map((p, pi) =>
              pi === platoIdx ? { ...p, [field]: value } : p
            ),
          }
        : c
    )
    setDraft({ ...draft, carta })
  }

  const addPlato = (catIdx: number) => {
    const newPlato: Plato = {
      id: `plato-${Date.now()}`,
      nombre: 'Nuevo plato',
      frase: '',
      descripcion: '',
      precio: '',
      foto: null,
      destacado: null,
      alergenos: [],
      apto_para: [],
      libre_de: [],
    }
    const carta = draft.carta.map((c, ci) =>
      ci === catIdx ? { ...c, platos: [...c.platos, newPlato] } : c
    )
    setDraft({ ...draft, carta })
  }

  const deletePlato = (catIdx: number, platoIdx: number) => {
    const carta = draft.carta.map((c, ci) =>
      ci === catIdx ? { ...c, platos: c.platos.filter((_, pi) => pi !== platoIdx) } : c
    )
    setDraft({ ...draft, carta })
  }

  return (
    <div>
      <SectionTitle>Carta / Menú</SectionTitle>
      {draft.carta
        .sort((a, b) => a.orden - b.orden)
        .map((cat: CartaCategoria, catIdx: number) => (
          <div
            key={cat.categoria}
            className="mb-4 rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Category header */}
            <button
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm"
              style={{ background: 'white', color: 'var(--color-dark)' }}
              onClick={() => setOpenCat(openCat === cat.categoria ? null : cat.categoria)}
            >
              <span>{cat.categoria}</span>
              <span style={{ color: 'var(--color-muted)' }}>
                {cat.platos.length} platos · {openCat === cat.categoria ? '▲' : '▼'}
              </span>
            </button>

            {openCat === cat.categoria && (
              <div className="p-4 space-y-4" style={{ background: 'var(--color-cream)' }}>
                {cat.platos.map((plato: Plato, platoIdx: number) => (
                  <div
                    key={plato.id}
                    className="p-4 rounded-lg relative"
                    style={{ background: 'white', border: '1px solid var(--color-border)' }}
                  >
                    <button
                      className="absolute top-3 right-3 p-1 rounded opacity-50 hover:opacity-100"
                      style={{ color: 'var(--color-primary)' }}
                      onClick={() => deletePlato(catIdx, platoIdx)}
                      title="Eliminar plato"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-6">
                      <Field label="Nombre">
                        <input className={inputClass} style={inputStyle} value={plato.nombre} onChange={e => updatePlato(catIdx, platoIdx, 'nombre', e.target.value)} />
                      </Field>
                      <Field label="Precio">
                        <input className={inputClass} style={inputStyle} value={plato.precio} onChange={e => updatePlato(catIdx, platoIdx, 'precio', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Frase / subtítulo">
                      <input className={inputClass} style={inputStyle} value={plato.frase ?? ''} onChange={e => updatePlato(catIdx, platoIdx, 'frase', e.target.value)} />
                    </Field>
                    <Field label="Descripción">
                      <textarea className={inputClass} style={inputStyle} rows={2} value={plato.descripcion} onChange={e => updatePlato(catIdx, platoIdx, 'descripcion', e.target.value)} />
                    </Field>
                    <Field label="Badge destacado (ej: El más pedido)">
                      <input className={inputClass} style={inputStyle} value={plato.destacado ?? ''} onChange={e => updatePlato(catIdx, platoIdx, 'destacado', e.target.value)} />
                    </Field>
                  </div>
                ))}

                <button
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg w-full justify-center"
                  style={{
                    border: '1px dashed var(--color-primary)',
                    color: 'var(--color-primary)',
                    background: 'rgba(123,45,59,0.04)',
                  }}
                  onClick={() => addPlato(catIdx)}
                >
                  <Plus size={14} /> Añadir plato
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

// ── Especialidades ──
function EspecialidadesTab({ draft, setDraft, inputClass, inputStyle }: TabProps) {
  const update = (idx: number, field: keyof Especialidad, value: string | boolean) => {
    const especialidades = draft.especialidades.map((e, i) =>
      i === idx ? { ...e, [field]: value } : e
    )
    setDraft({ ...draft, especialidades })
  }

  return (
    <div>
      <SectionTitle>Especialidades</SectionTitle>
      <div className="space-y-4">
        {draft.especialidades.map((esp: Especialidad, idx: number) => (
          <div
            key={esp.id}
            className="p-4 rounded-xl"
            style={{ background: 'white', border: '1px solid var(--color-border)' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre">
                <input className={inputClass} style={inputStyle} value={esp.nombre} onChange={e => update(idx, 'nombre', e.target.value)} />
              </Field>
              <Field label="Precio">
                <input className={inputClass} style={inputStyle} value={esp.precio} onChange={e => update(idx, 'precio', e.target.value)} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea className={inputClass} style={inputStyle} rows={2} value={esp.descripcion} onChange={e => update(idx, 'descripcion', e.target.value)} />
            </Field>
            <Field label="Icono (emoji)">
              <input className={inputClass} style={inputStyle} value={esp.icono} onChange={e => update(idx, 'icono', e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text)' }}>
              <input
                type="checkbox"
                checked={esp.destacado}
                onChange={e => update(idx, 'destacado', e.target.checked)}
                className="accent-[var(--color-primary)]"
              />
              Destacado (aparece en grid grande)
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Testimoniales ──
function TestimonialesTab({ draft, setDraft, inputClass, inputStyle }: TabProps) {
  const update = (idx: number, field: string, value: string | number) => {
    const testimonios = draft.testimonios.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    )
    setDraft({ ...draft, testimonios })
  }

  return (
    <div>
      <SectionTitle>Testimoniales / Reseñas</SectionTitle>
      <div className="space-y-4">
        {draft.testimonios.map((t, idx) => (
          <div
            key={t.nombre + idx}
            className="p-4 rounded-xl"
            style={{ background: 'white', border: '1px solid var(--color-border)' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre">
                <input className={inputClass} style={inputStyle} value={t.nombre} onChange={e => update(idx, 'nombre', e.target.value)} />
              </Field>
              <Field label="Año / Fecha">
                <input className={inputClass} style={inputStyle} value={t.fecha} onChange={e => update(idx, 'fecha', e.target.value)} />
              </Field>
            </div>
            <Field label="Texto de la reseña">
              <textarea className={inputClass} style={inputStyle} rows={3} value={t.texto} onChange={e => update(idx, 'texto', e.target.value)} />
            </Field>
            <Field label="Rating (1-5)">
              <input type="number" min={1} max={5} className={inputClass} style={inputStyle} value={t.rating} onChange={e => update(idx, 'rating', parseInt(e.target.value))} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  )
}
