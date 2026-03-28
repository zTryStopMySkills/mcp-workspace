'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/lib/store'
import type { BusinessInfo, ScheduleDay } from '@/lib/types'
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon,
  ClockIcon,
  CheckIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-admin-border mb-4">
      <div className="w-8 h-8 rounded-lg bg-admin-primary/10 border border-admin-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-admin-primary" />
      </div>
      <h2 className="font-semibold text-gray-200">{title}</h2>
    </div>
  )
}

export default function NegocioPage() {
  const { businessInfo, updateBusinessInfo } = useStore()

  const [form, setForm] = useState<BusinessInfo>(businessInfo)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof BusinessInfo>(key: K, value: BusinessInfo[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function setSchedule(index: number, field: keyof ScheduleDay, value: string) {
    setForm(prev => ({
      ...prev,
      schedule: prev.schedule.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      ),
    }))
  }

  function save() {
    updateBusinessInfo(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Datos del Negocio" subtitle="Información y configuración del establecimiento" />

        <div className="flex-1 p-6 space-y-6">

          {/* Success toast */}
          {saved && (
            <div className="flex items-center gap-3 px-4 py-3 bg-admin-success/10 border border-admin-success/30 rounded-xl text-admin-success text-sm font-medium">
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
              Los datos del negocio se han guardado correctamente
            </div>
          )}

          {/* Información básica */}
          <div className="admin-card">
            <SectionHeader icon={BuildingStorefrontIcon} title="Información básica" />
            <div className="space-y-4">
              <div>
                <label className="admin-label">Nombre del establecimiento</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className="admin-input"
                  placeholder="Hakuna Bar"
                />
              </div>
              <div>
                <label className="admin-label">Eslogan / Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={e => set('tagline', e.target.value)}
                  className="admin-input"
                  placeholder="Tu rincón favorito en Mairena del Aljarafe"
                />
              </div>
              <div>
                <label className="admin-label">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="Describe tu establecimiento..."
                />
              </div>
              <div>
                <label className="admin-label">Dirección</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  className="admin-input"
                  placeholder="Mairena del Aljarafe, Sevilla"
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="admin-card">
            <SectionHeader icon={PhoneIcon} title="Contacto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="admin-label">Teléfono</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className="admin-input pl-9"
                    placeholder="+34 XXX XXX XXX"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className="admin-input pl-9"
                    placeholder="info@hakunabar.es"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">WhatsApp</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={e => set('whatsapp', e.target.value)}
                    className="admin-input pl-9"
                    placeholder="+34XXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="admin-card">
            <SectionHeader icon={GlobeAltIcon} title="Redes sociales y mapas" />
            <div className="space-y-4">
              <div>
                <label className="admin-label">Instagram (URL)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">IG</span>
                  <input
                    type="url"
                    value={form.instagram}
                    onChange={e => set('instagram', e.target.value)}
                    className="admin-input pl-9"
                    placeholder="https://www.instagram.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Facebook (URL)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">FB</span>
                  <input
                    type="url"
                    value={form.facebook}
                    onChange={e => set('facebook', e.target.value)}
                    className="admin-input pl-9"
                    placeholder="https://www.facebook.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Google Maps (URL)</label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    value={form.googleMaps}
                    onChange={e => set('googleMaps', e.target.value)}
                    className="admin-input pl-9"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Valoración Google */}
          <div className="admin-card">
            <SectionHeader icon={StarIcon} title="Valoración Google" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Puntuación media (0–5)</label>
                <div className="relative">
                  <StarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.googleRating}
                    onChange={e => set('googleRating', parseFloat(e.target.value) || 0)}
                    className="admin-input pl-9"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Introduce la media actual de Google</p>
              </div>
              <div>
                <label className="admin-label">Total de reseñas</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.totalReviews}
                  onChange={e => set('totalReviews', parseInt(e.target.value) || 0)}
                  className="admin-input"
                />
                <p className="text-xs text-gray-500 mt-1">Número total de reseñas en Google</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-gray-800/40 rounded-lg border border-admin-border">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(form.googleRating) ? 'text-admin-primary fill-admin-primary' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-admin-primary font-bold">{form.googleRating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">· {form.totalReviews} reseñas en Google</span>
            </div>
          </div>

          {/* Horarios */}
          <div className="admin-card">
            <SectionHeader icon={ClockIcon} title="Horarios" />
            <div className="space-y-2">
              {form.schedule.map((day, i) => (
                <div key={day.day} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-admin-border hover:border-gray-600 transition-all">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-300">{day.day}</span>
                  </div>
                  <div className="relative flex-1">
                    <PencilSquareIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <input
                      type="text"
                      value={day.hours}
                      onChange={e => setSchedule(i, 'hours', e.target.value)}
                      className="admin-input pl-8 text-sm"
                      placeholder="Ej: 12:00 - 00:00 o Cerrado"
                    />
                  </div>
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${day.hours.toLowerCase() === 'cerrado' ? 'bg-gray-600' : 'bg-admin-success'}`} title={day.hours.toLowerCase() === 'cerrado' ? 'Cerrado' : 'Abierto'} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Escribe &ldquo;Cerrado&rdquo; para los días que no abres</p>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button onClick={save} className="admin-btn-primary flex items-center gap-2 px-6">
              <CheckIcon className="w-4 h-4" />
              Guardar cambios
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
