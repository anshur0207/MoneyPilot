import { motion } from 'framer-motion'

interface AlertProps {
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  icon?: string
}

export default function Alert({ title, message, type, icon }: AlertProps) {
  const typeStyles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    success: 'bg-green-500/10 border-green-500/30 text-green-300',
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card border ${typeStyles[type]} p-4 mb-4`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-1">{icon || '💡'}</span>
        <div>
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs opacity-90 mt-1">{message}</p>
        </div>
      </div>
    </motion.div>
  )
}
