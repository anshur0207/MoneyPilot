import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function PortfolioSummary({ summary }) {
  const gainPercentage = parseFloat(summary?.gainPercentage) || 0
  const isPositive = gainPercentage >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Invested */}
        <div className="rounded-3xl bg-slate-950/60 border border-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">Total Invested</p>
          <p className="text-2xl font-semibold text-white">₹{(summary?.totalInvested || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Current Value */}
        <div className="rounded-3xl bg-slate-950/60 border border-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">Current Value</p>
          <p className="text-2xl font-semibold text-cyan-400">₹{(summary?.totalValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Total Gains */}
        <div className="rounded-3xl bg-slate-950/60 border border-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">Total Gains</p>
          <p className={`text-2xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            ₹{(summary?.totalGains || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Gain % */}
        <div className="rounded-3xl bg-slate-950/60 border border-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">Gain %</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {gainPercentage.toFixed(2)}%
            </p>
            <TrendingUp className={`w-5 h-5 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </div>

        {/* Total Units */}
        <div className="rounded-3xl bg-slate-950/60 border border-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">Total Units</p>
          <p className="text-2xl font-semibold text-purple-400">{(summary?.totalUnits || 0).toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  )
}
