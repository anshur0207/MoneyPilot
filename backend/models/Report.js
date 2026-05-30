import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
    totalInvestment: {
      type: Number,
      default: 0,
    },
    netWorth: {
      type: Number,
      default: 0,
    },
    savingsRate: {
      type: Number,
      default: 0,
    },
    expensesByCategory: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    investmentGains: {
      type: Number,
      default: 0,
    },
    recommendations: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

reportSchema.index({ userId: 1, year: 1, month: 1 })

export default mongoose.model('Report', reportSchema)
