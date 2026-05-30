import mongoose from 'mongoose'

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Personal Loan', 'Home Loan', 'Car Loan', 'Credit Card', 'Other'],
      required: true,
    },
    lenderName: {
      type: String,
      required: true,
    },
    principalAmount: {
      type: Number,
      required: true,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    emiAmount: {
      type: Number,
      required: true,
    },
    emiDate: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paidEMI: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

loanSchema.index({ userId: 1, endDate: 1 })

export default mongoose.model('Loan', loanSchema)
