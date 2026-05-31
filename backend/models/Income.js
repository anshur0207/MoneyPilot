import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 0,
      max: 11,
    },
    year: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['salary', 'bonus', 'freelance', 'other'],
      default: 'salary',
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Compound unique index: one entry per user per month/year
incomeSchema.index({ userId: 1, month: 1, year: 1, type: 1 }, { unique: true })

export default mongoose.model('Income', incomeSchema)
