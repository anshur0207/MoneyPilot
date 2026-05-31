import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['Food', 'Travel', 'Fuel', 'Shopping', 'EMI', 'Rent', 'Family', 'Subscriptions', 'Entertainment', 'Mutual Fund SIP', 'Other'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: true,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Card',
    },
    notes: {
      type: String,
      default: '',
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      default: null,
    },
    investmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Index for faster queries
expenseSchema.index({ userId: 1, date: -1 })
expenseSchema.index({ userId: 1, category: 1 })

export default mongoose.model('Expense', expenseSchema)
