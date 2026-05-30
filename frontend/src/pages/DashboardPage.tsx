import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { TrendingUp, PlusCircle, ArrowUpRight, ArrowDownLeft, Target, Zap } from 'lucide-react'
import SummaryCard from '../components/SummaryCard'
import MonthSelector from '../components/MonthSelector'
import AppErrorScreen from '../components/AppErrorScreen'
import { useFetch } from '../hooks/useFetch'
import { formatCurrency } from '../utils/helpers'

interface DashboardResponse {
  user: {
    name: string
    email: string
  }
  currentMonth: number
  currentYear: number
  monthString: string
  summary: {
    netWorth: number
    savings: number
    investments: number
    loans: number
    monthlyIncome: number
    monthlyBurn: number
    monthlyRemaining: number
  }
  metrics: {
    healthScore: number | null
    savingsRate: number
    debtRatio: number
    investmentGains: number
    hasFinancialData: boolean
  }
  goals: {
    active: number
    completed: number
  }
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  
  const { data, loading, error, refetch } = useFetch<DashboardResponse>(
    `/api/dashboard/summary?month=${month}&year=${year}`
  )

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  if (loading) {
    return <AppErrorScreen type="loading" />
  }

  if (error) {
    return <AppErrorScreen type={error.type} onRetry={refetch} />
  }

  if (!data) {
    return <AppErrorScreen type="error" onRetry={refetch} />
  }

