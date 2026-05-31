import { FormEvent, ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { useAuthStore } from '../context/authStore'
import { formatCurrency } from '../utils/helpers'
import DateInput from '../components/DateInput'

const today = new Date().toISOString().slice(0, 10)

const addYears = (years: number) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  return date.toISOString().slice(0, 10)
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '',
    monthlySalary: '',
    totalSavings: '',
    investmentType: 'SIP',
    investmentName: '',
    investedAmount: '',
    currentInvestmentValue: '',
    monthlyContribution: '',
    loanType: 'Personal Loan',
    lenderName: '',
    loanPrincipal: '',
    loanRemaining: '',
    interestRate: '',
    emiAmount: '',
    emiDate: '5',
    tenure: '',
    loanEndDate: addYears(1),
    goalName: '',
    goalCategory: 'Emergency Fund',
    goalTargetAmount: '',
    goalSavedAmount: '',
    goalDeadline: addYears(1),
    currency: 'INR',
    notifications: true,
  })
  const [saving, setSaving] = useState(false)
  const [calculated, setCalculated] = useState(false)

  const numbers = useMemo(() => {
    const totalSavings = Number(form.totalSavings || 0)
    const currentInvestmentValue = Number(form.currentInvestmentValue || 0)
    const loanRemaining = Number(form.loanRemaining || 0)
    const monthlySalary = Number(form.monthlySalary || 0)
    const monthlyContribution = Number(form.monthlyContribution || 0)
    const assets = totalSavings + currentInvestmentValue
    const netWorth = assets
    const savingsRate = monthlySalary ? (monthlyContribution / monthlySalary) * 100 : 0
    const debtRatio = assets ? loanRemaining / assets : 0
    let healthScore: number | null = null

    if (assets > 0 || loanRemaining > 0) {
      let score = 50
      if (netWorth > 500000) score += 15
      else if (netWorth > 250000) score += 10
      else if (netWorth > 100000) score += 5

      if (savingsRate > 50) score += 20
      else if (savingsRate > 30) score += 15
      else if (savingsRate > 20) score += 10
      else if (savingsRate > 10) score += 5

      if (debtRatio < 0.2) score += 15
      else if (debtRatio < 0.4) score += 10
      else if (debtRatio < 0.6) score += 5

      healthScore = Math.min(score, 100)
    }

    return {
      assets,
      netWorth,
      savingsRate: Math.round(savingsRate),
      debtRatio: Math.round(debtRatio * 100),
      healthScore,
    }
  }, [form])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)

    const response = await api.put('/api/auth/profile', {
      name: form.name,
      monthlySalary: Number(form.monthlySalary || 0),
      preferences: {
        darkMode: true,
        notifications: form.notifications,
        currency: form.currency,
      },
    })

    const writes: Promise<unknown>[] = []


    if (form.lenderName && Number(form.loanPrincipal || 0) > 0) {
      writes.push(
        api.post('/api/loans', {
          type: form.loanType,
          lenderName: form.lenderName,
          principalAmount: Number(form.loanPrincipal),
          remainingAmount: Number(form.loanRemaining || form.loanPrincipal),
          interestRate: Number(form.interestRate || 0),
          emiAmount: Number(form.emiAmount || 0),
          emiDate: Number(form.emiDate || 1),
          tenure: Number(form.tenure || 1),
          startDate: today,
          endDate: form.loanEndDate,
          notes: 'Added during onboarding',
        })
      )
    }

    if (form.goalName && Number(form.goalTargetAmount || 0) > 0) {
      writes.push(
        api.post('/api/goals', {
          name: form.goalName,
          description: 'Added during onboarding',
          category: form.goalCategory,
          targetAmount: Number(form.goalTargetAmount),
          savedAmount: Number(form.goalSavedAmount || 0),
          deadline: form.goalDeadline,
          priority: 'Medium',
          emoji: '🎯',
        })
      )
    }

    await Promise.all(writes)

    setUser({
      id: response.data.user._id,
      name: response.data.user.name,
      email: response.data.user.email,
      monthlySalary: response.data.user.monthlySalary,
      currency: response.data.user.preferences?.currency,
    })
    setSaving(false)
    navigate('/dashboard')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-shell">
      <form onSubmit={handleSubmit} className="premium-panel mx-auto mt-4 max-w-5xl space-y-8 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">First time setup</p>
            <h1 className="mt-2 text-4xl font-black text-white">Add your real financial data</h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              New accounts start empty. Add savings, loans, and goals here, then calculate your health score.
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => setCalculated(true)}>
            Calculate Health Score
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Net Worth Preview" value={formatCurrency(numbers.netWorth)} />
          <Metric label="Assets Added" value={formatCurrency(numbers.assets)} />
          <Metric label="Debt Ratio" value={`${numbers.debtRatio}%`} />
          <Metric label="Health Score" value={calculated && numbers.healthScore !== null ? `${numbers.healthScore}/100` : 'Not calculated'} />
        </div>

        <Section title="Profile">
          <label className="text-sm text-gray-300">
            Name
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="text-sm text-gray-300">
            Monthly salary
            <input className="field" type="number" min="0" value={form.monthlySalary} onChange={(event) => setForm({ ...form, monthlySalary: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Total savings
            <input className="field" type="number" min="0" value={form.totalSavings} onChange={(event) => setForm({ ...form, totalSavings: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Currency
            <select className="field" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </Section>


        <Section title="Loan">
          <label className="text-sm text-gray-300">
            Loan type
            <select className="field" value={form.loanType} onChange={(event) => setForm({ ...form, loanType: event.target.value })}>
              {['Personal Loan', 'Home Loan', 'Car Loan', 'Credit Card', 'Other'].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-300">
            Lender name
            <input className="field" value={form.lenderName} onChange={(event) => setForm({ ...form, lenderName: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Principal amount
            <input className="field" type="number" min="0" value={form.loanPrincipal} onChange={(event) => setForm({ ...form, loanPrincipal: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Remaining amount
            <input className="field" type="number" min="0" value={form.loanRemaining} onChange={(event) => setForm({ ...form, loanRemaining: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Interest rate
            <input className="field" type="number" min="0" value={form.interestRate} onChange={(event) => setForm({ ...form, interestRate: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            EMI amount
            <input className="field" type="number" min="0" value={form.emiAmount} onChange={(event) => setForm({ ...form, emiAmount: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            EMI day
            <input className="field" type="number" min="1" max="31" value={form.emiDate} onChange={(event) => setForm({ ...form, emiDate: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Tenure months
            <input className="field" type="number" min="1" value={form.tenure} onChange={(event) => setForm({ ...form, tenure: event.target.value })} />
          </label>
          <DateInput
            label="End date"
            value={form.loanEndDate}
            onChange={(event) => setForm({ ...form, loanEndDate: event.target.value })}
          />
        </Section>

        <Section title="Goal">
          <label className="text-sm text-gray-300">
            Goal name
            <input className="field" value={form.goalName} onChange={(event) => setForm({ ...form, goalName: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Category
            <select className="field" value={form.goalCategory} onChange={(event) => setForm({ ...form, goalCategory: event.target.value })}>
              {['Marriage', 'Travel', 'Vehicle', 'Education', 'Home', 'Emergency Fund', 'Other'].map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-300">
            Target amount
            <input className="field" type="number" min="0" value={form.goalTargetAmount} onChange={(event) => setForm({ ...form, goalTargetAmount: event.target.value })} />
          </label>
          <label className="text-sm text-gray-300">
            Saved amount
            <input className="field" type="number" min="0" value={form.goalSavedAmount} onChange={(event) => setForm({ ...form, goalSavedAmount: event.target.value })} />
          </label>
          <DateInput
            label="Deadline"
            value={form.goalDeadline}
            onChange={(event) => setForm({ ...form, goalDeadline: event.target.value })}
          />
        </Section>

        <button className="btn-primary w-full py-4" disabled={saving}>
          {saving ? 'Saving to MongoDB...' : 'Save Details and Enter Dashboard'}
        </button>
      </form>
    </motion.div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  )
}
