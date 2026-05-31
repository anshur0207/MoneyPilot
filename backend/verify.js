import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    const db = mongoose.connection.db
    
    const investmentCount = await db.collection('investments').countDocuments()
    const mfCount = await db.collection('mutualfunds').countDocuments()
    
    const mfInvestments = await db.collection('investments')
      .find({ isMutualFund: true })
      .project({ name: 1, schemeCode: 1, fundHouse: 1, units: 1, currentNAV: 1, currentValue: 1 })
      .toArray()
    
    const mfRecords = await db.collection('mutualfunds')
      .find({})
      .project({ schemeName: 1, schemeCode: 1, fundHouse: 1, category: 1, currentNAV: 1, riskRating: 1 })
      .toArray()
    
    console.log('\n📊 DATABASE SUMMARY')
    console.log('═'.repeat(60))
    console.log(`Total Investments: ${investmentCount}`)
    console.log(`Total Mutual Funds (Master): ${mfCount}`)
    
    console.log('\n💰 MUTUAL FUND INVESTMENTS (User Portfolio)')
    console.log('─'.repeat(60))
    mfInvestments.forEach((inv, i) => {
      console.log(`\n${i+1}. ${inv.name}`)
      console.log(`   Scheme Code: ${inv.schemeCode}`)
      console.log(`   Fund House: ${inv.fundHouse}`)
      console.log(`   Units: ${inv.units}`)
      console.log(`   NAV: ₹${inv.currentNAV}`)
      console.log(`   Value: ₹${inv.currentValue}`)
    })
    
    console.log('\n\n📚 MUTUAL FUND MASTER DATA')
    console.log('─'.repeat(60))
    mfRecords.forEach((fund, i) => {
      console.log(`\n${i+1}. ${fund.schemeName}`)
      console.log(`   Code: ${fund.schemeCode}`)
      console.log(`   House: ${fund.fundHouse}`)
      console.log(`   Category: ${fund.category}`)
      console.log(`   NAV: ₹${fund.currentNAV}`)
      console.log(`   Risk: ${fund.riskRating}`)
    })
    
    console.log('\n✅ Data verification complete!')
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

checkData()
