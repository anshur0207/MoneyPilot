import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  count?: number
}

export default function LoadingSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="card h-24 rounded-2xl"
        />
      ))}
    </div>
  )
}
