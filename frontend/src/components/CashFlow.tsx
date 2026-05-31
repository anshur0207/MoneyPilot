import { motion } from 'framer-motion'
import { formatCurrency } from '../utils/helpers'

interface CashFlowProps {
  income: number
  expenses: number
  remaining: number
}

export default function CashFlow({ income, expenses, remaining }: CashFlowProps) {
  // Calculate percentages for visual representation
  const totalCashIn = income
  const expensePercent = totalCashIn > 0 ? (expenses / totalCashIn) * 100 : 0
  const remainingPercent = totalCashIn > 0 ? (remaining / totalCashIn) * 100 : 0

  // Determine colors based on remaining balance
  let remainingColor = 'bg-emerald-500'
  let remainingTextColor = 'text-emerald-300'
  
  if (remaining < 0) {
    remainingColor = 'bg-red-500'
    remainingTextColor = 'text-red-300'
  } else if (remaining < income * 0.2) {
    remainingColor = 'bg-orange-500'
    remainingTextColor = 'text-orange-300'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-sm text-gray-400 mb-4">Monthly Cash Flow</h3>
      
      {/* Visual bar showing income breakdown */}
      <div className="mb-6">
        <div className="flex h-8 gap-1 rounded-lg overflow-hidden bg-white/5">
          {expenses > 0 && (
            <div
              className="bg-red-500/60 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${Math.max(expensePercent, 5)}%` }}
            >
              {expensePercent > 15 && `${Math.round(expensePercent)}%`}
            </div>
          )}
          {remaining > 0 && (
            <div
              className={`${remainingColor}/60 flex items-center justify-center text-xs font-bold text-white`}
              style={{ width: `${Math.max(remainingPercent, 5)}%` }}
            >
              {remainingPercent > 15 && `${Math.round(remainingPercent)}%`}
            </div>
          )}
        </div>
      </div>

      {/* Cash flow breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📥</span>
            <div>
              <p className="text-xs text-gray-400">Income</p>
              <p className="font-semibold text-white">{formatCurrency(income)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📤</span>
            <div>
              <p className="text-xs text-gray-400">Expenses</p>
              <p className="font-semibold text-white">{formatCurrency(expenses)}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {totalCashIn > 0 ? `${Math.round(expensePercent)}%` : '0%'}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-xs text-gray-400">Remaining</p>
              <p className={`font-bold ${remainingTextColor}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
          <div className={`text-xs font-semibold ${remainingTextColor}`}>
            {totalCashIn > 0 ? `${Math.round(remainingPercent)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 pt-3 border-t border-white/10">
        {remaining < 0 && (
          <p className="text-xs text-red-300">
            ⚠️ You're spending more than you earn. Review your expenses.
          </p>
        )}
        {remaining > 0 && remaining < income * 0.1 && (
          <p className="text-xs text-orange-300">
            ⚠️ Only {Math.round((remaining / income) * 100)}% of your income is left. Consider cutting expenses.
          </p>
        )}
        {remaining >= income * 0.3 && (
          <p className="text-xs text-emerald-300">
            ✅ Great! You're saving {Math.round((remaining / income) * 100)}% of your income.
          </p>
        )}
      </div>
    </motion.div>
  )
}
