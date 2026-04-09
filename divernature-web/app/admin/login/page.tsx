'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'

export default function AdminLogin() {
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 400))
    if (login(pass)) {
      router.push('/admin')
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3D7848] flex items-center justify-center px-4">
      {/* Círculos decorativos */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#F0CE55]/20 rounded-full blur-xl" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#E87838]/20 rounded-full blur-xl" aria-hidden="true" />

      <div className="relative bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="DiverNature"
            className="h-12 w-auto mx-auto mb-3"
          />
          <h1 className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-[#1A3020]">
            Panel de Administración
          </h1>
          <p className="text-sm text-[#1A3020]/50 mt-1">Acceso exclusivo para el equipo</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-pass" className="block text-sm font-semibold text-[#1A3020] mb-2">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoComplete="current-password"
              placeholder="Introduce la contraseña"
              className="w-full border-2 border-[#3D7848]/20 rounded-xl px-4 py-3 text-[#1A3020] focus:border-[#3D7848] focus:outline-none transition-colors text-base"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-[family-name:var(--font-fredoka)] bg-[#3D7848] hover:bg-[#2f6038] disabled:opacity-60 text-white text-xl font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-[#3D7848] hover:underline">
            ← Volver a la web
          </a>
        </div>
      </div>
    </div>
  )
}
