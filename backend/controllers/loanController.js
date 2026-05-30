import Loan from '../models/Loan.js'

export const getLoans = async (req, res, next) => {
  try {
    const { type, limit = 50, skip = 0 } = req.query

    const filter = { userId: req.user.userId }
    if (type) filter.type = type

    const loans = await Loan.find(filter)
      .sort({ endDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Loan.countDocuments(filter)

    // Calculate summary
    const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principalAmount, 0)
    const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
    const totalEMI = loans.reduce((sum, loan) => sum + loan.emiAmount, 0)

    res.json({
      loans,
      total,
      summary: { totalPrincipal, totalRemaining, totalEMI },
      limit,
      skip,
    })
  } catch (error) {
    next(error)
  }
}

export const addLoan = async (req, res, next) => {
  try {
    const {
      type,
      lenderName,
      principalAmount,
      interestRate,
      emiAmount,
      emiDate,
      tenure,
      startDate,
      endDate,
      notes,
    } = req.body

    const loan = new Loan({
      userId: req.user.userId,
      type,
      lenderName,
      principalAmount,
      remainingAmount: principalAmount,
      interestRate,
      emiAmount,
      emiDate,
      tenure,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      notes,
    })

    await loan.save()

    res.status(201).json({
      message: 'Loan added successfully',
      loan,
    })
  } catch (error) {
    next(error)
  }
}

export const updateLoan = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const loan = await Loan.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateData,
      { new: true }
    )

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' })
    }

    res.json({
      message: 'Loan updated successfully',
      loan,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteLoan = async (req, res, next) => {
  try {
    const { id } = req.params

    const loan = await Loan.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    })

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' })
    }

    res.json({ message: 'Loan deleted successfully' })
  } catch (error) {
    next(error)
  }
}
