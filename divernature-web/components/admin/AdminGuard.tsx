'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/admin/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#3D7848] flex items-center justify-center">
        <div className="text-white text-xl font-[family-name:var(--font-fredoka)]">Cargando...</div>
      </div>
    )
  }

  return <>{children}</>
}
