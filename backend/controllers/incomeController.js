import Income from '../models/Income.js'

// Get total income for a month/year
export const getMonthlyIncome = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const now = new Date()
    
    const m = month !== undefined && month !== null && month !== '' ? parseInt(month) : now.getMonth()
    const y = year !== undefined && year !== null && year !== '' ? parseInt(year) : now.getFullYear()

    const incomes = await Income.find({
      userId: req.user.userId,
      month: m,
      year: y,
    })

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

    res.json({
      month: m,
      year: y,
      totalIncome,
      incomes,
    })
  } catch (error) {
    next(error)
  }
}

// Add income
export const addIncome = async (req, res, next) => {
  try {
    const { amount, month, year, type = 'salary', description } = req.body

    if (!amount || month === undefined || !year) {
      return res.status(400).json({ message: 'Amount, month, and year are required' })
    }

    const income = new Income({
      userId: req.user.userId,
      amount,
      month: parseInt(month),
      year: parseInt(year),
      type,
      description,
    })

    await income.save()

    res.status(201).json({
      message: 'Income added successfully',
      income,
    })
  } catch (error) {
    next(error)
  }
}

// Update income
export const updateIncome = async (req, res, next) => {
  try {
    const { id } = req.params
    const { amount, type, description } = req.body

    const income = await Income.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { amount, type, description },
      { new: true }
    )

    if (!income) {
      return res.status(404).json({ message: 'Income not found' })
    }

    res.json({
      message: 'Income updated successfully',
      income,
    })
  } catch (error) {
    next(error)
  }
}

// Delete income
export const deleteIncome = async (req, res, next) => {
  try {
    const { id } = req.params

    const income = await Income.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    })

    if (!income) {
      return res.status(404).json({ message: 'Income not found' })
    }

    res.json({
      message: 'Income deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// Get income history (multiple months)
export const getIncomeHistory = async (req, res, next) => {
  try {
    const { startMonth, startYear, endMonth, endYear } = req.query

    const query = { userId: req.user.userId }

    if (startMonth !== undefined && startYear !== undefined) {
      const startDate = new Date(parseInt(startYear), parseInt(startMonth), 1)
      const endDate = new Date(parseInt(endYear || startYear), parseInt(endMonth || startMonth) + 1, 0)

      query.date = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    const incomes = await Income.find(query).sort({ year: -1, month: -1 })

    res.json({
      incomes,
    })
  } catch (error) {
    next(error)
  }
}
