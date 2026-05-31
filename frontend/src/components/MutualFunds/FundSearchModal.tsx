import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, AlertCircle } from 'lucide-react'
import api from '../../utils/api'
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

interface FundSearchModalProps {
  onClose: () => void
  onAdded: () => void
}

export default function FundSearchModal({ onClose, onAdded }: FundSearchModalProps) {
  const [schemeCode, setSchemeCode] = useState('')
  const [selectedFund, setSelectedFund] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [latestNAV, setLatestNAV] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    fundHouse: '',
    schemeCode: '',
    category: '',
    units: '',
    purchaseNAV: '',
    monthlyContribution: '',
    startDate: new Date().toISOString().slice(0, 10),
  })

  const nextSipDate = useMemo(
    () => getNextSipDateFromStart(formData.startDate, parseFloat(formData.monthlyContribution) || 0),
    [formData.startDate, formData.monthlyContribution]
  )

  const { mutate: add, loading: adding } = useMutation('/api/mutual-funds/add', 'POST')

  const handleSearch = async () => {
    if (!schemeCode.trim()) {
      setDetailsError('Please enter a scheme code.')
      return
    }

    setLoadingDetails(true)
    setDetailsError('')

    try {
      const response = await api.get(`/api/mutual-funds/fund-details/${schemeCode.trim()}`)
      const fund = response.data

      setSelectedFund(fund)
      setLatestNAV(fund.currentNAV)
      setFormData({
        name: fund.schemeName || '',
        fundHouse: fund.fundHouse || '',
        schemeCode: fund.schemeCode || schemeCode.trim(),
        category: fund.cachedCategory || '',
        units: '',
        purchaseNAV: '',
      })
    } catch (error: any) {
      console.error('Error fetching fund details:', error)
      setDetailsError(error?.response?.data?.message || 'Unable to fetch fund details. Check the scheme code.')
      setSelectedFund(null)
      setLatestNAV(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleAddFund = async () => {
    if (!formData.schemeCode.trim()) {
      alert('Scheme code is required.')
      return
    }
    if (!formData.units || !formData.purchaseNAV) {
      alert('Please enter units and purchase NAV.')
      return
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedStart = new Date(formData.startDate)
    selectedStart.setHours(0, 0, 0, 0)
    if (selectedStart > today) {
      alert('Start date cannot be in the future.')
      return
    }

    try {
      await add({
        name: formData.name,
        schemeCode: formData.schemeCode.trim(),
        category: formData.category,
        fundHouse: formData.fundHouse,
        investedAmount: parseFloat(formData.units) * parseFloat(formData.purchaseNAV),
        units: parseFloat(formData.units),
        purchaseNAV: parseFloat(formData.purchaseNAV),
        monthlyContribution: parseFloat(formData.monthlyContribution) || 0,
        startDate: formData.startDate,
      })
      onAdded()
      onClose()
    } catch (error) {
      console.error('Error adding fund:', error)
      alert('Error adding fund. Please try again.')
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
        className="w-full max-w-2xl rounded-3xl bg-gray-900 border border-white/10 p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Mutual Fund</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter scheme code and click Search"
              value={schemeCode}
              onChange={(e) => setSchemeCode(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-32 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={loadingDetails}
              className="absolute right-2 top-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {loadingDetails ? 'Searching…' : 'Search'}
            </button>
          </div>

          {detailsError && (
            <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-4 text-sm text-red-200">
              {detailsError}
            </div>
          )}

          {selectedFund && (
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-900/10 p-4 mt-4">
              <p className="text-sm text-gray-400">Scheme Code</p>
              <p className="font-semibold text-white mb-2">{selectedFund.schemeCode}</p>
              <p className="text-sm text-gray-400">Fund Name</p>
              <p className="font-semibold text-white mb-2">{selectedFund.schemeName}</p>
              <p className="text-sm text-gray-400">Current NAV</p>
              <p className="font-semibold text-cyan-300 text-xl">₹{selectedFund.currentNAV?.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">NAV date: {selectedFund.navDate}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Fund Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Fund House / AMC"
            value={formData.fundHouse}
            onChange={(e) => setFormData({ ...formData, fundHouse: e.target.value })}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Scheme Code"
            value={formData.schemeCode}
            onChange={(e) => setFormData({ ...formData, schemeCode: e.target.value })}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Category (e.g. Equity)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm font-medium text-gray-300 mb-3">Investment Details</p>
            <input
              type="number"
              step="0.01"
              placeholder="Units"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none mb-3"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Purchase NAV (₹)"
              value={formData.purchaseNAV}
              onChange={(e) => setFormData({ ...formData, purchaseNAV: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none mb-3"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Monthly SIP contribution (₹)"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none mb-3"
            />
            <DateInput
              label="SIP Start Date"
              max={new Date().toISOString().slice(0, 10)}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-0"
            />
            {nextSipDate && (
              <p className="text-xs text-gray-400 mt-2">Next SIP date: {nextSipDate}</p>
            )}

            {formData.units && formData.purchaseNAV && (
              <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400">
                  Total Invested: ₹{(parseFloat(formData.units) * parseFloat(formData.purchaseNAV)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
                {latestNAV && (
                  <p className="text-sm text-cyan-400 mt-2">
                    Current Value (Live): ₹{(parseFloat(formData.units) * latestNAV).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedFund(null)
              setLatestNAV(null)
              setDetailsError('')
              setFormData({
                name: '',
                fundHouse: '',
                schemeCode: '',
                category: '',
                units: '',
                purchaseNAV: '',
                monthlyContribution: '',
                startDate: new Date().toISOString().slice(0, 10),
              })
            }}
            className="flex-1 rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 font-medium text-white transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleAddFund}
            disabled={adding}
            className="flex-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Save Fund'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
