import mongoose from 'mongoose'

const mutualFundSchema = new mongoose.Schema(
  {
    schemeCode: {
      type: String,
      unique: true,
      required: true,
    },
    schemeName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    fundHouse: {
      type: String,
      required: true,
    },
    currentNAV: {
      type: Number,
      required: true,
    },
    previousNAV: {
      type: Number,
      default: null,
    },
    historicalNAVs: [
      {
        date: Date,
        nav: Number,
      },
    ],
    returns1Y: {
      type: Number,
      default: 0,
    },
    returns3Y: {
      type: Number,
      default: 0,
    },
    returns5Y: {
      type: Number,
      default: 0,
    },
    expense_ratio: {
      type: Number,
      default: 0,
    },
    aum: {
      type: Number,
      default: 0,
    },
    fundManager: {
      type: String,
      default: '',
    },
    riskRating: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Moderate',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

mutualFundSchema.index({ schemeCode: 1 })
mutualFundSchema.index({ category: 1 })
mutualFundSchema.index({ fundHouse: 1 })

export default mongoose.model('MutualFund', mutualFundSchema)
