import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, RefreshCw } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { useMutation } from '../hooks/useMutation'
import PortfolioSummary from '../components/MutualFunds/PortfolioSummary'
import MutualFundCard from '../components/MutualFunds/MutualFundCard'
import FundSearchModal from '../components/MutualFunds/FundSearchModal'
import EditFundModal from '../components/MutualFunds/EditFundModal'
import InsightsSection from '../components/MutualFunds/InsightsSection'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function MutualFundsPage() {
  const { data: portfolio, loading, error, refetch } = useFetch<any>('/api/mutual-funds/portfolio')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFund, setEditingFund] = useState<any>(null)
  const [selectedFund, setSelectedFund] = useState<any>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  const { mutate: updateNAVs, loading: updatingNAVs } = useMutation('/api/mutual-funds/update-all-navs', 'POST')

  useEffect(() => {
    console.log('📊 Portfolio Data:', portfolio)
    console.log('📊 Loading:', loading)
    console.log('📊 Error:', error)
  }, [portfolio, loading, error])

  const handleUpdateNAVs = useCallback(async () => {
    try {
      await updateNAVs({})
      setLastUpdated(new Date().toLocaleString())
      setTimeout(() => refetch(), 500)
    } catch (error) {
      console.error('Error updating NAVs:', error)
      alert('Error updating NAVs. Please try again.')
    }
  }, [updateNAVs, refetch])

  useEffect(() => {
    if (!portfolio?.portfolio || portfolio.portfolio.length === 0) return

    const interval = setInterval(() => {
      handleUpdateNAVs()
    }, 86400000) // 24 hours

    return () => clearInterval(interval)
  }, [portfolio, handleUpdateNAVs])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95 backdrop-blur-2xl">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Mutual Funds
              </h1>
              <p className="mt-2 text-gray-400">Track your mutual fund investments</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateNAVs}
                disabled={updatingNAVs || !portfolio?.portfolio || portfolio.portfolio.length === 0}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-medium text-white hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${updatingNAVs ? 'animate-spin' : ''}`} />
                {updatingNAVs ? 'Updating...' : 'Update NAVs'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Fund
              </motion.button>
            </div>
          </div>
          {lastUpdated && (
            <p className="mt-3 text-xs text-gray-500">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {error && (
          <div className="rounded-2xl bg-red-900/20 border border-red-500/50 p-4 text-red-300">
            {error.message}
          </div>
        )}

        {/* Portfolio Summary */}
        {portfolio && <PortfolioSummary summary={portfolio.summary} />}

        {/* Insights */}
        {portfolio && <InsightsSection investments={portfolio.portfolio} />}

        {/* Investments List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Investments</h2>
          {portfolio?.portfolio && portfolio.portfolio.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolio.portfolio.map((fund) => (
                <MutualFundCard 
                  key={fund._id} 
                  fund={fund} 
                  onSelect={setSelectedFund}
                  onEdit={setEditingFund}
                  onDelete={refetch}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-700 p-12 text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400">No mutual fund investments yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Start investing now →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Fund Modal */}
      {showAddModal && <FundSearchModal onClose={() => setShowAddModal(false)} onAdded={refetch} />}
      
      {/* Edit Fund Modal */}
      {editingFund && (
        <EditFundModal fund={editingFund} onClose={() => setEditingFund(null)} onSaved={refetch} />
      )}
    </div>
  )
}
