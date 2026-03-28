'use client'

import { useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import {
  QrCodeIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const BASE_URL = 'https://hakuna-bar.vercel.app'

interface QrPreset {
  label: string
  description: string
  emoji: string
  url: string
}

const PRESETS: QrPreset[] = [
  {
    label: 'Carta completa',
    description: 'Enlace a la carta completa del restaurante',
    emoji: '🍽️',
    url: BASE_URL,
  },
  {
    label: 'Menú del día',
    description: 'Enlace directo al menú del día',
    emoji: '📋',
    url: `${BASE_URL}/#menu-dia`,
  },
  {
    label: 'Contacto',
    description: 'Enlace a la sección de contacto',
    emoji: '📞',
    url: `${BASE_URL}/#contacto`,
  },
]

function buildQrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(data)}`
}

export default function QrPage() {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0)
  const [customUrl, setCustomUrl] = useState('')
  const [generated, setGenerated] = useState(true)
  const [activeQrUrl, setActiveQrUrl] = useState(buildQrUrl(BASE_URL))
  const [activeLabel, setActiveLabel] = useState('Carta completa')
  const [copied, setCopied] = useState(false)

  function selectPreset(index: number) {
    setSelectedPreset(index)
    setCustomUrl('')
    const preset = PRESETS[index]
    setActiveQrUrl(buildQrUrl(preset.url))
    setActiveLabel(preset.label)
    setGenerated(true)
  }

  function generateCustom() {
    const url = customUrl.trim()
    if (!url) return
    setSelectedPreset(null)
    setActiveQrUrl(buildQrUrl(url))
    setActiveLabel('URL personalizada')
    setGenerated(true)
  }

  function handleCopyUrl() {
    const url = selectedPreset !== null ? PRESETS[selectedPreset].url : customUrl.trim()
    if (!url) return
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handlePrint() {
    window.print()
  }

  const currentUrl = selectedPreset !== null ? PRESETS[selectedPreset].url : customUrl.trim()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header title="Generador de Código QR" subtitle="Genera y descarga códigos QR para tu establecimiento" />

        <div className="flex-1 p-6 space-y-6">

          {/* Instructions banner */}
          <div className="flex items-start gap-3 px-4 py-3 bg-admin-primary/5 border border-admin-primary/20 rounded-xl">
            <QrCodeIcon className="w-5 h-5 text-admin-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300 font-medium">Cómo usar los códigos QR</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Imprime este código QR y colócalo en las mesas de tu establecimiento. Los clientes podrán escanear el código con su móvil para acceder directamente a la carta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Selector */}
            <div className="space-y-4">

              {/* Presets */}
              <div className="admin-card">
                <h2 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-admin-primary" />
                  Secciones predefinidas
                </h2>
                <div className="space-y-2">
                  {PRESETS.map((preset, i) => (
                    <button
                      key={preset.label}
                      onClick={() => selectPreset(i)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${selectedPreset === i ? 'border-admin-primary/50 bg-admin-primary/5' : 'border-admin-border bg-gray-800/30 hover:border-gray-600'}`}
                    >
                      <span className="text-2xl">{preset.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-200">{preset.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{preset.url}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{preset.description}</p>
                      </div>
                      {selectedPreset === i && (
                        <div className="w-5 h-5 rounded-full bg-admin-primary flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="w-3 h-3 text-gray-900" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom URL */}
              <div className="admin-card">
                <h2 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-admin-primary" />
                  URL personalizada
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="admin-label">Introduce cualquier URL</label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={e => { setCustomUrl(e.target.value); setSelectedPreset(null) }}
                      className="admin-input"
                      placeholder="https://..."
                      onKeyDown={e => e.key === 'Enter' && generateCustom()}
                    />
                  </div>
                  <button
                    onClick={generateCustom}
                    disabled={!customUrl.trim()}
                    className="admin-btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                    Generar QR personalizado
                  </button>
                </div>
              </div>
            </div>

            {/* Right: QR display */}
            <div className="space-y-4">
              <div className="admin-card text-center space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-admin-border">
                  <h2 className="font-semibold text-gray-200">Vista previa del QR</h2>
                  {generated && (
                    <span className="flex items-center gap-1.5 text-xs text-admin-success bg-admin-success/10 border border-admin-success/30 px-2.5 py-1 rounded-full">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      Generado
                    </span>
                  )}
                </div>

                {/* QR Image */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-2xl inline-block" id="qr-print-area">
                    {generated ? (
                      <div className="space-y-2">
                        <div className="relative w-64 h-64">
                          <Image
                            src={activeQrUrl}
                            alt={`Código QR para ${activeLabel}`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <p className="text-center text-gray-900 font-bold text-sm pt-1">Hakuna Bar</p>
                        <p className="text-center text-gray-600 text-xs">{activeLabel}</p>
                      </div>
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <QrCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Selecciona una URL</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL display */}
                {currentUrl && (
                  <div className="flex items-center gap-2 bg-gray-800/60 border border-admin-border rounded-lg px-3 py-2">
                    <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <p className="text-xs text-gray-400 flex-1 truncate text-left">{currentUrl}</p>
                    <button
                      onClick={handleCopyUrl}
                      className={`flex-shrink-0 text-xs px-2 py-1 rounded-md transition-all font-medium ${copied ? 'text-admin-success bg-admin-success/10' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-700'}`}
                    >
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                )}

                {/* Actions */}
                {generated && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                      href={activeQrUrl}
                      download={`qr-hakuna-${activeLabel.toLowerCase().replace(/\s+/g, '-')}.png`}
                      className="flex-1 admin-btn-primary flex items-center justify-center gap-2 no-underline"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Descargar QR
                    </a>
                    <button
                      onClick={handlePrint}
                      className="flex-1 admin-btn-secondary flex items-center justify-center gap-2"
                    >
                      <PrinterIcon className="w-4 h-4" />
                      Imprimir
                    </button>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="admin-card space-y-3">
                <h3 className="text-sm font-semibold text-gray-300">Consejos de uso</h3>
                <ul className="space-y-2">
                  {[
                    'Imprime el QR en tamaño mínimo de 3x3 cm para facilitar el escaneo.',
                    'Coloca el código en un lugar bien iluminado y sin reflejos.',
                    'Puedes plastificarlo para protegerlo del uso diario.',
                    'El QR de la carta completa es ideal para colocarlo en la mesa.',
                    'El QR del menú del día funciona mejor en la entrada o en la pizarra.',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-admin-primary flex-shrink-0 mt-1.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > * { display: none !important; }
          #qr-print-area {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
