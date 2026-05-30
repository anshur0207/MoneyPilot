/**
 * Portfolio calculations for mutual funds and investments
 */

/**
 * Calculate current portfolio value for a mutual fund
 * Formula: Current Value = Units × Current NAV
 */
export const calculateCurrentValue = (units, currentNAV) => {
  return units * currentNAV
}

/**
 * Calculate profit/loss
 * Formula: Profit/Loss = Current Value - Invested Amount
 */
export const calculateProfitLoss = (currentValue, investedAmount) => {
  return currentValue - investedAmount
}

/**
 * Calculate return percentage
 * Formula: Return % = (Profit / InvestedAmount) × 100
 */
export const calculateReturnPercentage = (profitLoss, investedAmount) => {
  if (investedAmount === 0) return 0
  return (profitLoss / investedAmount) * 100
}

/**
 * Calculate daily gain/loss
 */
export const calculateDailyGainLoss = (currentNAV, previousNAV, units) => {
  const navChange = currentNAV - previousNAV
  return navChange * units
}

/**
 * Calculate XIRR (Extended Internal Rate of Return)
 * Simplified version - calculates annualized return
 */
export const calculateXIRR = (investedAmount, currentValue, monthsInvested) => {
  if (monthsInvested === 0 || investedAmount === 0) return 0

  const yearsInvested = monthsInvested / 12
  const totalReturn = (currentValue - investedAmount) / investedAmount
  const annualizedReturn = Math.pow(1 + totalReturn, 1 / yearsInvested) - 1

  return annualizedReturn * 100
}

/**
 * Calculate SIP returns (for periodic investments)
 */
export const calculateSIPReturns = (monthlyAmount, months, currentValue) => {
  const totalInvested = monthlyAmount * months
  const profitLoss = currentValue - totalInvested
  const returnPercentage = (profitLoss / totalInvested) * 100

  return {
    totalInvested,
    currentValue,
    profitLoss,
    returnPercentage,
  }
}

/**
 * Calculate portfolio summary across all investments
 */
export const calculatePortfolioSummary = (investments) => {
  let totalInvested = 0
  let totalCurrentValue = 0
  let totalByCategory = {}

  investments.forEach((investment) => {
    totalInvested += investment.investedAmount
    totalCurrentValue += investment.currentValue

    if (!totalByCategory[investment.category]) {
      totalByCategory[investment.category] = {
        invested: 0,
        current: 0,
      }
    }

    totalByCategory[investment.category].invested += investment.investedAmount
    totalByCategory[investment.category].current += investment.currentValue
  })

  const totalProfitLoss = totalCurrentValue - totalInvested
  const totalReturnPercentage = calculateReturnPercentage(totalProfitLoss, totalInvested)

  return {
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalReturnPercentage,
    byCategory: totalByCategory,
  }
}

/**
 * Calculate asset allocation percentages
 */
export const calculateAssetAllocation = (investments) => {
  const allocation = {}
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)

  investments.forEach((investment) => {
    const key = investment.category || 'Other'
    if (!allocation[key]) {
      allocation[key] = {
        value: 0,
        percentage: 0,
      }
    }

    allocation[key].value += investment.currentValue
    allocation[key].percentage = ((allocation[key].value / totalValue) * 100).toFixed(2)
  })

  return allocation
}

/**
 * Generate portfolio insights
 */
export const generatePortfolioInsights = (investments, portfolio) => {
  const insights = []

  // Find best performing fund
  let bestPerformer = null
  let bestReturn = -Infinity

  investments.forEach((inv) => {
    const returnPct = calculateReturnPercentage(
      inv.currentValue - inv.investedAmount,
      inv.investedAmount
    )
    if (returnPct > bestReturn) {
      bestReturn = returnPct
      bestPerformer = inv
    }
  })

  if (bestPerformer && bestReturn > 0) {
    insights.push({
      type: 'best_performer',
      message: `${bestPerformer.name} is your best performing investment with ${bestReturn.toFixed(2)}% returns.`,
      fund: bestPerformer.name,
      return: bestReturn,
    })
  }

  // Find worst performing fund
  let worstPerformer = null
  let worstReturn = Infinity

  investments.forEach((inv) => {
    const returnPct = calculateReturnPercentage(
      inv.currentValue - inv.investedAmount,
      inv.investedAmount
    )
    if (returnPct < worstReturn) {
      worstReturn = returnPct
      worstPerformer = inv
    }
  })

  if (worstPerformer && worstReturn < 0) {
    insights.push({
      type: 'underperformer',
      message: `${worstPerformer.name} is underperforming with ${worstReturn.toFixed(2)}% returns.`,
      fund: worstPerformer.name,
      return: worstReturn,
    })
  }

  // Portfolio diversification insight
  const categories = new Set(investments.map((inv) => inv.category))
  if (categories.size >= 3) {
    insights.push({
      type: 'diversification',
      message: `Your portfolio is well-diversified across ${categories.size} asset classes.`,
    })
  }

  // Monthly gain insight
  const monthlyGain = portfolio.totalReturnPercentage / (investments[0] ? 12 : 1)
  insights.push({
    type: 'monthly_trend',
    message: `Average monthly return: ${monthlyGain.toFixed(2)}%`,
    monthlyReturn: monthlyGain,
  })

  return insights
}

/**
 * Calculate diversification score (0-100)
 */
export const calculateDiversificationScore = (investments) => {
  const allocation = calculateAssetAllocation(investments)
  const numCategories = Object.keys(allocation).length
  const maxScore = 100

  // Score based on number of categories and distribution
  let diversificationScore = Math.min(numCategories * 15, maxScore)

  // Penalize if one category is > 60% of portfolio
  for (const category in allocation) {
    if (allocation[category].percentage > 60) {
      diversificationScore -= 20
    }
  }

  return Math.max(0, Math.min(100, diversificationScore))
}

/**
 * Calculate risk score
 */
export const calculateRiskScore = (investments) => {
  const riskWeights = {
    Low: 10,
    Medium: 50,
    High: 90,
  }

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  let weightedRisk = 0

  investments.forEach((investment) => {
    const weight = investment.currentValue / totalValue
    const risk = riskWeights[investment.riskLevel] || 50
    weightedRisk += weight * risk
  })

  return Math.round(weightedRisk)
}

export default {
  calculateCurrentValue,
  calculateProfitLoss,
  calculateReturnPercentage,
  calculateDailyGainLoss,
  calculateXIRR,
  calculateSIPReturns,
  calculatePortfolioSummary,
  calculateAssetAllocation,
  generatePortfolioInsights,
  calculateDiversificationScore,
  calculateRiskScore,
}
