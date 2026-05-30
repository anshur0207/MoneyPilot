import Goal from '../models/Goal.js'

export const getGoals = async (req, res, next) => {
  try {
    const { status, limit = 50, skip = 0 } = req.query

    const filter = { userId: req.user.userId }
    if (status) filter.status = status

    const goals = await Goal.find(filter)
      .sort({ priority: -1, deadline: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Goal.countDocuments(filter)

    res.json({ goals, total, limit, skip })
  } catch (error) {
    next(error)
  }
}

export const addGoal = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      targetAmount,
      deadline,
      priority,
      emoji,
    } = req.body

    const goal = new Goal({
      userId: req.user.userId,
      name,
      description,
      category,
      targetAmount,
      deadline: new Date(deadline),
      priority,
      emoji,
    })

    await goal.save()

    res.status(201).json({
      message: 'Goal added successfully',
      goal,
    })
  } catch (error) {
    next(error)
  }
}

export const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params
    const { savedAmount, status, ...rest } = req.body

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { ...rest, ...(savedAmount && { savedAmount }), ...(status && { status }) },
      { new: true }
    )

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    res.json({
      message: 'Goal updated successfully',
      goal,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params

    const goal = await Goal.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    })

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    res.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    next(error)
  }
}
