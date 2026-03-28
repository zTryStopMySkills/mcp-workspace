import type { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
  trendUp?: boolean
  accentColor?: 'gold' | 'green' | 'blue' | 'red' | 'orange'
}

const accentMap: Record<string, string> = {
  gold: 'bg-yellow-900/30 text-admin-primary border-yellow-800/30',
  green: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/30',
  blue: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
  red: 'bg-red-900/30 text-red-400 border-red-800/30',
  orange: 'bg-orange-900/30 text-orange-400 border-orange-800/30',
}

export default function StatsCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  accentColor = 'gold',
}: StatsCardProps) {
  const accent = accentMap[accentColor] ?? accentMap['gold']

  return (
    <div className="admin-card flex items-start gap-4 hover:border-gray-600 transition-colors duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${accent}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-100 mt-0.5">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? 'text-admin-success' : 'text-admin-danger'}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </p>
        )}
      </div>
    </div>
  )
}
