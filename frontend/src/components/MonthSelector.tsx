import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface MonthSelectorProps {
  month: number
  year: number
  onMonthChange: (month: number, year: number) => void
}

export default function MonthSelector({ month, year, onMonthChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(11, year - 1)
    } else {
      onMonthChange(month - 1, year)
    }
    setIsOpen(false)
  }

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(0, year + 1)
    } else {
      onMonthChange(month + 1, year)
    }
    setIsOpen(false)
  }

  const handleSelectMonth = (newMonth: number, newYear: number) => {
    onMonthChange(newMonth, newYear)
    setIsOpen(false)
  }

  const handleToday = () => {
    onMonthChange(currentMonth, currentYear)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-600/15 to-cyan-500/10 text-white hover:border-cyan-400/70 hover:from-cyan-600/25 hover:to-cyan-500/20 transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]"
      >
        <span className="text-sm font-semibold text-cyan-100">
          {monthNames[month]} {year}
        </span>
        <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-3 z-50 w-72 rounded-2xl border border-white/15 bg-[#050816]/98 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
          {/* Month Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-white">{year}</span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2 p-3">
            {monthNames.map((m, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectMonth(idx, year)}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                  month === idx && year === currentYear
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {m.slice(0, 3)}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-white/10 p-3 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToday}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/30 transition-colors"
            >
              This Month
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-3 rounded-lg bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
        </>
      )}
    </div>
  )
}
