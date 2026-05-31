import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'

interface IncomeCardProps {
  monthlyIncome: number
  onRefresh: () => void
  month: number
  year: number
}

export default function IncomeCard({ monthlyIncome, onRefresh, month, year }: IncomeCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [amount, setAmount] = useState(String(monthlyIncome))
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert('Please enter a valid amount')
      return
    }

    setIsSaving(true)
    try {
      // First, delete any existing income entries for this month
      const response = await api.get(`/api/income?month=${month}&year=${year}`)
      const existingIncomes = response.data.incomes || []
      
      // Delete existing entries
      for (const income of existingIncomes) {
        if (income._id) {
          await api.delete(`/api/income/${income._id}`)
        }
      }

      // Add new income entry
      await api.post('/api/income', {
        amount: Number(amount),
        month,
        year,
        type: 'salary',
        description: `Monthly salary for ${new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
      })

      setIsEditing(false)
      onRefresh()
    } catch (error) {
      console.error('Error saving income:', error)
      alert('Failed to save income')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Monthly Income</p>
          {isEditing ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-300">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32 rounded-lg border border-[#444] bg-[#151515] px-3 py-2 text-white font-bold"
                autoFocus
              />
            </div>
          ) : (
            <p className="mt-2 text-3xl font-bold text-white">
              ₹{Number(monthlyIncome).toLocaleString('en-IN')}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 text-sm font-semibold hover:bg-green-500/30 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setAmount(String(monthlyIncome))
                }}
                className="px-4 py-2 rounded-lg bg-gray-500/20 text-gray-300 text-sm font-semibold hover:bg-gray-500/30"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-accent/20 text-accent text-sm font-semibold hover:bg-accent/30"
            >
              {monthlyIncome === 0 ? 'Add' : 'Edit'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
