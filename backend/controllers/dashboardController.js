import User from '../models/User.js'
import Expense from '../models/Expense.js'
import Investment from '../models/Investment.js'
import Loan from '../models/Loan.js'
import Goal from '../models/Goal.js'
import Income from '../models/Income.js'
import {
  calculateNetWorth,
  calculateInvestmentGains,
  generateFinancialScore,
} from '../utils/calculations.js'
import { calculateFinancialHealthScore } from '../utils/financeHealthService.js'

export const getDashboardSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)

    // Get month and year from query or use current
    let { month, year } = req.query
    const now = new Date()
    // Fix: Handle month 0 (January) correctly
    month = month !== undefined && month !== null ? parseInt(month) : now.getMonth()
    year = year !== undefined && year !== null ? parseInt(year) : now.getFullYear()

    // Get all financial data
    const expenses = await Expense.find({ userId: req.user.userId })
    const investments = await Investment.find({ userId: req.user.userId })
    const loans = await Loan.find({ userId: req.user.userId })
    const goals = await Goal.find({ userId: req.user.userId })
    
    // Get all income records
    const allIncomes = await Income.find({ userId: req.user.userId })
    const totalIncome = allIncomes.reduce((sum, income) => sum + income.amount, 0)
    
    // Get income for selected month
    const monthlyIncomes = await Income.find({
      userId: req.user.userId,
      month,
      year,
    })
    const monthlyIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0)

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const totalInvested = investments.reduce((sum, i) => sum + i.investedAmount, 0)
    const totalInvestmentValue = investments.reduce((sum, i) => sum + i.currentValue, 0)
    const totalLoans = loans.reduce((sum, l) => sum + l.remainingAmount, 0)

    // Assets and liabilities come only from records the user added.
    const assets = totalInvestmentValue
    const liabilities = totalLoans
    const hasFinancialData =
      expenses.length > 0 || investments.length > 0 || loans.length > 0 || goals.length > 0

    // Calculate metrics - Updated to include income and expenses in net worth
    const netWorth = calculateNetWorth(assets, liabilities, totalIncome, totalExpenses)
    const investmentGains = calculateInvestmentGains(investments)
    const savingsRate = user.monthlySalary
      ? (investments.reduce((sum, i) => sum + (i.monthlyContribution || 0), 0) / user.monthlySalary) * 100
      : 0
    const debtRatio = assets === 0 ? 0 : liabilities / assets

    // Financial health score
    const healthScore = hasFinancialData
      ? generateFinancialScore(netWorth, savingsRate, debtRatio)
      : null

    // Monthly burn rate for selected month
    const monthlyExpenses = expenses
      .filter((e) => {
        const eDate = new Date(e.date)
        return eDate.getMonth() === month && eDate.getFullYear() === year
      })
      .reduce((sum, e) => sum + e.amount, 0)

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      currentMonth: month,
      currentYear: year,
      monthString: getMonthString(month, year),
      summary: {
        netWorth,
        savings: totalInvestmentValue,
        investments: totalInvested,
        loans: totalLoans,
        monthlyIncome,
        monthlyBurn: monthlyExpenses,
        monthlyRemaining: monthlyIncome - monthlyExpenses,
      },
      metrics: {
        healthScore,
        savingsRate: Math.round(savingsRate),
        debtRatio: Math.round(debtRatio * 100),
        investmentGains,
        hasFinancialData,
      },
      goals: {
        active: goals.filter((g) => g.status === 'Active').length,
        completed: goals.filter((g) => g.status === 'Completed').length,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getHealthScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)

    // Get month and year from query or use current
    let { month, year } = req.query
    const now = new Date()
    // Fix: Handle month 0 (January) correctly
    month = month !== undefined && month !== null ? parseInt(month) : now.getMonth()
    year = year !== undefined && year !== null ? parseInt(year) : now.getFullYear()

    const investments = await Investment.find({ userId: req.user.userId })
    const loans = await Loan.find({ userId: req.user.userId })
    const expenses = await Expense.find({ userId: req.user.userId })
    const goals = await Goal.find({ userId: req.user.userId })

    const hasFinancialData = investments.length > 0 || loans.length > 0 || expenses.length > 0

    if (!hasFinancialData) {
      return res.json({
        score: null,
        status: 'Not Calculated',
        message: 'Add expenses, investments, or loans to calculate your financial health score.',
        month,
        year,
        monthString: getMonthString(month, year),
        scoreBreakdown: null,
        metrics: null,
        strengths: [],
        improvements: [],
        insights: [],
      })
    }

    // Calculate comprehensive financial health score for specific month
    const healthData = calculateFinancialHealthScore(
      user,
      expenses,
      investments,
      loans,
      goals,
      month,
      year
    )

    res.json({
      ...healthData,
      month,
      year,
      monthString: getMonthString(month, year),
    })
  } catch (error) {
    next(error)
  }
}

function getMonthString(month, year) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return `${monthNames[month]} ${year}`
}
