import { motion } from 'framer-motion'
import { useState } from 'react'
import HealthScoreCard from '../components/HealthScoreCard'
import MonthSelector from '../components/MonthSelector'
import { useFetch } from '../hooks/useFetch'

interface HealthScoreResponse {
  score: number | null
  status: string
  statusColor: string
  month: number
  year: number
  monthString: string
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
  message?: string
}

export default function HealthScorePage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [refreshKey, setRefreshKey] = useState(0)
  
  const { data, loading, error } = useFetch<HealthScoreResponse>(
    `/api/dashboard/health-score?month=${month}&year=${year}&t=${refreshKey}`
  )

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="page-shell">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 mb-4">
        <p className="eyebrow">Financial Health Analysis</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-black tracking-tight text-white">Health Score</h1>
          <div className="flex items-center gap-3">
            <MonthSelector 
              month={month} 
              year={year} 
              onMonthChange={handleMonthChange}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all"
            >
              {loading ? 'Calculating...' : 'Calculate Score'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {error && (
          <motion.div
            variants={item}
            className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
          >
            <p className="text-sm text-red-300">
              Unable to load health score. Please try again.
            </p>
          </motion.div>
        )}

        {!data && !error && loading && (
          <motion.div variants={item} className="text-center py-12">
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-purple-500 border-t-blue-500 rounded-full"
              />
            </div>
            <p className="text-gray-400 mt-4">Analyzing your financial health...</p>
          </motion.div>
        )}

        {data && (
          <motion.div variants={item}>
            <HealthScoreCard data={data} loading={loading} onRefresh={handleRefresh} />
          </motion.div>
        )}

        {data && data.score === null && (
          <motion.div
            variants={item}
            className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-6"
          >
            <p className="text-center text-blue-300 mb-4">{data.message}</p>
            <div className="flex gap-3 justify-center">
              <a
                href="/expenses?new=1"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Add Expense
              </a>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Educational Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm"
      >
        <h2 className="text-lg font-bold text-white mb-4">Understanding Your Score</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ScoreRangeItem
            range="0-40"
            status="Poor"
            color="red"
            description="Your financial health needs immediate attention. Focus on increasing savings and reducing debt."
          />
          <ScoreRangeItem
            range="41-60"
            status="Average"
            color="orange"
            description="You have a foundation but room to improve. Work on savings rate and debt reduction."
          />
          <ScoreRangeItem
            range="61-75"
            status="Good"
            color="yellow"
            description="Good financial habits! Continue building your emergency fund and investments."
          />
          <ScoreRangeItem
            range="76-90"
            status="Strong"
            color="emerald"
            description="Excellent financial position. Focus on optimizing your investments for growth."
          />
          <ScoreRangeItem
            range="91-100"
            status="Excellent"
            color="purple"
            description="Outstanding financial health! You're a financial role model. Keep maintaining these habits."
          />
        </div>
      </motion.div>

      {/* Scoring Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm"
      >
        <h2 className="text-lg font-bold text-white mb-4">Scoring Factors</h2>
        <div className="space-y-3">
          <FactorItem factor="Savings Ratio" points="20" description="Monthly savings as % of income" />
          <FactorItem factor="Debt-to-Income" points="20" description="Total EMI as % of income" />
          <FactorItem factor="Investment Discipline" points="15" description="SIP consistency and diversification" />
          <FactorItem factor="Emergency Fund" points="15" description="Months of expenses in savings" />
          <FactorItem factor="Expense Control" points="15" description="Spending patterns and discipline" />
          <FactorItem factor="Investment Balance" points="5" description="Idle cash vs investments ratio" />
          <FactorItem factor="Income Stability" points="5" description="Single vs multiple income sources" />
          <FactorItem factor="Goal Progress" points="5" description="Active goals and completion rate" />
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6"
      >
        <h2 className="text-lg font-bold text-emerald-300 mb-4">💡 Tips to Improve Your Score</h2>
        <ul className="space-y-2">
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Increase your savings rate to at least 20% of your income</span>
          </li>
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Maintain emergency fund worth 6 months of expenses</span>
          </li>
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Start systematic investment plans (SIPs) for consistent growth</span>
          </li>
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Keep debt-to-income ratio below 20% for optimal health</span>
          </li>
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Track and control discretionary spending habits</span>
          </li>
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Diversify your investments across different asset classes</span>
          </li>
          <li className="text-sm text-emerald-200 flex items-start gap-3">
            <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
            <span>Set and actively track financial goals</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

function ScoreRangeItem({
  range,
  status,
  color,
  description,
}: {
  range: string
  status: string
  color: string
  description: string
}) {
  const colorMap: Record<string, string> = {
    red: 'border-red-500/20 bg-red-500/10 text-red-300',
    orange: 'border-orange-500/20 bg-orange-500/10 text-orange-300',
    yellow: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    purple: 'border-purple-500/20 bg-purple-500/10 text-purple-300',
  }

  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      <p className="text-xs font-semibold mb-1">{range}</p>
      <p className="text-sm font-bold mb-2">{status}</p>
      <p className="text-xs opacity-90">{description}</p>
    </div>
  )
}

function FactorItem({ factor, points, description }: { factor: string; points: string; description: string }) {
  return (
    <div className="flex items-start justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
      <div>
        <p className="text-sm font-semibold text-white">{factor}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <span className="text-sm font-bold text-purple-400 whitespace-nowrap ml-4">{points}pts</span>
    </div>
  )
}
