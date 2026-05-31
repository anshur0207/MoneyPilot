import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

export default function PortfolioCharts({ investments }) {
  // Sample chart data - in a real app, this would come from backend
  const chartData = investments?.slice(0, 1).map((inv) => ({
    name: inv.name,
    value: inv.currentValue,
  })) || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Portfolio Distribution
        </h2>
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-4">
          {chartData.map((fund, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{fund.name}</span>
                <span className="font-semibold text-cyan-400">₹{fund.value?.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{
                    width: '100%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No data available
        </div>
      )}
    </motion.div>
  )
}
