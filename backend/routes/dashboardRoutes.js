import express from 'express'
import {
  getDashboardSummary,
  getHealthScore,
} from '../controllers/dashboardController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/summary', getDashboardSummary)
router.get('/health-score', getHealthScore)

export default router
