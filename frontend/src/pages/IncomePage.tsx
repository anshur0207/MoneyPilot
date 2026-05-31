import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import MonthSelector from '../components/MonthSelector'
import AppErrorScreen from '../components/AppErrorScreen'
import IncomeCard from '../components/IncomeCard'

interface IncomeResponse {
  month: number
  year: number
  totalIncome: number
  incomes: Array<{ _id: string; amount: number; month: number; year: number; type: string; description: string }>
}

export default function IncomePage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  const { data, loading, error, refetch } = useFetch<IncomeResponse>(
    `/api/income?month=${month}&year=${year}`
  )

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  if (loading) return <AppErrorScreen type="loading" />
  if (error) return <AppErrorScreen type={error.type} onRetry={refetch} />

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="px-4 md:px-8 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="eyebrow">Income Management</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mt-3">
              💰 Income
            </h1>
            <p className="text-gray-400 mt-2">Set or update your salary for the selected month.</p>
          </div>
          <MonthSelector month={month} year={year} onMonthChange={handleMonthChange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IncomeCard
            monthlyIncome={data?.totalIncome ?? 0}
            month={month}
            year={year}
            onRefresh={refetch}
          />
        </motion.div>
      </div>
    </div>
  )
}
