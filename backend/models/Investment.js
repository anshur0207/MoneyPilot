import mongoose from 'mongoose'

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['SIP', 'Lump Sum', 'Stocks', 'Gold', 'Crypto', 'FD', 'PF', 'Savings Account', 'Mutual Fund'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    investedAmount: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    monthlyContribution: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    maturityDate: {
      type: Date,
      default: null,
    },
    expectedReturn: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    notes: {
      type: String,
      default: '',
    },
    // Mutual Fund Specific Fields
    isMutualFund: {
      type: Boolean,
      default: false,
    },
    schemeCode: {
      type: String,
      default: null,
    },
    units: {
      type: Number,
      default: null,
    },
    purchaseNAV: {
      type: Number,
      default: null,
    },
    currentNAV: {
      type: Number,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: null,
    },
    historicalNAVs: [
      {
        date: Date,
        nav: Number,
      },
    ],
    category: {
      type: String,
      default: null,
    },
    fundHouse: {
      type: String,
      default: null,
    },
    pendingSipAmount: {
      type: Number,
      default: 0,
    },
    pendingSipReflectDate: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

investmentSchema.index({ userId: 1, type: 1 })
investmentSchema.index({ lastUpdated: -1 })

export default mongoose.model('Investment', investmentSchema)
