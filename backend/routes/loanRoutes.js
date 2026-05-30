import express from 'express'
import {
  getLoans,
  addLoan,
  updateLoan,
  deleteLoan,
} from '../controllers/loanController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', getLoans)
router.post('/', addLoan)
router.put('/:id', updateLoan)
router.delete('/:id', deleteLoan)

export default router
