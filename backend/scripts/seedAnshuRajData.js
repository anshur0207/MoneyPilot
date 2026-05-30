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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Anshu Raj's actual user ID and details
const ANSHU_RAJ_USER_ID = '6a191721179de3d470c2c163'
const ANSHU_RAJ_USER = {
  name: 'Anshu',
  email: 'anshur0202@gmail.com',
  monthlySalary: 97000,
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

  console.log('🌱 Seeding investment data for Anshu Raj user...')

  // Find the existing user by ID
  const user = await User.findById(ANSHU_RAJ_USER_ID)
  
  if (!user) {
    throw new Error(`User with ID ${ANSHU_RAJ_USER_ID} not found!`)
  }

  console.log(`✅ Found user: ${user.name} (${user.email})`)

  // Clear existing data for this user
  await Promise.all([
    Expense.deleteMany({ userId: user._id }),
    Investment.deleteMany({ userId: user._id }),
    Loan.deleteMany({ userId: user._id }),
    Goal.deleteMany({ userId: user._id }),
    Report.deleteMany({ userId: user._id }),
  ])

  // Seed expenses
  const expenses = await Expense.insertMany([
    {
      userId: user._id,
      amount: 22000,
      category: 'Rent',
      description: 'Apartment rent',
      date: new Date('2026-05-03'),
      recurring: true,
      paymentMethod: 'Bank Transfer',
    },
    {
      userId: user._id,
      amount: 8500,
      category: 'Food',
      description: 'Groceries and meals',
      date: new Date('2026-05-08'),
      paymentMethod: 'UPI',
    },
    {
      userId: user._id,
      amount: 5200,
      category: 'Travel',
      description: 'Cab and metro',
      date: new Date('2026-05-13'),
      paymentMethod: 'Card',
    },
    {
      userId: user._id,
      amount: 3500,
      category: 'Subscriptions',
      description: 'Software and streaming',
      date: new Date('2026-05-18'),
      recurring: true,
      paymentMethod: 'Card',
    },
    {
      userId: user._id,
      amount: 11000,
      category: 'Shopping',
      description: 'Clothing and home supplies',
      date: new Date('2026-04-21'),
      paymentMethod: 'UPI',
    },
    {
      userId: user._id,
      amount: 14000,
      category: 'EMI',
      description: 'Monthly car EMI',
      date: new Date('2026-04-05'),
      recurring: true,
      paymentMethod: 'Bank Transfer',
    },
  ])

  // Seed regular investments + mutual funds
  const investments = await Investment.insertMany([
    // Regular Investments
    {
      userId: user._id,
      type: 'SIP',
      name: 'Nifty 50 Index SIP',
      investedAmount: 200000,
      currentValue: 228000,
      monthlyContribution: 18000,
      startDate: new Date('2024-05-01'),
      expectedReturn: 14,
      riskLevel: 'Medium',
    },
    {
      userId: user._id,
      type: 'FD',
      name: 'Bank Fixed Deposit',
      investedAmount: 300000,
      currentValue: 315000,
      startDate: new Date('2025-01-01'),
      maturityDate: new Date('2027-01-01'),
      expectedReturn: 6.5,
      riskLevel: 'Low',
    },
    {
      userId: user._id,
      type: 'Stocks',
      name: 'Equity Portfolio',
      investedAmount: 150000,
      currentValue: 172500,
      monthlyContribution: 0,
      startDate: new Date('2025-07-15'),
      expectedReturn: 16,
      riskLevel: 'High',
    },
    // Mutual Fund Investments
    {
      userId: user._id,
      type: 'Mutual Fund',
      name: 'Tata Nifty 50 Index Direct',
      isMutualFund: true,
      schemeCode: '101054',
      investedAmount: 45500,
      currentValue: 44580,
      units: 123.12,
      purchaseNAV: 369.43,
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
      investedAmount: 32900,
      currentValue: 35090,
      units: 509.09,
      purchaseNAV: 64.64,
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
      investedAmount: 29000,
      currentValue: 30020,
      units: 990.36,
      purchaseNAV: 29.29,
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
      investedAmount: 10000,
      currentValue: 10040,
      units: 10.04,
      purchaseNAV: 995.81,
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
      investedAmount: 19200,
      currentValue: 33520,
      units: 1492.81,
      purchaseNAV: 12.85,
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
      investedAmount: 16000,
      currentValue: 19530,
      units: 24.96,
      purchaseNAV: 641.03,
      currentNAV: 782.4,
      fundHouse: 'Edelweiss Asset Management',
      category: 'Gold',
      riskLevel: 'Medium',
      startDate: new Date('2025-01-20'),
      lastUpdated: new Date(),
      notes: 'Gold ETF for diversification',
    },
  ])

  // Seed loans
  const loans = await Loan.insertMany([
    {
      userId: user._id,
      type: 'Car Loan',
      lenderName: 'HDFC Bank',
      principalAmount: 800000,
      remainingAmount: 480000,
      interestRate: 8.5,
      emiAmount: 14000,
      emiDate: 5,
      tenure: 72,
      startDate: new Date('2023-11-05'),
      endDate: new Date('2030-11-05'),
      paidEMI: 42,
    },
    {
      userId: user._id,
      type: 'Credit Card',
      lenderName: 'ICICI Bank',
      principalAmount: 85000,
      remainingAmount: 25000,
      interestRate: 36,
      emiAmount: 8000,
      emiDate: 15,
      tenure: 12,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2027-01-15'),
      paidEMI: 5,
    },
  ])

  // Seed goals
  const goals = await Goal.insertMany([
    {
      userId: user._id,
      name: 'Emergency Fund',
      description: 'Six months of core expenses',
      category: 'Emergency Fund',
      targetAmount: 600000,
      savedAmount: 315000,
      deadline: new Date('2026-12-31'),
      priority: 'High',
      status: 'Active',
    },
    {
      userId: user._id,
      name: 'Dream Vacation',
      description: 'International travel fund',
      category: 'Travel',
      targetAmount: 350000,
      savedAmount: 120000,
      deadline: new Date('2027-06-30'),
      priority: 'Medium',
      status: 'Active',
    },
    {
      userId: user._id,
      name: 'Home Down Payment',
      description: 'Save for house purchase',
      category: 'Home',
      targetAmount: 2500000,
      savedAmount: 450000,
      deadline: new Date('2029-12-31'),
      priority: 'High',
      status: 'Active',
    },
  ])

  // Seed reports
  const reports = await Report.insertMany([
    {
      userId: user._id,
      month: 5,
      year: 2026,
      totalIncome: ANSHU_RAJ_USER.monthlySalary,
      totalExpense: 36700,
      totalInvestment: 18000,
      netWorth: 750000,
      savingsRate: 64,
      expensesByCategory: new Map([
        ['Rent', 22000],
        ['Food', 8500],
        ['Travel', 5200],
        ['Subscriptions', 3500],
      ]),
      investmentGains: 87500,
      recommendations: [
        'Excellent savings rate! Continue with SIP investments.',
        'Consider increasing emergency fund allocation.',
      ],
    },
    {
      userId: user._id,
      month: 4,
      year: 2026,
      totalIncome: ANSHU_RAJ_USER.monthlySalary,
      totalExpense: 28000,
      totalInvestment: 18000,
      netWorth: 730000,
      savingsRate: 67,
      expensesByCategory: new Map([
        ['Shopping', 11000],
        ['EMI', 14000],
      ]),
      investmentGains: 82000,
      recommendations: ['Shopping expenses were high. Focus on discretionary spending.'],
    },
  ])

  console.log('\n✅ Anshu Raj user seeded with complete investment data!')
  console.log(`\n📊 Summary:`)
  console.log(`   User: ${user.name}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Password: ${ANSHU_RAJ_USER.password}`)
  console.log(`   Monthly Salary: ₹${ANSHU_RAJ_USER.monthlySalary.toLocaleString()}`)
  
  console.log(`\n📋 Data Seeded:`)
  console.log(`   Expenses: ${expenses.length}`)
  console.log(`   Investments (Total): ${investments.length}`)
  console.log(`   Loans: ${loans.length}`)
  console.log(`   Goals: ${goals.length}`)
  console.log(`   Reports: ${reports.length}`)
  
  const mfInvestments = investments.filter(inv => inv.isMutualFund)
  const regularInvestments = investments.filter(inv => !inv.isMutualFund)
  
  console.log(`\n💰 Investment Breakdown:`)
  console.log(`   Regular Investments: ${regularInvestments.length} (SIP, FD, Stocks)`)
  console.log(`   Mutual Funds: ${mfInvestments.length}`)
  
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  
  console.log(`\n💼 Total Portfolio:`)
  console.log(`   Total Invested: ₹${totalInvested.toLocaleString()}`)
  console.log(`   Current Value: ₹${totalValue.toLocaleString()}`)
  console.log(`   Total Gain: ₹${(totalValue - totalInvested).toLocaleString()}`)
  
  console.log(`\n🎯 Mutual Funds:`)
  mfInvestments.forEach((inv, i) => {
    console.log(`   ${i + 1}. ${inv.name} (${inv.schemeCode})`)
    console.log(`      Value: ₹${inv.currentValue.toLocaleString()}`)
  })

  process.exit(0)
}

seed()
  .catch((error) => {
    console.error('❌ MongoDB seed failed:', error.message)
    process.exit(1)
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
