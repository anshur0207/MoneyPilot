import Investment from '../models/Investment.js'
import MutualFund from '../models/MutualFund.js'
import { getLatestNAV, getSchemeHistory, searchSchemes } from '../services/mfService.js'
import { calculateXIRR } from '../services/portfolioService.js'
import xirr from 'xirr'

const formatToISODate = (date) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const getNextSipDate = (startDate, monthlyContribution) => {
  if (!startDate || !monthlyContribution) return null

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let candidate = new Date(start)
  while (candidate <= today) {
    candidate.setMonth(candidate.getMonth() + 1)
  }

  return candidate
}

const buildInvestmentTransactions = (investment) => {
  const transactions = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let startDate = investment.startDate ? new Date(investment.startDate) : today
  startDate.setHours(0, 0, 0, 0)
  const monthlyContribution = Number(investment.monthlyContribution || 0)

  if (monthlyContribution > 0) {
    const effectiveStart = startDate > today ? new Date(today) : new Date(startDate)
    const months = Math.max(
      0,
      (today.getFullYear() - effectiveStart.getFullYear()) * 12 + (today.getMonth() - effectiveStart.getMonth())
    )

    for (let i = 0; i <= months; i++) {
      const paymentDate = new Date(effectiveStart)
      paymentDate.setMonth(effectiveStart.getMonth() + i)
      transactions.push({
        amount: -Math.round(monthlyContribution * 100) / 100,
        date: formatToISODate(paymentDate),
        when: new Date(paymentDate),
      })
    }

    const estimatedContributionTotal = monthlyContribution * (months + 1)
    const initialLump = Number(investment.investedAmount || 0) - estimatedContributionTotal
    if (initialLump > 0) {
      transactions.unshift({
        amount: -Math.round(initialLump * 100) / 100,
        date: formatToISODate(effectiveStart),
        when: new Date(effectiveStart),
      })
    }
  } else {
    const effectiveStart = startDate > today ? today : startDate
    transactions.push({
      amount: -Math.round((investment.investedAmount || 0) * 100) / 100,
      date: formatToISODate(effectiveStart),
      when: new Date(effectiveStart),
    })
  }

  transactions.push({
    amount: Math.round((investment.currentValue || 0) * 100) / 100,
    date: formatToISODate(today),
    when: today,
  })

  return transactions
}

/**
 * Add a mutual fund investment
 */
