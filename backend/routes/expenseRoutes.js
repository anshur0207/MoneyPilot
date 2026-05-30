import express from 'express'
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics,
} from '../controllers/expenseController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', getExpenses)
router.post('/', addExpense)
router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)
router.get('/analytics', getExpenseAnalytics)

export default router
