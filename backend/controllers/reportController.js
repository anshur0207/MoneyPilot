import Report from '../models/Report.js'
import Expense from '../models/Expense.js'
import Investment from '../models/Investment.js'
import Loan from '../models/Loan.js'

export const generateMonthlyReport = async (req, res, next) => {
  try {
    const { month = new Date().getMonth(), year = new Date().getFullYear() } = req.query

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const expenses = await Expense.find({
      userId: req.user.userId,
      date: { $gte: startDate, $lte: endDate },
    })

    const investments = await Investment.find({
      userId: req.user.userId,
      startDate: { $gte: startDate, $lte: endDate },
    })

    const loans = await Loan.find({
      userId: req.user.userId,
      startDate: { $gte: startDate, $lte: endDate },
    })

    // Calculate expenses by category
    const expensesByCategory = {}
    expenses.forEach((exp) => {
      if (!expensesByCategory[exp.category]) {
        expensesByCategory[exp.category] = 0
      }
      expensesByCategory[exp.category] += exp.amount
    })

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)
    const totalInvestment = investments.reduce((sum, i) => sum + i.investedAmount, 0)

    // Find existing report or create new one
    let report = await Report.findOne({
      userId: req.user.userId,
      month,
      year,
    })

    if (!report) {
      report = new Report({
        userId: req.user.userId,
        month,
        year,
        totalExpense,
        totalInvestment,
        expensesByCategory: new Map(Object.entries(expensesByCategory)),
        recommendations: generateRecommendations(totalExpense, totalInvestment),
      })
      await report.save()
    }

    res.json(report)
  } catch (error) {
    next(error)
  }
}

export const getAnalytics = async (req, res, next) => {
  try {
    const { months = 6 } = req.query

    const reports = await Report.find({ userId: req.user.userId })
      .sort({ year: -1, month: -1 })
      .limit(parseInt(months))

    const totalSpent = reports.reduce((sum, r) => sum + r.totalExpense, 0)
    const totalInvested = reports.reduce((sum, r) => sum + r.totalInvestment, 0)
    const avgMonthlyExpense = reports.length > 0 ? totalSpent / reports.length : 0

    res.json({
      reports,
      analytics: {
        totalSpent,
        totalInvested,
        avgMonthlyExpense: Math.round(avgMonthlyExpense),
        reportCount: reports.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

function generateRecommendations(totalExpense, totalInvestment) {
  const recommendations = []

  if (totalExpense > 50000) {
    recommendations.push('Your spending is high. Consider cutting back on non-essential items.')
  }

  if (totalInvestment < 10000) {
    recommendations.push('Increase your monthly investment to build wealth.')
  }

  if (totalInvestment > 0 && totalExpense / totalInvestment > 3) {
    recommendations.push('Your expenses are 3x higher than investments. Balance your spending.')
  }

  return recommendations
}