export const addMutualFundInvestment = async (req, res, next) => {
  try {
    const {
      name,
      investedAmount,
      units,
      schemeCode,
      purchaseNAV,
      category,
      fundHouse,
      notes,
      monthlyContribution,
      startDate,
    } = req.body

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (startDate) {
      const parsedStart = new Date(startDate)
      parsedStart.setHours(0, 0, 0, 0)
      if (parsedStart > today) {
        return res.status(400).json({ message: 'Start date cannot be in the future.' })
      }
    }

    // Fetch the latest NAV from mfapi.in instead of using the one provided
    const latestNAVData = await getLatestNAV(schemeCode)

    let currentNAV = latestNAVData?.nav
    let investmentName = latestNAVData?.name || name
    let investmentFundHouse = latestNAVData?.fundHouse || fundHouse
    let navWarning = null

    if (!currentNAV) {
      if (!purchaseNAV) {
        return res.status(400).json({
          message: 'Unable to fetch current NAV and purchase NAV was not provided. Please provide the purchase NAV or try again later.',
        })
      }

      currentNAV = parseFloat(purchaseNAV)
      navWarning = 'Latest NAV unavailable; using purchase NAV as starting value.'
    }

    const currentValue = units * currentNAV

    const investment = new Investment({
      userId: req.user.userId,
      type: 'Mutual Fund',
      name: investmentName,
      investedAmount,
      currentValue,
      startDate: startDate ? new Date(startDate) : new Date(),
      isMutualFund: true,
      schemeCode,
      units,
      purchaseNAV,
      currentNAV,
      category,
      fundHouse: investmentFundHouse,
      notes,
      monthlyContribution: monthlyContribution ? Number(monthlyContribution) : 0,
      lastUpdated: new Date(),
    })

    await investment.save()

    res.status(201).json({
      message: navWarning ? `Mutual fund investment added successfully. ${navWarning}` : 'Mutual fund investment added successfully',
      investment,
      currentNAV,
      lastUpdated: latestNAVData?.date || new Date().toISOString().split('T')[0],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get mutual fund portfolio
 */
export const getMutualFundPortfolio = async (req, res, next) => {
  try {
    const mfInvestments = await Investment.find({
      userId: req.user.userId,
      isMutualFund: true,
    }).sort({ startDate: -1 })

    const portfolioWithMetadata = mfInvestments.map((inv) => {
      const transactions = buildInvestmentTransactions(inv)
      let fundXirr = null

      const transactionDates = transactions
        .map((txn) => txn.when || new Date(txn.date))
        .map((date) => new Date(date).toISOString().split('T')[0])
      const sortedDates = [...new Set(transactionDates)].sort()
      const validXirr = sortedDates.length >= 2 && new Date(sortedDates[0]) < new Date(sortedDates[sortedDates.length - 1])

      if (validXirr) {
        try {
          fundXirr = Number(xirr(transactions)) * 100
        } catch (error) {
          fundXirr = null
        }
      }

      const nextSipDate = getNextSipDate(inv.startDate, inv.monthlyContribution)
      const sipReflectDate = nextSipDate ? new Date(nextSipDate) : null
      if (sipReflectDate) sipReflectDate.setDate(sipReflectDate.getDate() + 3)

      return {
        ...inv.toObject(),
        xirr: fundXirr !== null ? Number(fundXirr.toFixed(2)) : null,
        xirrTransactions: transactions,
        nextSipDate: nextSipDate ? formatToISODate(nextSipDate) : null,
        sipReflectDate: sipReflectDate ? formatToISODate(sipReflectDate) : null,
        projectedNextSipValue: inv.monthlyContribution
          ? Number((inv.currentValue + inv.monthlyContribution).toFixed(2))
          : null,
      }
    })

    const totalInvested = portfolioWithMetadata.reduce((sum, inv) => sum + inv.investedAmount, 0)
    const totalValue = portfolioWithMetadata.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalUnits = portfolioWithMetadata.reduce((sum, inv) => sum + (inv.units || 0), 0)
    const totalGains = totalValue - totalInvested

    res.json({
      portfolio: portfolioWithMetadata,
      summary: {
        totalInvested,
        totalValue,
        totalUnits,
        totalGains,
        gainPercentage: totalInvested > 0 ? ((totalGains / totalInvested) * 100).toFixed(2) : 0,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Calculate XIRR from arbitrary transactions
 */
export const calculateXirrFromTransactions = async (req, res, next) => {
  try {
    const transactions = req.body.transactions || []

    if (!Array.isArray(transactions) || transactions.length < 2) {
      return res.status(400).json({ error: 'Provide at least two transactions to calculate XIRR.' })
    }

    const formatted = transactions.map((txn) => ({
      amount: Number(txn.amount),
      when: txn.when ? new Date(txn.when) : new Date(txn.date),
    }))

    let result
    try {
      result = xirr(formatted)
    } catch (error) {
      return res.status(500).json({ error: 'Unable to calculate XIRR' })
    }

    res.json({ xirr: (Number(result) * 100).toFixed(2) })
  } catch (error) {
    next(error)
  }
}

/**
 * Search for mutual funds
 */
export const searchMutualFunds = async (req, res, next) => {
  try {
    // Handle both GET query and POST body
    const query = req.query.query || req.body.query

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' })
    }

    const results = await searchSchemes(query)

    res.json({ results })
  } catch (error) {
    next(error)
  }
}

/**
 * Get fund details by scheme code
 */
export const getFundDetails = async (req, res, next) => {
  try {
    const { schemeCode } = req.params

    // Always fetch fresh data from the API
    const latestNAVData = await getLatestNAV(schemeCode)

    if (!latestNAVData) {
      return res.status(404).json({ 
        message: 'Fund not found. Please check the scheme code.' 
      })
    }

    // Also try to get cached data from database if available
    let cachedData = null
    try {
      cachedData = await MutualFund.findOne({ schemeCode })
    } catch (dbError) {
      console.warn('Could not fetch from cache:', dbError.message)
    }

    res.json({
      schemeCode,
      schemeName: latestNAVData.name,
      fundHouse: latestNAVData.fundHouse,
      currentNAV: latestNAVData.nav,
      navDate: latestNAVData.date,
      lastUpdated: new Date(),
      cachedCategory: cachedData?.category || 'General',
      cachedRiskProfile: cachedData?.riskProfile || 'N/A',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get historical chart data for a fund
 */
export const getHistoricalChartData = async (req, res, next) => {
  try {
    const { schemeCode } = req.params
    const { months = 12 } = req.query

    const history = await getSchemeHistory(schemeCode, parseInt(months))

    res.json({ schemeCode, data: history })
  } catch (error) {
    next(error)
  }
}

/**
 * Update all NAVs for user's mutual funds
 */
export const updateAllNAVs = async (req, res, next) => {
  try {
    const mfInvestments = await Investment.find({
      userId: req.user.userId,
      isMutualFund: true,
    })

    const updates = []
    const failed = []

    for (const investment of mfInvestments) {
      try {
        const latestNAVData = await getLatestNAV(investment.schemeCode)

        if (latestNAVData) {
          investment.currentNAV = latestNAVData.nav
          investment.currentValue = investment.units * latestNAVData.nav
          investment.lastUpdated = new Date()
          await investment.save()
          updates.push({
            ...investment.toObject(),
            updatedNAV: latestNAVData.nav,
            fundName: latestNAVData.name,
            navDate: latestNAVData.date,
          })
        } else {
          failed.push({
            schemeCode: investment.schemeCode,
            name: investment.name,
            error: 'Unable to fetch NAV',
          })
        }
      } catch (error) {
        failed.push({
          schemeCode: investment.schemeCode,
          name: investment.name,
          error: error.message,
        })
      }
    }

    res.json({
      message: 'NAV update completed',
      summary: {
        total: mfInvestments.length,
        updated: updates.length,
        failed: failed.length,
      },
      updated: updates,
      failed: failed.length > 0 ? failed : undefined,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get a specific mutual fund investment details
 */
export const getMutualFundDetails = async (req, res, next) => {
  try {
    const { id } = req.params

    const investment = await Investment.findOne({
      _id: id,
      userId: req.user.userId,
      isMutualFund: true,
    })

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' })
    }

    // Get historical data
    const history = await getSchemeHistory(investment.schemeCode, 12)

    res.json({
      investment,
      chartData: history,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a mutual fund investment
 */
export const updateMutualFundInvestment = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (updateData.startDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const parsedStart = new Date(updateData.startDate)
      parsedStart.setHours(0, 0, 0, 0)
      if (parsedStart > today) {
        return res.status(400).json({ message: 'Start date cannot be in the future.' })
      }
    }

    if (updateData.units && updateData.currentNAV) {
      updateData.currentValue = updateData.units * updateData.currentNAV
    }

    const investment = await Investment.findOneAndUpdate(
      { _id: id, userId: req.user.userId, isMutualFund: true },
      { ...updateData, lastUpdated: new Date() },
      { new: true }
    )

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' })
    }

    res.json({
      message: 'Investment updated successfully',
      investment,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a mutual fund investment
 */
export const deleteMutualFundInvestment = async (req, res, next) => {
  try {
    const { id } = req.params

    const investment = await Investment.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
      isMutualFund: true,
    })

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' })
    }

    res.json({
      message: 'Investment deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get current NAV for funds in search results
 */
export const getLatestNAVForFunds = async (req, res, next) => {
  try {
    const { schemeCodes } = req.body

    if (!schemeCodes || !Array.isArray(schemeCodes) || schemeCodes.length === 0) {
      return res.status(400).json({ message: 'Provide array of scheme codes' })
    }

    const navData = []

    for (const schemeCode of schemeCodes) {
      try {
        // Try to get from MFAPI first
        const latestNAV = await getLatestNAV(schemeCode)

        if (latestNAV) {
          navData.push({
            schemeCode,
            currentNAV: latestNAV.nav,
            date: latestNAV.date,
          })
        } else {
          // Fallback to database
          const fund = await MutualFund.findOne({ schemeCode })
          if (fund) {
            navData.push({
              schemeCode,
              currentNAV: fund.currentNAV,
              date: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        console.error(`Error fetching NAV for ${schemeCode}:`, error.message)
      }
    }

    res.json({ navData })
  } catch (error) {
    next(error)
  }
}

/**
 * Compare multiple funds
 */
export const compareFunds = async (req, res, next) => {
  try {
    const { schemeCodes } = req.body

    if (!schemeCodes || !Array.isArray(schemeCodes) || schemeCodes.length === 0) {
      return res.status(400).json({ message: 'Provide array of scheme codes' })
    }

    const comparisonData = []

    for (const schemeCode of schemeCodes.slice(0, 5)) {
      const latestNAV = await getLatestNAV(schemeCode)
      const history = await getSchemeHistory(schemeCode, 12)

      if (latestNAV) {
        comparisonData.push({
          schemeCode,
          currentNAV: latestNAV.nav,
          chartData: history,
        })
      }
    }

    res.json({ comparison: comparisonData })
  } catch (error) {
    next(error)
  }
}

export default {
  addMutualFundInvestment,
  getMutualFundPortfolio,
  calculateXirrFromTransactions,
  searchMutualFunds,
  getFundDetails,
  getHistoricalChartData,
  updateAllNAVs,
  getMutualFundDetails,
  updateMutualFundInvestment,
  deleteMutualFundInvestment,
  compareFunds,
}
