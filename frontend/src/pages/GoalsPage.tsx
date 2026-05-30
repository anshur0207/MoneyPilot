import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit2, Target } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { calculatePercentage, formatCurrency, formatDate } from '../utils/helpers'
import AppErrorScreen from '../components/AppErrorScreen'
import api from '../utils/api'

interface Goal {
  _id: string
  name: string
  description: string
  category: string
  targetAmount: number
  savedAmount: number
  deadline: string
  priority: string
  status: string
}

interface GoalsResponse { goals: Goal[]; total: number }

const blank = {
  name: '',
  description: '',
  category: 'Emergency Fund',
  targetAmount: '',
  savedAmount: '0',
  deadline: new Date().toISOString().slice(0, 10),
  priority: 'Medium',
  status: 'Active',
}

export default function GoalsPage() {
  const { data, loading, error, refetch } = useFetch<GoalsResponse>('/api/goals')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const payload = {
      ...form,
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount),
    }
    if (editingId) await api.put(`/api/goals/${editingId}`, payload)
    else await api.post('/api/goals', payload)
    setForm(blank)
    setEditingId(null)
    setShowForm(false)
    await refetch()
  }

  const edit = (goal: Goal) => {
    setEditingId(goal._id)
    setShowForm(true)
    setForm({
      name: goal.name,
      description: goal.description,
      category: goal.category,
      targetAmount: String(goal.targetAmount),
      savedAmount: String(goal.savedAmount),
      deadline: goal.deadline.slice(0, 10),
      priority: goal.priority,
      status: goal.status,
    })
  }

  const remove = async (id: string) => {
    await api.delete(`/api/goals/${id}`)
    await refetch()
  }

  if (loading) return <AppErrorScreen type="loading" />
  if (error) return <AppErrorScreen type={error.type} onRetry={refetch} />

  const activeGoals = data?.goals.filter(g => g.status === 'Active').length ?? 0
  const completedGoals = data?.goals.filter(g => g.status === 'Completed').length ?? 0
  const totalSaved = data?.goals.reduce((sum, g) => sum + g.savedAmount, 0) ?? 0
  const totalTarget = data?.goals.reduce((sum, g) => sum + g.targetAmount, 0) ?? 0

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
            <p className="eyebrow">Aspirations</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mt-3">
              🎯 Goals
            </h1>
            <p className="text-gray-400 mt-2">{data?.goals.length ?? 0} goals being tracked</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setEditingId(null)
              setShowForm((v) => !v)
            }}
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Close' : 'Add Goal'}
          </motion.button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="stat-card">
            <p className="data-label">Active Goals</p>
            <p className="data-value">{activeGoals}</p>
            <p className="text-xs text-gray-500 mt-3">Currently tracking</p>
          </div>
          <div className="stat-card">
            <p className="data-label">Completed</p>
            <p className="data-value">{completedGoals}</p>
            <p className="text-xs text-green-400 mt-3">Milestone reached</p>
          </div>
          <div className="stat-card">
            <p className="data-label">Total Saved</p>
            <p className="data-value">{formatCurrency(totalSaved)}</p>
            <p className="text-xs text-gray-500 mt-3">Of {formatCurrency(totalTarget)}</p>
          </div>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={save}
            className="premium-panel p-8 space-y-6"
          >
            <h3 className="text-xl font-bold text-white">
              {editingId ? 'Edit Goal' : 'Create New Goal'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Goal Name</span>
                <input
                  className="field"
                  placeholder="e.g., Buy a Car"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Category</span>
                <select
                  className="field appearance-none"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {['Marriage', 'Travel', 'Vehicle', 'Education', 'Home', 'Emergency Fund', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Target Amount</span>
                <input
                  className="field"
                  type="number"
                  placeholder="0.00"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Amount Saved</span>
                <input
                  className="field"
                  type="number"
                  placeholder="0.00"
                  value={form.savedAmount}
                  onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Deadline</span>
                <input
                  className="field"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-300">Priority</span>
                <select
                  className="field appearance-none"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {['Low', 'Medium', 'High'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-300">Description</span>
              <input
                className="field"
                placeholder="Add notes about this goal..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary flex-1"
              >
                {editingId ? '✏️ Update' : '💾 Save'}
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

        {/* Goals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showForm ? 0.2 : 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-white">Your Goals</h3>
          {data?.goals && data.goals.length > 0 ? (
            data.goals.map((goal, index) => {
              const progress = Math.min(100, Math.round(calculatePercentage(goal.savedAmount, goal.targetAmount)))
              const statusColor = goal.status === 'Completed' ? 'text-green-400' : goal.status === 'Abandoned' ? 'text-red-400' : 'text-blue-400'

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="stat-card space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-3xl">🎯</div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{goal.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                            {goal.category}
                          </span>
                          <span className={`text-xs font-medium ${statusColor}`}>
                            {goal.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {goal.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-smooth text-blue-400"
                        onClick={() => edit(goal)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-smooth text-red-400"
                        onClick={() => remove(goal._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}</span>
                      <span className="font-semibold text-white">{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Deadline: {formatDate(goal.deadline)}</span>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="premium-panel p-12 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <p className="text-gray-400">No goals yet</p>
              <p className="text-gray-500 text-sm mt-2">Start by adding your first financial goal</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