  const { user, summary, metrics, goals, monthString } = data

  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const current = new Date()
    return `${days[current.getDay()]}, ${current.getDate()} ${months[current.getMonth()]}`
  }

  const expensePercent = summary.monthlyIncome > 0 ? (summary.monthlyBurn / summary.monthlyIncome) * 100 : 0
  const incomePercent = 100 - expensePercent

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Main Content Area */}
      <div className="px-4 md:px-8 py-8 space-y-8">
        {/* Top Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow">Your financial overview for {monthString}</p>
              <div className="mt-3">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
                  Hello, {user.name.split(' ')[0]} 👋
                </h1>
                <p className="mt-2 text-gray-400">Here's your financial overview for {monthString}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MonthSelector 
                month={month} 
                year={year} 
                onMonthChange={handleMonthChange}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Main Content (70%) */}
          <div className="space-y-8">
            {/* Net Worth Card - Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-panel p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="data-label">Your Net Worth</p>
                  <h2 className="text-5xl md:text-6xl font-black text-white mt-3">
                    {formatCurrency(summary.netWorth)}
                  </h2>
                  <div className="flex items-center gap-2 mt-4">
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                    <p className="text-sm font-medium text-green-400">
                      {formatCurrency(metrics.investmentGains)} investment gains
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <button className="rounded-full bg-white/10 hover:bg-white/20 transition-smooth px-3 py-1.5 text-xs font-medium border border-white/10">
                    This Month
                  </button>
                </div>
              </div>
              
              {/* Mini Chart placeholder */}
              <div className="h-32 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Net Worth Trend</p>
                </div>
              </div>
            </motion.div>

            {/* Summary Mini Cards - 4 Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Health Score Card */}
              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="data-label">Health Score</p>
                    <p className="data-value">
                      {metrics.healthScore === null ? 'N/A' : `${metrics.healthScore}/100`}
                    </p>
                    <p className="text-xs text-orange-400 mt-2">Needs Improvement</p>
                  </div>
                  <div className="text-2xl">💜</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                    style={{ width: `${Math.min(100, metrics.healthScore ?? 0)}%` }}
                  />
                </div>
              </div>

              {/* Active Investments Card */}
              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="data-label">Active Investments</p>
                    <p className="data-value">{formatCurrency(summary.investments)}</p>
                    <p className="text-xs text-green-400 mt-2">▲ 8.5%</p>
                  </div>
                  <div className="text-2xl">📈</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Total Loans Card */}
              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="data-label">Total Loans</p>
                    <p className="data-value">{formatCurrency(summary.loans)}</p>
                    <p className="text-xs text-orange-400 mt-2">▲ 2.1%</p>
                  </div>
                  <div className="text-2xl">💳</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Goals Progress Card */}
              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="data-label">Goals Progress</p>
                    <p className="data-value">{goals.completed}/{goals.active + goals.completed}</p>
                    <p className="text-xs text-blue-400 mt-2">42%</p>
                  </div>
                  <div className="text-2xl">🎯</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '42%' }} />
                </div>
              </div>
            </motion.div>

            {/* Monthly Cash Flow Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-panel p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Monthly Cash Flow</h3>
                <button className="rounded-full bg-white/10 hover:bg-white/20 transition-smooth px-3 py-1.5 text-xs font-medium border border-white/10">
                  This Month
                </button>
              </div>

              {/* Donut Chart Layout */}
              <div className="flex items-center justify-between gap-8">
                {/* Expense Side */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <div>
                      <p className="text-sm text-gray-400">Expenses</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(summary.monthlyBurn)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{expensePercent.toFixed(0)}% of income</p>
                </div>

                {/* Center Donut Chart */}
                <div className="flex-1 flex justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                      {/* Expense segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#expenseGradient)"
                        strokeWidth="12"
                        strokeDasharray={`${(expensePercent / 100) * 251.2} 251.2`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                      {/* Income segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#incomeGradient)"
                        strokeWidth="12"
                        strokeDasharray={`${(incomePercent / 100) * 251.2} 251.2`}
                        strokeDashoffset={`-${(expensePercent / 100) * 251.2}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff4444" />
                          <stop offset="100%" stopColor="#ff8844" />
                        </linearGradient>
                        <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-xs text-gray-400">Cash Flow</p>
                      <p className="text-xl font-bold text-white">{expensePercent.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                {/* Income Side */}
                <div className="flex-1 space-y-3 text-right">
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <p className="text-sm text-gray-400">Income</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(summary.monthlyIncome)}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">{incomePercent.toFixed(0)}% of income</p>
                </div>
              </div>

              {/* Insight */}
              <div className="mt-8 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/20 p-4">
                <p className="text-sm text-green-300">
                  ✨ You spent {formatCurrency(Math.abs(summary.monthlyRemaining))} less than last month 🎉
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar (30%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Monthly Summary Title */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Monthly Summary</h3>
              <p className="text-xs text-gray-400">May 2026</p>
            </div>

            {/* Monthly Income Card */}
            <div className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="data-label">Monthly Income</p>
                  <p className="text-2xl font-bold text-white mt-1">{formatCurrency(summary.monthlyIncome)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600/30 to-green-400/20 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: '52%' }} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">52% of total</span>
              </div>
            </div>

            {/* Total Expenses Card */}
            <div className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="data-label">Total Expenses</p>
                  <p className="text-2xl font-bold text-white mt-1">{formatCurrency(summary.monthlyBurn)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600/30 to-red-400/20 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: '48%' }} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">48% of total</span>
              </div>
            </div>

            {/* Remaining Amount Card */}
            <div className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="data-label">Remaining Amount</p>
                  <p className="text-2xl font-bold text-white mt-1">{formatCurrency(summary.monthlyRemaining)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-400/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '52%' }} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">52% of total</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/expenses?new=1')}
                  className="flex flex-col items-center justify-center gap-2 rounded-3xl py-6 px-4 border border-white/15 bg-gradient-to-br from-purple-600/15 to-purple-500/5 hover:border-purple-400/40 hover:from-purple-600/25 hover:to-purple-500/15 transition-all"
                >
                  <PlusCircle className="w-5 h-5 text-purple-300" />
                  <span className="text-xs font-medium text-gray-300">Add Expense</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/expenses')}
                  className="flex flex-col items-center justify-center gap-2 rounded-3xl py-6 px-4 border border-white/15 bg-gradient-to-br from-blue-600/15 to-blue-500/5 hover:border-blue-400/40 hover:from-blue-600/25 hover:to-blue-500/15 transition-all"
                >
                  <ArrowDownLeft className="w-5 h-5 text-blue-300" />
                  <span className="text-xs font-medium text-gray-300">Add Income</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/mutual-funds')}
                  className="flex flex-col items-center justify-center gap-2 rounded-3xl py-6 px-4 border border-cyan-500/40 bg-gradient-to-br from-cyan-600/20 to-cyan-500/5 hover:border-cyan-400/60 hover:from-cyan-600/30 hover:to-cyan-500/15 transition-all"
                >
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                  <span className="text-xs font-medium text-cyan-200">Mutual Funds</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/goals')}
                  className="flex flex-col items-center justify-center gap-2 rounded-3xl py-6 px-4 border border-white/15 bg-gradient-to-br from-amber-600/15 to-amber-500/5 hover:border-amber-400/40 hover:from-amber-600/25 hover:to-amber-500/15 transition-all"
                >
                  <Target className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-medium text-gray-300">Add Goal</span>
                </motion.button>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="premium-panel p-4 mt-6 text-center border-purple-400/20 bg-gradient-to-br from-purple-600/20 to-purple-500/10">
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="font-semibold text-white mb-2">AI Assistant</h4>
              <p className="text-xs text-gray-400 mb-4">Get personalized insights to improve your finances.</p>
              <button className="w-full py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600/50 to-blue-500/50 hover:from-purple-600/70 hover:to-blue-500/70 transition-smooth border border-purple-400/20">
                Chat Now →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
