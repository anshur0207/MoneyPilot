import mongoose from 'mongoose'
import dotenv from 'dotenv'
import MutualFund from '../models/MutualFund.js'
import { connectDatabase } from '../config/database.js'

dotenv.config()

const demoMutualFunds = [
  {
    schemeCode: 'INF090I01R73',
    schemeName: 'ICICI Prudential Balanced Advantage Fund - Direct Plan',
    category: 'Balanced',
    fundHouse: 'ICICI Prudential',
    currentNAV: 352.45,
    returns1Y: 15.2,
    returns3Y: 12.8,
    returns5Y: 11.5,
    expense_ratio: 0.63,
    aum: 25000,
    fundManager: 'Vikram Subramanian',
    riskRating: 'Moderate',
  },
  {
    schemeCode: 'INF174AAFB07',
    schemeName: 'Aditya Birla Sun Life Equity Fund - Direct Plan',
    category: 'Equity',
    fundHouse: 'Aditya Birla Sun Life',
    currentNAV: 258.74,
    returns1Y: 22.3,
    returns3Y: 18.9,
    returns5Y: 16.2,
    expense_ratio: 0.85,
    aum: 18500,
    fundManager: 'Bhaskar Iyer',
    riskRating: 'High',
  },
  {
    schemeCode: 'INF204KA2LF4',
    schemeName: 'Kotak Standard Multicap Fund - Direct Plan',
    category: 'Multicap',
    fundHouse: 'Kotak Mahindra',
    currentNAV: 425.32,
    returns1Y: 18.7,
    returns3Y: 16.4,
    returns5Y: 14.8,
    expense_ratio: 0.78,
    aum: 22000,
    fundManager: 'Anand Radhakrishnan',
    riskRating: 'Moderate',
  },
  {
    schemeCode: 'INF209KA7IY8',
    schemeName: 'Kotak Corporate Bond Fund - Direct Plan',
    category: 'Debt',
    fundHouse: 'Kotak Mahindra',
    currentNAV: 310.15,
    returns1Y: 7.2,
    returns3Y: 6.8,
    returns5Y: 6.5,
    expense_ratio: 0.45,
    aum: 12000,
    fundManager: 'Sandeep Mohta',
    riskRating: 'Low',
  },
  {
    schemeCode: 'INF105FA7FI4',
    schemeName: 'Franklin India Bluechip Fund - Direct Plan',
    category: 'Large Cap',
    fundHouse: 'Franklin Templeton',
    currentNAV: 468.92,
    returns1Y: 20.1,
    returns3Y: 17.3,
    returns5Y: 15.9,
    expense_ratio: 0.72,
    aum: 28000,
    fundManager: 'Sunil Singhania',
    riskRating: 'Moderate',
  },
]

async function seedMutualFunds() {
  try {
    await connectDatabase()

    // Clear existing funds
    await MutualFund.deleteMany({})

    // Insert demo funds
    const result = await MutualFund.insertMany(demoMutualFunds)

    console.log(`✅ ${result.length} mutual funds seeded successfully`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding mutual funds:', error)
    process.exit(1)
  }
}

seedMutualFunds()
