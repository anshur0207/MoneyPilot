import { motion } from 'framer-motion'
import { RefreshCw, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '../../hooks/useMutation'

export default function MutualFundCard({ fund, onSelect, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false)
  const { mutate: deleteFund, loading: deleting } = useMutation(`/api/mutual-funds/${fund._id}`, 'DELETE')
  const gainPercentage = fund.investedAmount > 0 
    ? ((fund.currentValue - fund.investedAmount) / fund.investedAmount) * 100 
    : 0

  const getLastUpdateTime = () => {
    if (!fund.lastUpdated) return 'Last updated: Never'
    
    const lastUpdate = new Date(fund.lastUpdated)
    const now = new Date()
    const diffMs = now - lastUpdate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return lastUpdate.toLocaleDateString()
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete ${fund.name}?`)) {
      try {
        await deleteFund({})
        onDelete()
      } catch (error) {
        alert('Error deleting fund')
      }
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onSelect(fund)}
      className="cursor-pointer rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500/50 p-6 pt-12 transition-all relative overflow-hidden"
    >
      {/* Live Indicator & Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {showActions ? (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(fund)
              }}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              disabled={deleting}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-500/50 rounded-full px-2.5 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Live</span>
          </div>
        )}
      </div>

      <div className="mb-4 pr-10">
        <h3 className="text-lg font-bold text-white truncate">{fund.name}</h3>
        <p className="text-sm text-gray-400">{fund.fundHouse}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Units</span>
          <span className="font-semibold text-white">{fund.units?.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Current NAV</span>
          <div className="text-right">
            <span className="font-semibold text-cyan-400 text-lg">₹{fund.currentNAV?.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 flex justify-between">
          <span className="text-gray-400">Current Value</span>
          <span className="font-bold text-white">₹{fund.currentValue?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Gain/Loss</span>
          <span className={`font-bold ${gainPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%
          </span>
        </div>

        {fund.monthlyContribution > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Monthly SIP</span>
            <span className="font-semibold text-purple-300">₹{fund.monthlyContribution.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}

        {fund.nextSipDate && (
          <div className="flex justify-between">
            <span className="text-gray-400">Next SIP</span>
            <span className="font-semibold text-gray-200">{fund.nextSipDate}</span>
          </div>
        )}

        {fund.projectedNextSipValue && (
          <div className="flex justify-between">
            <span className="text-gray-400">Projected after SIP</span>
            <span className="font-semibold text-cyan-300">₹{fund.projectedNextSipValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400">XIRR</span>
          <span className={`font-bold ${typeof fund.xirr === 'number' ? (fund.xirr >= 0 ? 'text-green-400' : 'text-red-400') : 'text-gray-400'}`}>
            {typeof fund.xirr === 'number' ? `${fund.xirr.toFixed(2)}%` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" />
          {getLastUpdateTime()}
        </p>
      </div>
    </motion.div>
  )
}
