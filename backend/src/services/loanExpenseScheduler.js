import Loan from '../../models/Loan.js'
import Expense from '../../models/Expense.js'

import Investment from '../../models/Investment.js'

const DAILY_INTERVAL_MS = 24 * 60 * 60 * 1000

const getTodayRange = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export const createDailyEMIExpenses = async () => {
  try {
    const today = new Date()
    const dueDay = today.getDate()
    const { start, end } = getTodayRange()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const isMonthEnd = dueDay === daysInMonth

    const loans = await Loan.find({
      remainingAmount: { $gt: 0 },
      startDate: { $lte: end },
      endDate: { $gte: start },
    })

    for (const loan of loans) {
      if (loan.emiDate !== dueDay && !(isMonthEnd && loan.emiDate > daysInMonth)) {
        continue
      }
      const exists = await Expense.exists({
        userId: loan.userId,
        loanId: loan._id,
        date: { $gte: start, $lte: end },
      })

      if (exists) continue

      const payment = Math.min(loan.emiAmount, loan.remainingAmount)
      if (payment <= 0) continue

      await Expense.create({
        userId: loan.userId,
        loanId: loan._id,
        amount: payment,
        category: 'EMI',
        description: `Auto EMI for ${loan.type} - ${loan.lenderName}`,
        date: start,
        recurring: true,
        paymentMethod: 'Bank Transfer',
        notes: 'Auto-generated monthly EMI expense',
      })

      loan.remainingAmount = Math.max(loan.remainingAmount - payment, 0)
      loan.paidEMI = (loan.paidEMI || 0) + 1
      await loan.save()
    }
  } catch (error) {
    console.error('Failed to create auto EMI expenses:', error)
  }
}

// --- SIP Deduction for Mutual Funds ---
export const createDailySIPExpenses = async () => {
  try {
    const today = new Date()
    const dueDay = today.getDate()
    const { start, end } = getTodayRange()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const isMonthEnd = dueDay === daysInMonth

    // Find all active SIP mutual fund investments
    const sipInvestments = await Investment.find({
      isMutualFund: true,
      monthlyContribution: { $gt: 0 },
      startDate: { $lte: end },
    })

    for (const inv of sipInvestments) {
      const sipDay = new Date(inv.startDate).getDate()
      if (sipDay !== dueDay && !(isMonthEnd && sipDay > daysInMonth)) {
        continue
      }

      const exists = await Expense.exists({
        userId: inv.userId,
        investmentId: inv._id,
        date: { $gte: start, $lte: end },
      })
      if (exists) continue

      await Expense.create({
        userId: inv.userId,
        investmentId: inv._id,
        amount: inv.monthlyContribution,
        category: 'Mutual Fund SIP',
        description: `Auto SIP for ${inv.name}`,
        date: start,
        recurring: true,
        paymentMethod: 'Bank Transfer',
        notes: 'Auto-generated monthly SIP expense',
      })

      inv.pendingSipAmount = inv.monthlyContribution
      inv.pendingSipReflectDate = new Date(start.getTime() + 3 * DAILY_INTERVAL_MS)
      await inv.save()
    }
  } catch (error) {
    console.error('Failed to create auto SIP expenses:', error)
  }
}

export const processDailySipReflects = async () => {
  try {
    const { start, end } = getTodayRange()
    const pendingInvestments = await Investment.find({
      pendingSipAmount: { $gt: 0 },
      pendingSipReflectDate: { $gte: start, $lte: end },
    })

    for (const inv of pendingInvestments) {
      const amount = inv.pendingSipAmount
      if (amount <= 0) {
        inv.pendingSipAmount = 0
        inv.pendingSipReflectDate = null
        await inv.save()
        continue
      }

      inv.investedAmount = (inv.investedAmount || 0) + amount

      if (inv.currentNAV && inv.currentNAV > 0) {
        inv.units = (inv.units || 0) + amount / inv.currentNAV
        inv.currentValue = inv.units * inv.currentNAV
      } else {
        inv.currentValue = (inv.currentValue || 0) + amount
      }

      inv.notes = `${inv.notes || ''} | SIP credited after 3 days: ₹${amount}`.trim()
      inv.pendingSipAmount = 0
      inv.pendingSipReflectDate = null
      await inv.save()
    }
  } catch (error) {
    console.error('Failed to process SIP reflection updates:', error)
  }
}

export const scheduleDailyEMICreation = (task) => {
  const now = new Date()
  const nextRun = new Date(now)
  nextRun.setHours(24, 0, 0, 0)
  const delay = nextRun.getTime() - now.getTime()

  setTimeout(() => {
    task()
    setInterval(task, DAILY_INTERVAL_MS)
  }, delay)
}

// Schedule both EMI and SIP auto deduction
export const scheduleDailyExpenseCreation = () => {
  createDailyEMIExpenses()
  createDailySIPExpenses()
  processDailySipReflects()
  setInterval(createDailyEMIExpenses, DAILY_INTERVAL_MS)
  setInterval(createDailySIPExpenses, DAILY_INTERVAL_MS)
  setInterval(processDailySipReflects, DAILY_INTERVAL_MS)
}
