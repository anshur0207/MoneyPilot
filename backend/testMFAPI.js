import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Investment from './models/Investment.js'

dotenv.config()

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    const db = mongoose.connection.db
    
    // Find Anshu Raj user
    const user = await db.collection('users').findOne({ email: 'anshuraj@example.com' })
    
    if (!user) {
      console.log('❌ Anshu Raj user not found')
      await mongoose.disconnect()
      return
    }
    
    console.log(`✅ Found user: ${user.name} (${user._id})`)
    
    // Simulate the API endpoint logic
    const userId = user._id.toString()
    
    const mfInvestments = await Investment.find({
      userId: user._id,
      isMutualFund: true,
    }).sort({ startDate: -1 })
    
    console.log(`\n📊 API Response Data:`)
    console.log(`Mutual Funds Found: ${mfInvestments.length}`)
    
    const totalInvested = mfInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0)
    const totalValue = mfInvestments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalUnits = mfInvestments.reduce((sum, inv) => sum + (inv.units || 0), 0)
    const totalGains = totalValue - totalInvested
    
    const response = {
      portfolio: mfInvestments,
      summary: {
        totalInvested,
        totalValue,
        totalUnits,
        totalGains,
        gainPercentage: totalInvested > 0 ? ((totalGains / totalInvested) * 100).toFixed(2) : 0,
      },
    }
    
    console.log(`\n✅ API Response Summary:`)
    console.log(JSON.stringify(response.summary, null, 2))
    
    console.log(`\n💰 Funds:`)
    response.portfolio.forEach((fund, i) => {
      console.log(`${i+1}. ${fund.name} - ₹${fund.currentValue}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

testAPI()
