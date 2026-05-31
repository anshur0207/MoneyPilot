import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useMutation } from '../../hooks/useMutation'
import DateInput from '../DateInput'

const getNextSipDateFromStart = (startDate: string, monthlyContribution: number) => {
  if (!startDate || monthlyContribution <= 0) return null

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let candidate = new Date(start)

  while (candidate <= today) {
    candidate.setMonth(candidate.getMonth() + 1)
  }

  return candidate.toISOString().slice(0, 10)
}

export default function EditFundModal({ fund, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: fund.name,
    units: fund.units,
    purchaseNAV: fund.purchaseNAV,
    monthlyContribution: fund.monthlyContribution || 0,
    startDate: fund.startDate ? new Date(fund.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    category: fund.category || '',
    notes: fund.notes || '',
  })

  const { mutate: updateFund, loading } = useMutation(`/api/mutual-funds/update/${fund._id}`, 'PUT')

  const nextSipDate = useMemo(
    () => getNextSipDateFromStart(formData.startDate, formData.monthlyContribution),
    [formData.startDate, formData.monthlyContribution]
  )

  const handleSave = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedStart = new Date(formData.startDate)
    selectedStart.setHours(0, 0, 0, 0)
    if (selectedStart > today) {
      alert('Start date cannot be in the future.')
      return
    }

    try {
      await updateFund(formData)
      onSaved()
      onClose()
    } catch (error) {
      alert('Error updating fund')
      console.error(error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl bg-gray-900 border border-white/10 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Fund</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fund Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Units</label>
            <input
              type="number"
              step="0.01"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: parseFloat(e.target.value) })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Purchase NAV (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.purchaseNAV}
              onChange={(e) => setFormData({ ...formData, purchaseNAV: parseFloat(e.target.value) })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Monthly SIP Contribution (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: Number(e.target.value) || 0 })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none mb-3"
            />
          </div>

          <div>
            <DateInput
              label="SIP Start Date"
              max={new Date().toISOString().slice(0, 10)}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mb-3"
            />
            {nextSipDate && (
              <p className="text-xs text-gray-400">Next SIP date: {nextSipDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="e.g., Equity, Liquid, Gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              rows={3}
              placeholder="Add any notes about this investment"
            />
          </div>

          {formData.units && formData.purchaseNAV && (
            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-sm text-gray-400">
                Total Invested: ₹{(formData.units * formData.purchaseNAV).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 font-medium text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
