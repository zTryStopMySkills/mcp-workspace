'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Por favor introduce usuario y contraseña')
      return
    }

    const DEMO_USER = 'hakuna'
    const DEMO_PASS = 'admin2026'

    if (username.trim().toLowerCase() !== DEMO_USER || password !== DEMO_PASS) {
      setError('Usuario o contraseña incorrectos')
      return
    }

    setLoading(true)
    localStorage.setItem('hakuna_auth', 'true')
    setTimeout(() => {
      router.push('/')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-admin-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-admin-primary mb-4 shadow-lg shadow-yellow-900/40">
            <span className="text-gray-900 font-black text-2xl">H</span>
          </div>
          <h1 className="text-3xl font-black text-admin-primary tracking-widest">HAKUNA</h1>
          <p className="text-gray-500 mt-1 text-sm">Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="admin-card">
          <h2 className="text-lg font-bold text-gray-100 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="admin-label">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="admin-input"
                placeholder="admin"
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label className="admin-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
                <p className="text-admin-danger text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full admin-btn-primary py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Accediendo...
                </>
              ) : (
                'Entrar al panel'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Acceso restringido al propietario
          </p>
        </div>
      </div>
    </div>
  )
}
