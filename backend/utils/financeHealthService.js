/**
 * Financial Health Score Service
 * Analyzes user's financial behavior and generates a comprehensive health score (0-100)
 */

/**
 * Calculate Savings Ratio Score (20 points)
 * Formula: Monthly Savings / Monthly Income × 100
 */
export const calculateSavingsRatioScore = (monthlyIncome, monthlyInvestment) => {
  if (monthlyIncome === 0) return 0

  const savingsRatio = (monthlyInvestment / monthlyIncome) * 100

  if (savingsRatio < 5) return 2
  if (savingsRatio < 10) return 5
  if (savingsRatio < 20) return 10
  if (savingsRatio < 30) return 15
  return 20
}

/**
 * Calculate Debt-to-Income Ratio Score (20 points)
 * Formula: Total Monthly EMI / Monthly Income × 100
 */
export const calculateDebtToIncomeScore = (monthlyIncome, monthlyEMI) => {
  if (monthlyIncome === 0) return 0

  const debtRatio = (monthlyEMI / monthlyIncome) * 100

  if (debtRatio > 50) return 0
  if (debtRatio > 40) return 5
  if (debtRatio > 30) return 10
  if (debtRatio > 20) return 15
  return 20
}

/**
 * Calculate Investment Discipline Score (15 points)
 * Checks SIP consistency, monthly investing, diversification, missed SIPs
 */
export const calculateInvestmentDisciplineScore = (investments) => {
  if (investments.length === 0) return 0

  // Count investments with monthly contributions (SIPs)
  const sipInvestments = investments.filter((inv) => inv.monthlyContribution > 0)

  if (sipInvestments.length === 0) return 5 // Some investments but no SIPs

  // Check if investments are diversified (at least 3 different types/assets)
  const diversificationScore = sipInvestments.length >= 3 ? 15 : 10

  return diversificationScore
}

/**
 * Calculate Emergency Fund Score (15 points)
 * Formula: Emergency Fund Months = Emergency Savings / Monthly Expenses
 */
export const calculateEmergencyFundScore = (emergencyFund, monthlyExpenses) => {
  if (monthlyExpenses === 0) return 0

  const emergencyMonths = emergencyFund / monthlyExpenses

  if (emergencyMonths < 1) return 2
  if (emergencyMonths < 3) return 7
  if (emergencyMonths < 6) return 12
  return 15
}

/**
 * Calculate Expense Control Score (15 points)
 * Analyzes overspending, impulse purchases, spending trends
 */
export const calculateExpenseControlScore = (
  expenses,
  monthlyIncome,
  monthlyExpenses
) => {
  if (expenses.length === 0) return 15 // No expenses = no overspending

  // Calculate spending categories
  const categorySpending = {}
  expenses.forEach((exp) => {
    categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount
  })

  // Check for high food delivery spending
  const foodDeliverySpending = categorySpending['Food Delivery'] || 0
  const totalFoodDeliveryPercent = (foodDeliverySpending / monthlyExpenses) * 100

  // Check for shopping spikes
  const shoppingSpending = categorySpending['Shopping'] || 0
  const totalShoppingPercent = (shoppingSpending / monthlyExpenses) * 100

  // Calculate expense ratio vs income
  const expenseRatio = (monthlyExpenses / monthlyIncome) * 100

  let score = 15

  // Reduce score for overspending
  if (expenseRatio > 80) score = 3
  else if (expenseRatio > 70) score = 8
  else if (expenseRatio > 60) score = 12

  // Extra deductions for category spikes
  if (totalFoodDeliveryPercent > 15) score -= 2
  if (totalShoppingPercent > 20) score -= 2

  return Math.max(score, 0)
}

/**
 * Calculate Investment-to-Savings Balance Score (5 points)
 * Checks if savings are balanced with investments
 */
export const calculateInvestmentSavingsBalanceScore = (
  totalInvestmentValue,
  liquidSavings
) => {
  if (totalInvestmentValue === 0 && liquidSavings === 0) return 0

  if (totalInvestmentValue === 0) return 2 // Mostly savings
  if (liquidSavings === 0) return 3 // Mostly investments (not ideal)

  // Balanced investment-to-savings ratio
  return 5
}

/**
 * Calculate Income Stability Score (5 points)
 * Checks for stable salary, freelancing, or multiple income streams
 */
export const calculateIncomeStabilityScore = (monthlyIncome, hasMultipleIncomes) => {
  if (monthlyIncome === 0) return 0

  if (hasMultipleIncomes) return 5 // Multiple income sources
  return 3 // Single stable salary
}

/**
 * Calculate Goal Progress Score (5 points)
 * Tracks active goals and progress
 */
