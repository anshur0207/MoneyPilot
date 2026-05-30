import Expense from '../models/Expense.js'

export const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, month, year, limit = 50, skip = 0 } = req.query

    const filter = { userId: req.user.userId }

    // Handle month/year filtering
    if (month !== undefined && month !== null && month !== '') {
      const m = parseInt(month)
      const y = parseInt(year) || new Date().getFullYear()
      const monthStart = new Date(y, m, 1)
      // End of month: Get first day of next month, then subtract 1ms to get last moment of current month
      const monthEnd = new Date(y, m + 1, 1)
      monthEnd.setMilliseconds(monthEnd.getMilliseconds() - 1)
      
      filter.date = {
        $gte: monthStart,
        $lte: monthEnd
      }
    } else if (startDate || endDate) {
      // Fallback to startDate/endDate range
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    if (category) filter.category = category

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Expense.countDocuments(filter)

    res.json({ expenses, total, limit, skip })
  } catch (error) {
    next(error)
  }
}

export const addExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, paymentMethod, notes } = req.body

    const expense = new Expense({
      userId: req.user.userId,
      amount,
      category,
      description,
      date: new Date(date),
      paymentMethod,
      notes,
    })

    await expense.save()

    res.status(201).json({
      message: 'Expense added successfully',
      expense,
    })
  } catch (error) {
    next(error)
  }
}

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = {
      ...req.body,
      ...(req.body.date && { date: new Date(req.body.date) }),
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateData,
      { new: true }
    )

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({
      message: 'Expense updated successfully',
      expense,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getExpenseAnalytics = async (req, res, next) => {
  try {
    const { month = new Date().getMonth(), year = new Date().getFullYear() } = req.query

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const expenses = await Expense.find({
      userId: req.user.userId,
      date: { $gte: startDate, $lte: endDate },
    })

    const categoryBreakdown = {}
    let totalExpense = 0

    expenses.forEach((exp) => {
      if (!categoryBreakdown[exp.category]) {
        categoryBreakdown[exp.category] = 0
      }
      categoryBreakdown[exp.category] += exp.amount
      totalExpense += exp.amount
    })

    const dailyExpense = {}
    expenses.forEach((exp) => {
      const day = exp.date.toISOString().split('T')[0]
      if (!dailyExpense[day]) {
        dailyExpense[day] = 0
      }
      dailyExpense[day] += exp.amount
    })

    res.json({
      totalExpense,
      categoryBreakdown,
      dailyExpense,
      expenseCount: expenses.length,
      averageExpense: expenses.length ? totalExpense / expenses.length : 0,
    })
  } catch (error) {
    next(error)
  }
}
