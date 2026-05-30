import express from 'express'
import {
  addMutualFundInvestment,
  getMutualFundPortfolio,
  calculateXirrFromTransactions,
  searchMutualFunds,
  getFundDetails,
  getHistoricalChartData,
  updateAllNAVs,
  getMutualFundDetails,
  updateMutualFundInvestment,
  deleteMutualFundInvestment,
  compareFunds,
  getLatestNAVForFunds,
} from '../controllers/mutualFundController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Specific routes first (before :id parameter routes)
router.get('/portfolio', getMutualFundPortfolio)
router.post('/calculate-xirr', calculateXirrFromTransactions)
router.post('/update-all-navs', updateAllNAVs)
router.post('/add', addMutualFundInvestment)
router.post('/compare', compareFunds)
router.post('/get-navs', getLatestNAVForFunds)

// Search and fund info routes
router.get('/search/funds', searchMutualFunds)
router.post('/search/funds', searchMutualFunds)
router.get('/fund-details/:schemeCode', getFundDetails)
router.get('/chart/:schemeCode', getHistoricalChartData)

// Parameter-based routes (these go last)
router.put('/update/:id', updateMutualFundInvestment)
router.delete('/:id', deleteMutualFundInvestment)
router.get('/:id', getMutualFundDetails)

export default router
