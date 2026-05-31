import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import path from 'path'

import User from '../models/User.js'
import Expense from '../models/Expense.js'
import Investment from '../models/Investment.js'
import Loan from '../models/Loan.js'
import Goal from '../models/Goal.js'
import Report from '../models/Report.js'
import { hashPassword } from '../utils/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'demo123',
  monthlySalary: 125000,
  currency: 'INR',
  preferences: {
    darkMode: true,
    notifications: true,
    currency: 'INR',
  },
}

const connect = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in backend/.env')
  }

  await mongoose.connect(process.env.MONGODB_URI)
}

const seed = async () => {
  await connect()

  const password = await hashPassword(DEMO_USER.password)
  const user = await User.findOneAndUpdate(
    { email: DEMO_USER.email },
    {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      password,
      monthlySalary: DEMO_USER.monthlySalary,
      currency: DEMO_USER.currency,
      preferences: DEMO_USER.preferences,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  await Promise.all([
    Expense.deleteMany({ userId: user._id }),
    Investment.deleteMany({ userId: user._id }),
    Loan.deleteMany({ userId: user._id }),
    Goal.deleteMany({ userId: user._id }),
    Report.deleteMany({ userId: user._id }),
  ])

  const expenses = await Expense.insertMany([
    {
      userId: user._id,
      amount: 18500,
      category: 'Rent',
      description: 'Apartment rent',
      date: new Date('2026-05-03'),
      recurring: true,
      paymentMethod: 'Bank Transfer',
    },
    {
      userId: user._id,
      amount: 6800,
      category: 'Food',
      description: 'Groceries and meals',
      date: new Date('2026-05-08'),
      paymentMethod: 'UPI',
    },
    {
      userId: user._id,
      amount: 4200,
      category: 'Travel',
      description: 'Cab and metro',
      date: new Date('2026-05-13'),
      paymentMethod: 'Card',
    },
    {
      userId: user._id,
      amount: 3100,
      category: 'Subscriptions',
      description: 'Software and streaming',
      date: new Date('2026-05-18'),
      recurring: true,
      paymentMethod: 'Card',
    },
    {
      userId: user._id,
      amount: 9400,
      category: 'Shopping',
      description: 'Clothing and home supplies',
      date: new Date('2026-04-21'),
      paymentMethod: 'UPI',
    },
    {
      userId: user._id,
      amount: 12500,
      category: 'EMI',
      description: 'Monthly car EMI',
      date: new Date('2026-04-05'),
      recurring: true,
      paymentMethod: 'Bank Transfer',
    },
  ])

  const investments = await Investment.insertMany([
    // Regular Investments
    {
      userId: user._id,
      type: 'SIP',
      name: 'Nifty Index SIP',
      investedAmount: 180000,
      currentValue: 205500,
      monthlyContribution: 15000,
      startDate: new Date('2024-06-01'),
      expectedReturn: 12,
      riskLevel: 'Medium',
    },
    {
      userId: user._id,
      type: 'FD',
      name: 'Emergency Fixed Deposit',
      investedAmount: 250000,
      currentValue: 263000,
      startDate: new Date('2025-01-15'),
      maturityDate: new Date('2027-01-15'),
      expectedReturn: 7,
      riskLevel: 'Low',
    },
    {
      userId: user._id,
      type: 'Stocks',
      name: 'Bluechip Equity Basket',
      investedAmount: 120000,
      currentValue: 137800,
      monthlyContribution: 0,
      startDate: new Date('2025-08-10'),
      expectedReturn: 14,
      riskLevel: 'High',
    },
    // Mutual Fund Investments
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Tata Nifty 50 Index Direct',
      isMutualFund: true,
      schemeCode: '101054',
      investedAmount: 50000,
      currentValue: 45250,
      units: 125,
      purchaseNAV: 400,
      currentNAV: 362,
      fundHouse: 'Tata Asset Management',
      category: 'Equity',
      riskLevel: 'Medium',
      startDate: new Date('2025-03-15'),
      lastUpdated: new Date(),
      notes: 'Direct plan equity index fund',
    },
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Nippon India Small Cap Fund Direct',
      isMutualFund: true,
      schemeCode: '119599',
      investedAmount: 60000,
      currentValue: 34460,
      units: 500,
      purchaseNAV: 120,
      currentNAV: 68.92,
      fundHouse: 'Nippon Life India Asset Management',
      category: 'Equity',
      riskLevel: 'High',
      startDate: new Date('2025-02-01'),
      lastUpdated: new Date(),
      notes: 'Small cap focused fund',
    },
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Quant Mid Cap Fund Direct',
      isMutualFund: true,
      schemeCode: '108513',
      investedAmount: 45000,
      currentValue: 30330,
      units: 1000,
      purchaseNAV: 45,
      currentNAV: 30.33,
      fundHouse: 'Quant Capital',
      category: 'Equity',
      riskLevel: 'High',
      startDate: new Date('2025-01-10'),
      lastUpdated: new Date(),
      notes: 'Mid cap equity fund',
    },
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Mirae Asset Liquid Fund',
      isMutualFund: true,
      schemeCode: '101462',
      investedAmount: 100000,
      currentValue: 10040,
      units: 9950,
      purchaseNAV: 1000.5,
      currentNAV: 1000.401,
      fundHouse: 'Mirae Asset Global Investments',
      category: 'Liquid',
      riskLevel: 'Low',
      startDate: new Date('2024-12-15'),
      lastUpdated: new Date(),
      notes: 'Liquid fund for emergency fund',
    },
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Quant ELSS Tax Saver Fund',
      isMutualFund: true,
      schemeCode: '110555',
      investedAmount: 50000,
      currentValue: 33670,
      units: 1500,
      purchaseNAV: 33.33,
      currentNAV: 22.45,
      fundHouse: 'Quant Capital',
      category: 'ELSS',
      riskLevel: 'Medium',
      startDate: new Date('2025-04-01'),
      lastUpdated: new Date(),
      notes: 'ELSS fund for tax saving',
    },
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Edelweiss Gold ETF',
      isMutualFund: true,
      schemeCode: '100031',
      investedAmount: 50000,
      currentValue: 19560,
      units: 25,
      purchaseNAV: 2000,
      currentNAV: 782.4,
      fundHouse: 'Edelweiss Asset Management',
      category: 'Gold',
      riskLevel: 'Medium',
      startDate: new Date('2025-01-20'),
      lastUpdated: new Date(),
      notes: 'Gold ETF for diversification',
    },
  ])

  const loans = await Loan.insertMany([
    {
      userId: user._id,
      type: 'Car Loan',
      lenderName: 'HDFC Bank',
      principalAmount: 650000,
      remainingAmount: 410000,
      interestRate: 8.7,
      emiAmount: 12500,
      emiDate: 5,
      tenure: 60,
      startDate: new Date('2024-01-05'),
      endDate: new Date('2029-01-05'),
      paidEMI: 28,
    },
    {
      userId: user._id,
      type: 'Credit Card',
      lenderName: 'ICICI Bank',
      principalAmount: 58000,
      remainingAmount: 18000,
      interestRate: 36,
      emiAmount: 6000,
      emiDate: 12,
      tenure: 10,
      startDate: new Date('2026-02-12'),
      endDate: new Date('2026-12-12'),
      paidEMI: 4,
    },
  ])

  const goals = await Goal.insertMany([
    {
      userId: user._id,
      name: 'Emergency Fund',
      description: 'Six months of core expenses',
      category: 'Emergency Fund',
      targetAmount: 450000,
      savedAmount: 263000,
      deadline: new Date('2026-12-31'),
      priority: 'High',
      status: 'Active',
    },
    {
      userId: user._id,
      name: 'Japan Trip',
      description: 'Travel fund for vacation',
      category: 'Travel',
      targetAmount: 220000,
      savedAmount: 76000,
      deadline: new Date('2027-04-30'),
      priority: 'Medium',
      status: 'Active',
    },
    {
      userId: user._id,
      name: 'New Laptop',
      description: 'Upgrade work setup',
      category: 'Other',
      targetAmount: 160000,
      savedAmount: 160000,
      deadline: new Date('2026-03-31'),
      priority: 'Low',
      status: 'Completed',
    },
  ])

  const reports = await Report.insertMany([
    {
      userId: user._id,
      month: 4,
      year: 2026,
      totalIncome: DEMO_USER.monthlySalary,
      totalExpense: 32600,
      totalInvestment: 15000,
      netWorth: 552300,
      savingsRate: 62,
      expensesByCategory: new Map([
        ['Rent', 18500],
        ['Food', 6800],
        ['Travel', 4200],
        ['Subscriptions', 3100],
      ]),
      investmentGains: 56300,
      recommendations: [
        'Keep credit card utilization low.',
        'Increase SIP contribution after the emergency fund is complete.',
      ],
    },
    {
      userId: user._id,
      month: 3,
      year: 2026,
      totalIncome: DEMO_USER.monthlySalary,
      totalExpense: 21900,
      totalInvestment: 15000,
      netWorth: 531000,
      savingsRate: 70,
      expensesByCategory: new Map([
        ['Shopping', 9400],
        ['EMI', 12500],
      ]),
      investmentGains: 51000,
      recommendations: ['Shopping stayed high this month. Review discretionary purchases.'],
    },
  ])

  console.log('MongoDB seed complete')
  console.table({
    users: 1,
    expenses: expenses.length,
    investments: investments.length,
    loans: loans.length,
    goals: goals.length,
    reports: reports.length,
  })
  console.log(`Login email: ${DEMO_USER.email}`)
  console.log(`Login password: ${DEMO_USER.password}`)
}

seed()
  .catch((error) => {
    console.error('MongoDB seed failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
