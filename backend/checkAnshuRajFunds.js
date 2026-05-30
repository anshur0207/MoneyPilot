import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function checkData() {
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
    
    console.log(`\n✅ Found Anshu Raj: ${user._id}`)
    
    // Find mutual funds for this user
    const mfInvestments = await db.collection('investments')
      .find({ userId: user._id, isMutualFund: true })
      .toArray()
    
    console.log(`\n📊 Mutual Fund Investments for Anshu Raj: ${mfInvestments.length}`)
    
    if (mfInvestments.length > 0) {
      mfInvestments.forEach((inv, i) => {
        console.log(`\n${i+1}. ${inv.name}`)
        console.log(`   Scheme Code: ${inv.schemeCode}`)
        console.log(`   Fund House: ${inv.fundHouse}`)
        console.log(`   Current Value: ₹${inv.currentValue}`)
      })
    } else {
      console.log('❌ No mutual fund investments found!')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

checkData()
