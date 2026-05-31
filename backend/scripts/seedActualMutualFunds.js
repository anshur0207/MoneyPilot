import mongoose from 'mongoose'
import dotenv from 'dotenv'
import MutualFund from '../models/MutualFund.js'
import { connectDatabase } from '../config/database.js'

dotenv.config()

// Demo mutual funds with scheme codes - with latest realistic NAVs
const demoMutualFunds = [
  {
    schemeCode: '101054',
    schemeName: 'Tata Nifty 50 Index Direct',
    category: 'Equity',
    fundHouse: 'Tata Asset Management',
    currentNAV: 362.45,
    previousNAV: 359.20,
    returns1Y: 15.2,
    returns3Y: 18.5,
    returns5Y: 14.8,
    expense_ratio: 0.2,
    riskRating: 'Moderate',
  },
  {
    schemeCode: '119599',
    schemeName: 'Nippon India Small Cap Fund Direct',
    category: 'Equity',
    fundHouse: 'Nippon Life India Asset Management',
    currentNAV: 68.92,
    previousNAV: 67.50,
    returns1Y: 22.3,
    returns3Y: 28.5,
    returns5Y: 32.1,
    expense_ratio: 0.75,
    riskRating: 'High',
  },
  {
    schemeCode: '108513',
    schemeName: 'Quant Mid Cap Fund Direct',
    category: 'Equity',
    fundHouse: 'Quant Capital',
    currentNAV: 30.33,
    previousNAV: 29.85,
    returns1Y: 18.9,
    returns3Y: 24.3,
    returns5Y: 28.7,
    expense_ratio: 0.65,
    riskRating: 'High',
  },
  {
    schemeCode: '101462',
    schemeName: 'Mirae Asset Liquid Fund',
    category: 'Liquid',
    fundHouse: 'Mirae Asset Global Investments',
    currentNAV: 1000.40,
    previousNAV: 1000.30,
    returns1Y: 5.2,
    returns3Y: 5.1,
    returns5Y: 5.0,
    expense_ratio: 0.25,
    riskRating: 'Low',
  },
  {
    schemeCode: '110555',
    schemeName: 'Quant ELSS Tax Saver Fund',
    category: 'ELSS',
    fundHouse: 'Quant Capital',
    currentNAV: 22.45,
    previousNAV: 22.10,
    returns1Y: 16.8,
    returns3Y: 22.5,
    returns5Y: 26.3,
    expense_ratio: 0.55,
    riskRating: 'Moderate',
  },
  {
    schemeCode: '100031',
    schemeName: 'Edelweiss Gold ETF',
    category: 'Gold',
    fundHouse: 'Edelweiss Asset Management',
    currentNAV: 782.40,
    previousNAV: 780.50,
    returns1Y: 9.5,
    returns3Y: 8.2,
    returns5Y: 7.8,
    expense_ratio: 0.35,
    riskRating: 'Moderate',
  },
]

async function seedActualMutualFunds() {
  try {
    await connectDatabase()

    console.log('🔄 Seeding mutual fund data with current NAVs...')

    // Clear existing funds
    await MutualFund.deleteMany({})

    const result = await MutualFund.insertMany(demoMutualFunds)

    console.log(`✅ ${result.length} mutual funds seeded successfully`)
    console.log('📋 Seeded Funds with Current NAVs:')
    result.forEach((fund) => {
      console.log(`   • ${fund.schemeName}`)
      console.log(`     Scheme Code: ${fund.schemeCode}`)
      console.log(`     Current NAV: ₹${fund.currentNAV}`)
      console.log(`     Fund House: ${fund.fundHouse}`)
      console.log(`     Category: ${fund.category}\n`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding mutual funds:', error.message)
    process.exit(1)
  }
}

seedActualMutualFunds()
