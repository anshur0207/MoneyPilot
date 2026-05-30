import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  getMonthlyIncome,
  addIncome,
  updateIncome,
  deleteIncome,
  getIncomeHistory,
} from '../controllers/incomeController.js'

const router = Router()

router.use(authenticateToken)

// Get total income for a specific month/year
router.get('/', getMonthlyIncome)

// Get income history (multiple months)
router.get('/history', getIncomeHistory)

// Add income
router.post('/', addIncome)

// Update income
router.put('/:id', updateIncome)

// Delete income
router.delete('/:id', deleteIncome)

export default router
