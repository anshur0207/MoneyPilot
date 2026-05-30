import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Marriage', 'Travel', 'Vehicle', 'Education', 'Home', 'Emergency Fund', 'Other'],
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Abandoned'],
      default: 'Active',
    },
    emoji: {
      type: String,
      default: '🎯',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

goalSchema.index({ userId: 1, status: 1 })

export default mongoose.model('Goal', goalSchema)
