import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import { formatCurrency } from '../utils/helpers'

interface Report {
  _id: string
  month: number
  year: number
  totalIncome: number
  totalExpense: number
  totalInvestment: number
  netWorth: number
  savingsRate: number
  investmentGains: number
  recommendations: string[]
}

interface ReportsResponse {
  reports: Report[]
  analytics: {
    totalSpent: number
    totalInvested: number
    avgMonthlyExpense: number
    reportCount: number
  }
}

const monthName = (month: number) =>
  new Date(2026, month, 1).toLocaleDateString('en-IN', { month: 'long' })

export default function ReportsPage() {
  const { data, loading, error } = useFetch<ReportsResponse>('/api/reports/analytics')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-sm text-gray-400">Monthly analytics from MongoDB</p>
      </div>

      {error && <div className="text-red-300">Unable to load reports.</div>}
      {loading ? (
        <div className="text-gray-400">Loading reports...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card">
              <p className="text-sm text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(data?.analytics.totalSpent ?? 0)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-400">Total Invested</p>
              <p className="text-2xl font-bold">{formatCurrency(data?.analytics.totalInvested ?? 0)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-400">Avg Expense</p>
              <p className="text-2xl font-bold">{formatCurrency(data?.analytics.avgMonthlyExpense ?? 0)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {data?.reports.map((report) => (
              <div key={report._id} className="card space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {monthName(report.month)} {report.year}
                    </h2>
                    <p className="text-sm text-gray-400">Savings rate {Math.round(report.savingsRate)}%</p>
                  </div>
                  <p className="font-bold text-green-400">{formatCurrency(report.netWorth)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Expense</p>
                    <p className="font-semibold">{formatCurrency(report.totalExpense)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Investment</p>
                    <p className="font-semibold">{formatCurrency(report.totalInvestment)}</p>
                  </div>
                </div>
                {report.recommendations.length > 0 && (
                  <ul className="space-y-2 text-sm text-gray-300">
                    {report.recommendations.map((recommendation) => (
                      <li key={recommendation}>• {recommendation}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
