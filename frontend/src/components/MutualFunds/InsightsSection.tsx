export default function InsightsSection({ investments }) {
  if (!investments || investments.length === 0) {
    return null
  }

  const avgGain = 
    investments.reduce((sum, inv) => sum + (inv.currentValue - inv.investedAmount), 0) /
    investments.length

  const bestPerformer = investments.reduce((best, inv) => {
    const gain = inv.currentValue - inv.investedAmount
    return gain > (best.currentValue - best.investedAmount) ? inv : best
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/20 p-6">
        <p className="text-sm text-gray-400 mb-2">Average Gain</p>
        <p className="text-2xl font-bold text-green-400">₹{avgGain.toLocaleString()}</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 p-6">
        <p className="text-sm text-gray-400 mb-2">Total Investments</p>
        <p className="text-2xl font-bold text-blue-400">{investments.length}</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 p-6">
        <p className="text-sm text-gray-400 mb-2">Best Performer</p>
        <p className="text-2xl font-bold text-purple-400 truncate">{bestPerformer.name}</p>
      </div>
    </div>
  )
}
