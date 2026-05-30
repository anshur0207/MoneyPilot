import { FormEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Trash2, Edit2, Plus, ChevronDown } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { useMutation } from '../hooks/useMutation'
import MonthSelector from '../components/MonthSelector'
import AppErrorScreen from '../components/AppErrorScreen'
import { formatCurrency, formatDate } from '../utils/helpers'
import api from '../utils/api'

interface Expense {
  _id: string
  amount: number
  category: string
  description: string
  date: string
  paymentMethod: string
}

interface ExpensesResponse {
  expenses: Expense[]
  total: number
}

interface ExpenseAnalytics {
  totalExpense: number
  categoryBreakdown: Record<string, number>
  expenseCount: number
  averageExpense: number
}

const categories = ['Food', 'Travel', 'Fuel', 'Shopping', 'EMI', 'Rent', 'Family', 'Subscriptions', 'Entertainment', 'Other']
const paymentMethods = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other']
const categoryEmojis: Record<string, string> = {
  'Food': '🍔',
  'Travel': '🚗',
  'Fuel': '⛽',
  'Shopping': '🛍️',
  'EMI': '🏠',
  'Rent': '🏢',
  'Family': '👨‍👩‍👧‍👦',
  'Subscriptions': '📺',
  'Entertainment': '🎬',
  'Other': '📌'
}

export default function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'UPI',
    notes: '',
  })

  const { data, loading, error, refetch } = useFetch<ExpensesResponse>(
    `/api/expenses?month=${month}&year=${year}`
  )
  const { data: analytics, refetch: refetchAnalytics } = useFetch<ExpenseAnalytics>(
    `/api/expenses/analytics?month=${month}&year=${year}`
  )
  const { mutate, loading: saving } = useMutation('/api/expenses')

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
    setEditingId(null)
    setShowForm(false)
  }

  const total = useMemo(
    () => data?.expenses.reduce((sum, expense) => sum + expense.amount, 0) ?? 0,
    [data]
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const payload = {
      ...form,
      amount: Number(form.amount),
    }
    if (editingId) {
      await api.put(`/api/expenses/${editingId}`, payload)
    } else {
      await mutate(payload)
    }
    setForm({
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'UPI',
      notes: '',
    })
    setEditingId(null)
    setShowForm(false)
    setSearchParams({})
    await Promise.all([refetch(), refetchAnalytics()])
  }

  const startEdit = (expense: Expense) => {
    setEditingId(expense._id)
    setShowForm(true)
    setForm({
      amount: String(expense.amount),
      category: expense.category,
      description: expense.description,
      date: expense.date.slice(0, 10),
      paymentMethod: expense.paymentMethod,
      notes: '',
    })
  }

  const deleteExpense = async (id: string) => {
    await api.delete(`/api/expenses/${id}`)
    await Promise.all([refetch(), refetchAnalytics()])
  }

  if (loading) {
    return <AppErrorScreen type="loading" />
  }

  if (error) {
    return <AppErrorScreen type={error.type} onRetry={refetch} />
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <p className="eyebrow">Financial tracking</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mt-3">
              💸 Expenses
            </h1>
            <p className="text-gray-400 mt-2">{data?.total ?? 0} transactions tracked</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setEditingId(null)
              setShowForm((value) => !value)
            }}
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Close' : 'Add Expense'}
          </motion.button>
        </motion.div>

        {/* Month Selector */}
        <MonthSelector month={month} year={year} onMonthChange={handleMonthChange} />

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="stat-card">
            <p className="data-label">Total Expenses</p>
            <p className="data-value">{formatCurrency(total)}</p>
            <p className="text-xs text-gray-500 mt-3">All time</p>
          </div>
          <div className="stat-card">
            <p className="data-label">This Month</p>
            <p className="data-value">{formatCurrency(analytics?.totalExpense ?? 0)}</p>
            <p className="text-xs text-gray-500 mt-3">{analytics?.expenseCount ?? 0} transactions</p>
          </div>
          <div className="stat-card">
            <p className="data-label">Average</p>
            <p className="data-value">{formatCurrency(Math.round(analytics?.averageExpense ?? 0))}</p>
            <p className="text-xs text-gray-500 mt-3">Per transaction</p>
          </div>
        </motion.div>

        {/* Add Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="premium-panel p-8 space-y-6"
          >
            <h3 className="text-xl font-bold text-white">
              {editingId ? 'Edit Expense' : 'Add New Expense'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Amount</span>
                <input
                  className="field"
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  placeholder="0.00"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Date</span>
                <input
                  className="field"
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Category</span>
                <select
                  className="field appearance-none"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Payment Method</span>
                <select
                  className="field appearance-none"
                  value={form.paymentMethod}
                  onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-300">Description</span>
              <input
                className="field"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="What was this expense for?"
                required
              />
            </label>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary flex-1"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : editingId ? '✏️ Update Expense' : '💾 Save Expense'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="btn-secondary flex-1"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showForm ? 0.2 : 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          {data?.expenses && data.expenses.length > 0 ? (
            data.expenses.map((expense, index) => (
              <motion.div
                key={expense._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="stat-card flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">
                    {categoryEmojis[expense.category] || '💰'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                        {expense.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {expense.paymentMethod}
                      </span>
                      <span className="text-xs text-gray-600">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="font-bold text-white">{formatCurrency(expense.amount)}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-smooth text-blue-400"
                      onClick={() => startEdit(expense)}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-smooth text-red-400"
                      onClick={() => deleteExpense(expense._id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="premium-panel p-12 text-center">
              <p className="text-3xl mb-3">💸</p>
              <p className="text-gray-400">No expenses recorded yet</p>
              <p className="text-gray-500 text-sm mt-2">Click "Add Expense" to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
