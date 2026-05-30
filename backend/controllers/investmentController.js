import Investment from '../models/Investment.js'

export const getInvestments = async (req, res, next) => {
  try {
    const { type, limit = 50, skip = 0 } = req.query

    const filter = { userId: req.user.userId }
    if (type) filter.type = type

    const investments = await Investment.find(filter)
      .sort({ startDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Investment.countDocuments(filter)

    // Calculate summary
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0)
    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalGains = totalValue - totalInvested

    res.json({
      investments,
      total,
      summary: { totalInvested, totalValue, totalGains },
      limit,
      skip,
    })
  } catch (error) {
    next(error)
  }
}

export const addInvestment = async (req, res, next) => {
  try {
    const {
      type,
      name,
      investedAmount,
      currentValue,
      monthlyContribution,
      startDate,
      maturityDate,
      expectedReturn,
      riskLevel,
      notes,
    } = req.body

    const investment = new Investment({
      userId: req.user.userId,
      type,
      name,
      investedAmount,
      currentValue,
      monthlyContribution,
      startDate: new Date(startDate),
      maturityDate: maturityDate ? new Date(maturityDate) : null,
      expectedReturn,
      riskLevel,
      notes,
    })

    await investment.save()

    res.status(201).json({
      message: 'Investment added successfully',
      investment,
    })
  } catch (error) {
    next(error)
  }
}

export const updateInvestment = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const investment = await Investment.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateData,
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

export const deleteInvestment = async (req, res, next) => {
  try {
    const { id } = req.params

    const investment = await Investment.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    })

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' })
    }

    res.json({ message: 'Investment deleted successfully' })
  } catch (error) {
    next(error)
  }
}
