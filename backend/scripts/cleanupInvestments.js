import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import path from 'path'

import Investment from '../models/Investment.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moneypilot'
  await mongoose.connect(uri)
}

const cleanup = async () => {
  await connect()

  const result = await Investment.deleteMany({ type: { $ne: 'Mutual Fund' } })
  console.log(`✅ Removed ${result.deletedCount} non-mutual-fund investment records from the database.`)

  await mongoose.disconnect()
}

cleanup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Cleanup failed:', error.message)
    process.exit(1)
  })
