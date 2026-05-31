import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from '../config/database.js'
import { errorHandler, authenticateToken } from '../middleware/auth.js'

// Import routes
import authRoutes from '../routes/authRoutes.js'
import expenseRoutes from '../routes/expenseRoutes.js'
import investmentRoutes from '../routes/investmentRoutes.js'
import mutualFundRoutes from '../routes/mutualFundRoutes.js'
import loanRoutes from '../routes/loanRoutes.js'
import goalRoutes from '../routes/goalRoutes.js'
import incomeRoutes from '../routes/incomeRoutes.js'
import dashboardRoutes from '../routes/dashboardRoutes.js'
import reportRoutes from '../routes/reportRoutes.js'
import { scheduleDailyExpenseCreation } from './services/loanExpenseScheduler.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://money-pilot-frontend-three.vercel.app'
]

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman/mobile apps)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Connect to database
await connectDatabase()

// Schedule auto EMI and SIP expense creation
scheduleDailyExpenseCreation()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/investments', investmentRoutes)
app.use('/api/mutual-funds', mutualFundRoutes)
app.use('/api/loans', loanRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/income', incomeRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MoneyPilot API is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📊 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the existing process or set a different PORT in .env.`)
  } else {
    console.error('❌ Server failed to start:', err)
  }
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})