export const calculateGoalProgressScore = (goals) => {
  if (goals.length === 0) return 0

  const activeGoals = goals.filter((g) => g.status === 'Active')
  const completedGoals = goals.filter((g) => g.status === 'Completed')

  if (activeGoals.length > 0 || completedGoals.length > 0) {
    return completedGoals.length > 0 ? 5 : 2
  }

  return 0
}

/**
 * Identify Financial Strengths
 */
export const identifyStrengths = (scores) => {
  const strengths = []

  if (scores.savingsRatio >= 15) strengths.push('Strong savings discipline')
  if (scores.debtToIncome >= 15) strengths.push('Low debt ratio')
  if (scores.investmentDiscipline >= 10)
    strengths.push('Consistent investment behavior')
  if (scores.emergencyFund >= 12) strengths.push('Solid emergency fund')
  if (scores.expenseControl >= 12) strengths.push('Good expense control')
  if (scores.goalProgress >= 5) strengths.push('Active goal tracking')

  return strengths.length > 0 ? strengths : ['Financial data available for analysis']
}

/**
 * Identify Areas for Improvement
 */
export const identifyImprovements = (scores, data) => {
  const improvements = []

  if (scores.savingsRatio < 10)
    improvements.push('Increase your monthly savings rate')
  if (scores.debtToIncome > 10)
    improvements.push('Focus on reducing your debt burden')
  if (scores.investmentDiscipline < 10)
    improvements.push('Start or increase your SIP investments')
  if (scores.emergencyFund < 7) improvements.push('Build your emergency fund')
  if (scores.expenseControl < 12)
    improvements.push('Control discretionary spending')
  if (scores.goalProgress === 0) improvements.push('Set and track financial goals')

  return improvements.length > 0
    ? improvements
    : ['You\'re doing great! Keep up the momentum']
}

/**
 * Generate AI-powered insights
 */
export const generateInsights = (
  expenses,
  investments,
  currentMonthExpenses,
  previousMonthExpenses
) => {
  const insights = []

  // Food delivery insight
  const foodDeliveryExpenses = expenses.filter((e) => e.category === 'Food Delivery')
  if (foodDeliveryExpenses.length > 0) {
    const foodDeliveryTotal = foodDeliveryExpenses.reduce((sum, e) => sum + e.amount, 0)
    const avgFoodDelivery = foodDeliveryTotal / foodDeliveryExpenses.length
    if (avgFoodDelivery > 500) {
      insights.push(`Food delivery spending averaged ₹${Math.round(avgFoodDelivery)}. Consider cooking at home to save money.`)
    }
  }

  // Shopping insight
  const shoppingExpenses = expenses.filter((e) => e.category === 'Shopping')
  if (shoppingExpenses.length > 0) {
    const shoppingTotal = shoppingExpenses.reduce((sum, e) => sum + e.amount, 0)
    if (shoppingTotal > 5000) {
      insights.push(`Your shopping expenses are ₹${shoppingTotal} this month. Consider setting a budget for discretionary purchases.`)
    }
  }

  // SIP recommendation
  const totalMonthlyInvestment = investments.reduce((sum, i) => sum + (i.monthlyContribution || 0), 0)
  if (totalMonthlyInvestment > 0 && totalMonthlyInvestment < 10000) {
    const recommendedIncrease = Math.round(totalMonthlyInvestment * 0.5)
    insights.push(`You can safely increase your SIP by ₹${recommendedIncrease} per month.`)
  }

  // Expense trend insight
  if (previousMonthExpenses > 0) {
    const changePercent = ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    if (changePercent > 20) {
      insights.push(`Your expenses increased by ${Math.round(changePercent)}% this month. Review your spending.`)
    } else if (changePercent < -15) {
      insights.push(`Great job! Your expenses decreased by ${Math.round(Math.abs(changePercent))}% this month.`)
    }
  }

  return insights.length > 0
    ? insights
    : ['Keep tracking your finances to get personalized insights']
}

/**
 * Determine Health Score Status
 */
export const getHealthStatus = (score) => {
  if (score < 40) return 'Poor'
  if (score < 61) return 'Average'
  if (score < 76) return 'Good'
  if (score < 91) return 'Strong'
  return 'Excellent'
}

/**
 * Get status color for UI
 */
export const getStatusColor = (score) => {
  if (score < 40) return 'red'
  if (score < 61) return 'orange'
  if (score < 76) return 'yellow'
  if (score < 91) return 'green'
  return 'purple'
}

/**
 * Main function to calculate comprehensive financial health score
 */
