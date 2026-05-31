import { motion } from 'framer-motion'

interface SummaryCardProps {
  title: string
  value: string
  icon: string
  color?: 'blue' | 'green' | 'red' | 'yellow'
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

export default function SummaryCard({
  title,
  value,
  icon,
  color = 'blue',
  trend,
}: SummaryCardProps) {
  const colorMap = {
    blue: 'from-blue-500/20 to-purple-500/5 border-blue-400/20',
    green: 'from-emerald-500/18 to-blue-500/5 border-emerald-400/20',
    red: 'from-rose-500/18 to-purple-500/5 border-rose-400/20',
    yellow: 'from-amber-500/18 to-purple-500/5 border-amber-400/20',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card bg-gradient-to-br ${colorMap[color]} p-5`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {trend && (
            <p
              className={`text-xs mt-2 ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? '📈' : '📉'} {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <span className="ml-2 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-r from-purple-600/70 to-blue-500/70 text-2xl shadow-[0_14px_40px_rgba(124,58,237,0.25)]">{icon}</span>
      </div>
    </motion.div>
  )
}
