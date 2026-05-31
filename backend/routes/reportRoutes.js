import express from 'express'
import {
  generateMonthlyReport,
  getAnalytics,
} from '../controllers/reportController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/monthly', generateMonthlyReport)
router.get('/analytics', getAnalytics)

export default router