export const calculateFinancialHealthScore = (
  user,
  expenses,
  investments,
  loans,
  goals,
  targetMonth = null,
  targetYear = null
) => {
  // Use provided month/year or current
  const now = new Date()
  const month = targetMonth !== null ? targetMonth : now.getMonth()
  const year = targetYear !== null ? targetYear : now.getFullYear()

  // Calculate monthly metrics
  const monthlyIncome = user.monthlySalary || 0
  const monthlyInvestment = investments.reduce((sum, i) => sum + (i.monthlyContribution || 0), 0)
  
  // Calculate monthly EMI
  const monthlyEMI = loans.reduce((sum, l) => {
    const monthlyPayment = l.remainingAmount > 0
      ? (l.remainingAmount / Math.max(l.remainingMonths || 1, 1))
      : 0
    return sum + monthlyPayment
  }, 0)

  // Calculate current and previous month expenses
  const previousMonth = month === 0 ? 11 : month - 1
  const previousYear = month === 0 ? year - 1 : year

  const currentMonthExpenses = expenses
    .filter((e) => {
      const eDate = new Date(e.date)
      return eDate.getMonth() === month && eDate.getFullYear() === year
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const previousMonthExpenses = expenses
    .filter((e) => {
      const eDate = new Date(e.date)
      return eDate.getMonth() === previousMonth && eDate.getFullYear() === previousYear
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const averageMonthlyExpenses = currentMonthExpenses || previousMonthExpenses || 0

  // Calculate investment and savings values
  const totalInvestmentValue = investments.reduce((sum, i) => sum + i.currentValue, 0)
  const totalInvestedAmount = investments.reduce((sum, i) => sum + i.investedAmount, 0)

  // Estimate liquid savings (for emergency fund - simplified)
  const estimatedLiquidSavings = monthlyIncome * 3 // Assume 3 months of income as liquid savings

  // Calculate individual scores
  const scores = {
    savingsRatio: calculateSavingsRatioScore(monthlyIncome, monthlyInvestment),
    debtToIncome: calculateDebtToIncomeScore(monthlyIncome, monthlyEMI),
    investmentDiscipline: calculateInvestmentDisciplineScore(investments),
    emergencyFund: calculateEmergencyFundScore(estimatedLiquidSavings, averageMonthlyExpenses),
    expenseControl: calculateExpenseControlScore(expenses, monthlyIncome, currentMonthExpenses),
    investmentSavingsBalance: calculateInvestmentSavingsBalanceScore(
      totalInvestmentValue,
      estimatedLiquidSavings
    ),
    incomeStability: calculateIncomeStabilityScore(monthlyIncome, false),
    goalProgress: calculateGoalProgressScore(goals),
  }

  // Calculate total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

  // Generate insights
  const strengths = identifyStrengths(scores)
  const improvements = identifyImprovements(scores, {
    currentMonthExpenses,
    previousMonthExpenses,
  })
  const insights = generateInsights(
    expenses,
    investments,
    currentMonthExpenses,
    previousMonthExpenses
  )

  const status = getHealthStatus(totalScore)
  const statusColor = getStatusColor(totalScore)

  return {
    score: Math.round(totalScore),
    status,
    statusColor,
    scoreBreakdown: {
      savingsRatio: { score: scores.savingsRatio, maxScore: 20, label: 'Savings Ratio' },
      debtToIncome: { score: scores.debtToIncome, maxScore: 20, label: 'Debt-to-Income' },
      investmentDiscipline: { score: scores.investmentDiscipline, maxScore: 15, label: 'Investment Discipline' },
      emergencyFund: { score: scores.emergencyFund, maxScore: 15, label: 'Emergency Fund' },
      expenseControl: { score: scores.expenseControl, maxScore: 15, label: 'Expense Control' },
      investmentSavingsBalance: { score: scores.investmentSavingsBalance, maxScore: 5, label: 'Investment Balance' },
      incomeStability: { score: scores.incomeStability, maxScore: 5, label: 'Income Stability' },
      goalProgress: { score: scores.goalProgress, maxScore: 5, label: 'Goal Progress' },
    },
    metrics: {
      monthlyIncome,
      monthlyInvestment,
      monthlyEMI,
      savingsRatio: monthlyIncome > 0 ? ((monthlyInvestment / monthlyIncome) * 100).toFixed(1) : 0,
      debtRatio: monthlyIncome > 0 ? ((monthlyEMI / monthlyIncome) * 100).toFixed(1) : 0,
      emergencyFundMonths: averageMonthlyExpenses > 0 
        ? (estimatedLiquidSavings / averageMonthlyExpenses).toFixed(1)
        : 0,
      currentMonthExpenses,
      previousMonthExpenses,
      totalInvestmentValue,
      totalInvestedAmount,
    },
    strengths,
    improvements,
    insights,
  }
}
