export const calculateNetWorth = (assets, liabilities, totalIncome, totalExpenses) => {
  // Net worth = (Total Income - Total Expenses) + Current Investment Value - Remaining Loans
  const cashAccumulation = totalIncome - totalExpenses
  return cashAccumulation + assets - liabilities
}

export const calculateSavingsRate = (income, savings) => {
  return income === 0 ? 0 : (savings / income) * 100
}

export const calculateInvestmentGains = (investments) => {
  return investments.reduce((total, inv) => {
    return total + (inv.currentValue - inv.investedAmount)
  }, 0)
}

export const calculateMonthlyStats = (expenses, investments) => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthlyExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
    })
    .reduce((total, exp) => total + exp.amount, 0)

  const monthlyInvestments = investments
    .filter((inv) => {
      const invDate = new Date(inv.startDate)
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear
    })
    .reduce((total, inv) => total + inv.monthlyContribution, 0)

  return { monthlyExpenses, monthlyInvestments }
}

export const generateFinancialScore = (netWorth, savingsRate, debtRatio) => {
  let score = 50 // Base score

  // Net worth score (0-15)
  if (netWorth > 500000) score += 15
  else if (netWorth > 250000) score += 10
  else if (netWorth > 100000) score += 5

  // Savings rate score (0-20)
  if (savingsRate > 50) score += 20
  else if (savingsRate > 30) score += 15
  else if (savingsRate > 20) score += 10
  else if (savingsRate > 10) score += 5

  // Debt ratio score (0-15)
  if (debtRatio < 0.2) score += 15
  else if (debtRatio < 0.4) score += 10
  else if (debtRatio < 0.6) score += 5

  return Math.min(score, 100)
}
