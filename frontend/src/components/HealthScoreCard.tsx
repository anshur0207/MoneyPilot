import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface HealthScoreData {
  score: number | null
  status: string
  statusColor: string
  scoreBreakdown: Record<string, { score: number; maxScore: number; label: string }>
  metrics: {
    monthlyIncome: number
    monthlyInvestment: number
    monthlyEMI: number
    savingsRatio: number | string
    debtRatio: number | string
    emergencyFundMonths: number | string
    currentMonthExpenses: number
    previousMonthExpenses: number
    totalInvestmentValue: number
    totalInvestedAmount: number
  }
  strengths: string[]
  improvements: string[]
  insights: string[]
}

interface HealthScoreCardProps {
  data: HealthScoreData | null
  loading?: boolean
  onRefresh?: () => void
}

const getScoreGradient = (score: number | null) => {
  if (score === null) return 'from-gray-500 to-gray-600'
  if (score < 40) return 'from-red-500 to-red-600'
  if (score < 61) return 'from-orange-500 to-orange-600'
  if (score < 76) return 'from-yellow-500 to-yellow-600'
  if (score < 91) return 'from-emerald-500 to-emerald-600'
  return 'from-purple-500 to-purple-600'
}

const getScoreBgGradient = (score: number | null) => {
  if (score === null) return 'from-gray-500/20 to-gray-600/20'
  if (score < 40) return 'from-red-500/20 to-red-600/20'
  if (score < 61) return 'from-orange-500/20 to-orange-600/20'
  if (score < 76) return 'from-yellow-500/20 to-yellow-600/20'
  if (score < 91) return 'from-emerald-500/20 to-emerald-600/20'
  return 'from-purple-500/20 to-purple-600/20'
}

export default function HealthScoreCard({ data, loading = false, onRefresh }: HealthScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (data?.score !== null && data?.score !== undefined) {
      // Animate score from 0 to final value
      let current = 0
      const target = data.score
      const increment = target / 30 // Animate over 30 frames

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setDisplayScore(target)
          clearInterval(timer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [data?.score])

  const score = data?.score ?? null
  const status = data?.status ?? 'Not Calculated'

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${getScoreBgGradient(score)} p-6 backdrop-blur-xl`}
      >
        <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_240px] md:items-center">
          {/* Score Text Info */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Financial Health Score</p>
            <p className="text-gray-400 text-sm max-w-md">
              {loading
                ? 'Analyzing your financial health...'
                : score === null
                ? 'Add financial data to calculate your personalized health score'
                : `Your score indicates a ${status.toLowerCase()} financial position. Keep building on your strengths!`}
            </p>
          </div>

          {/* Circular Score Indicator */}
          <motion.div
            className="relative h-[180px] w-[180px] mx-auto"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 282.74 }}
                animate={{ strokeDashoffset: score === null ? 282.74 : 282.74 * (1 - displayScore / 100) }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                strokeDasharray="282.74"
              />
              <defs>
                <linearGradient
                  id="scoreGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={getScoreColor(score, 'start')} />
                  <stop offset="100%" stopColor={getScoreColor(score, 'end')} />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <motion.div
                  className={`text-4xl font-black bg-gradient-to-br ${getScoreGradient(score)} bg-clip-text text-transparent`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {loading ? '—' : displayScore}
                </motion.div>
                <div className="text-xs font-medium text-gray-400">/ 100</div>
                <motion.div
                  className={`mt-2 text-xs font-semibold ${getStatusTextColor(score)}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {status}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="mt-4 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {loading ? 'Calculating...' : 'Refresh Score'}
          </motion.button>
        )}
      </motion.div>

      {/* Score Breakdown */}
      {data?.scoreBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm"
        >
          <h4 className="text-sm font-semibold text-white mb-3">Score Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(data.scoreBreakdown).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 rounded-full bg-white/10">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-300">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Metrics */}
      {data?.metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-2 gap-2"
        >
          <MetricCard label="Monthly Income" value={`₹${formatNumber(data.metrics.monthlyIncome)}`} />
          <MetricCard label="Monthly Investment" value={`₹${formatNumber(data.metrics.monthlyInvestment)}`} />
          <MetricCard label="Savings Ratio" value={`${data.metrics.savingsRatio}%`} />
          <MetricCard label="Debt Ratio" value={`${data.metrics.debtRatio}%`} />
          <MetricCard label="Emergency Fund" value={`${data.metrics.emergencyFundMonths} months`} />
          <MetricCard label="Current Month Expenses" value={`₹${formatNumber(data.metrics.currentMonthExpenses)}`} />
        </motion.div>
      )}

      {/* Strengths */}
      {data?.strengths && data.strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
        >
          <h4 className="text-sm font-semibold text-emerald-300 mb-2">💪 Your Strengths</h4>
          <ul className="space-y-1">
            {data.strengths.map((strength, idx) => (
              <li key={idx} className="text-xs text-emerald-200 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Improvements */}
      {data?.improvements && data.improvements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4"
        >
          <h4 className="text-sm font-semibold text-orange-300 mb-2">📈 Areas to Improve</h4>
          <ul className="space-y-1">
            {data.improvements.map((improvement, idx) => (
              <li key={idx} className="text-xs text-orange-200 flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* AI Insights */}
      {data?.insights && data.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4"
        >
          <h4 className="text-sm font-semibold text-blue-300 mb-2">🤖 AI Insights</h4>
          <div className="space-y-2">
            {data.insights.map((insight, idx) => (
              <p key={idx} className="text-xs text-blue-200">{insight}</p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3 backdrop-blur-sm">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

function getScoreColor(score: number | null, position: 'start' | 'end'): string {
  if (score === null) return position === 'start' ? '#666666' : '#555555'
  if (score < 40) return position === 'start' ? '#ef4444' : '#dc2626'
  if (score < 61) return position === 'start' ? '#f97316' : '#ea580c'
  if (score < 76) return position === 'start' ? '#eab308' : '#ca8a04'
  if (score < 91) return position === 'start' ? '#10b981' : '#059669'
  return position === 'start' ? '#a855f7' : '#9333ea'
}

function getStatusTextColor(score: number | null): string {
  if (score === null) return 'text-gray-400'
  if (score < 40) return 'text-red-400'
  if (score < 61) return 'text-orange-400'
  if (score < 76) return 'text-yellow-400'
  if (score < 91) return 'text-emerald-400'
  return 'text-purple-400'
}
