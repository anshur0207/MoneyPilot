import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PortfolioCharts from '../components/MutualFunds/PortfolioCharts'

export default function MutualFundDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: fundData, loading, error } = useFetch(`/api/mutual-funds/${id}`)

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error || !fundData) {
    return (
      <div className="p-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
        <div className="rounded-2xl bg-red-900/20 border border-red-500/50 p-4 text-red-300">
          {error?.message || 'Fund not found'}
        </div>
      </div>
    )
  }

  const investment = fundData.investment
  const chartData = fundData.chartData

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95 backdrop-blur-2xl">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          <div>
            <h1 className="text-4xl font-bold text-white">{investment?.name}</h1>
            <p className="mt-2 text-gray-400">{investment?.fundHouse}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Performance Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-500/5 border border-blue-500/20 p-6">
            <p className="text-gray-400 text-sm">Current Value</p>
            <p className="text-3xl font-bold text-white mt-2">₹{investment?.currentValue?.toLocaleString()}</p>
          </motion.div>

          <motion.div className="rounded-2xl bg-gradient-to-br from-green-600/20 to-green-500/5 border border-green-500/20 p-6">
            <p className="text-gray-400 text-sm">Total Gain</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              ₹{(investment?.currentValue - investment?.investedAmount)?.toLocaleString()}
            </p>
          </motion.div>

          <motion.div className="rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-500/5 border border-purple-500/20 p-6">
            <p className="text-gray-400 text-sm">Units</p>
            <p className="text-3xl font-bold text-purple-400 mt-2">{investment?.units?.toFixed(2)}</p>
          </motion.div>

          <motion.div className="rounded-2xl bg-gradient-to-br from-cyan-600/20 to-cyan-500/5 border border-cyan-500/20 p-6">
            <p className="text-gray-400 text-sm">Current NAV</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">₹{investment?.currentNAV?.toFixed(2)}</p>
          </motion.div>
        </div>

        {/* Historical Chart */}
        {chartData && chartData.length > 0 && (
          <motion.div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 p-6">
            <h2 className="text-xl font-bold mb-6">Performance History</h2>
            <PortfolioCharts investments={[{ ...investment, historicalNAVs: chartData }]} />
          </motion.div>
        )}

        {/* Investment Details */}
        <motion.div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 p-6">
          <h2 className="text-xl font-bold mb-6">Investment Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-gray-400 text-sm">Invested Amount</p>
              <p className="text-2xl font-bold text-white">₹{investment?.investedAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Gain/Loss %</p>
              <p className="text-2xl font-bold text-white">
                {(((investment?.currentValue - investment?.investedAmount) / investment?.investedAmount) * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Purchase NAV</p>
              <p className="text-2xl font-bold text-white">₹{investment?.purchaseNAV?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Category</p>
              <p className="text-2xl font-bold text-white">{investment?.category}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
