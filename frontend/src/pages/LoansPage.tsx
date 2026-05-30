import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import { formatCurrency, formatDate } from '../utils/helpers'
import api from '../utils/api'

interface Loan {
  _id: string
  type: string
  lenderName: string
  principalAmount: number
  remainingAmount: number
  interestRate: number
  emiAmount: number
  emiDate: number
  tenure: number
  startDate: string
  endDate: string
  notes?: string
}

interface LoansResponse {
  loans: Loan[]
  total: number
  summary: { totalPrincipal: number; totalRemaining: number; totalEMI: number }
}

const blank = {
  type: 'Personal Loan',
  lenderName: '',
  principalAmount: '',
  remainingAmount: '',
  interestRate: '',
  emiAmount: '',
  emiDate: '5',
  tenure: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  notes: '',
}

export default function LoansPage() {
  const { data, loading, error, refetch } = useFetch<LoansResponse>('/api/loans')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const payload = {
      ...form,
      principalAmount: Number(form.principalAmount),
      remainingAmount: Number(form.remainingAmount || form.principalAmount),
      interestRate: Number(form.interestRate),
      emiAmount: Number(form.emiAmount),
      emiDate: Number(form.emiDate),
      tenure: Number(form.tenure),
    }
    if (editingId) await api.put(`/api/loans/${editingId}`, payload)
    else await api.post('/api/loans', payload)
    setForm(blank)
    setEditingId(null)
    setShowForm(false)
    await refetch()
  }

  const edit = (loan: Loan) => {
    setEditingId(loan._id)
    setShowForm(true)
    setForm({
      type: loan.type,
      lenderName: loan.lenderName,
      principalAmount: String(loan.principalAmount),
      remainingAmount: String(loan.remainingAmount),
      interestRate: String(loan.interestRate),
      emiAmount: String(loan.emiAmount),
      emiDate: String(loan.emiDate),
      tenure: String(loan.tenure),
      startDate: loan.startDate.slice(0, 10),
      endDate: loan.endDate.slice(0, 10),
      notes: loan.notes || '',
    })
  }

  const remove = async (id: string) => {
    await api.delete(`/api/loans/${id}`)
    await refetch()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <div className="flex items-center justify-between gap-3 pt-4">
        <div><h1 className="section-title">Loans</h1><p className="text-sm text-gray-400">{data?.total ?? 0} records from MongoDB</p></div>
        <button className="btn-primary" onClick={() => { setEditingId(null); setForm(blank); setShowForm((v) => !v) }}>{showForm ? 'Close' : '+ Add'}</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Lender name" value={form.lenderName} onChange={(e) => setForm({ ...form, lenderName: e.target.value })} required />
          <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{['Personal Loan', 'Home Loan', 'Car Loan', 'Credit Card', 'Other'].map((type) => <option key={type}>{type}</option>)}</select>
          <input className="field" type="number" placeholder="Principal" value={form.principalAmount} onChange={(e) => setForm({ ...form, principalAmount: e.target.value })} required />
          <input className="field" type="number" placeholder="Remaining" value={form.remainingAmount} onChange={(e) => setForm({ ...form, remainingAmount: e.target.value })} />
          <input className="field" type="number" placeholder="Interest %" value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: e.target.value })} required />
          <input className="field" type="number" placeholder="EMI amount" value={form.emiAmount} onChange={(e) => setForm({ ...form, emiAmount: e.target.value })} required />
          <input className="field" type="number" placeholder="EMI day" value={form.emiDate} onChange={(e) => setForm({ ...form, emiDate: e.target.value })} required />
          <input className="field" type="number" placeholder="Tenure months" value={form.tenure} onChange={(e) => setForm({ ...form, tenure: e.target.value })} required />
          <input className="field" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          <input className="field" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          <button className="btn-primary py-3 sm:col-span-2">{editingId ? 'Update Loan' : 'Save Loan'}</button>
        </form>
      )}

      {error && <div className="text-red-300">Unable to load loans.</div>}
      {loading ? <div className="text-gray-400">Loading loans...</div> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card"><p className="text-sm text-gray-400">Principal</p><p className="text-2xl font-bold">{formatCurrency(data?.summary.totalPrincipal ?? 0)}</p></div>
            <div className="card"><p className="text-sm text-gray-400">Remaining</p><p className="text-2xl font-bold">{formatCurrency(data?.summary.totalRemaining ?? 0)}</p></div>
            <div className="card"><p className="text-sm text-gray-400">Monthly EMI</p><p className="text-2xl font-bold">{formatCurrency(data?.summary.totalEMI ?? 0)}</p></div>
          </div>
          <div className="space-y-3">
            {data?.loans.map((loan) => (
              <div key={loan._id} className="card flex items-start justify-between gap-3">
                <div><p className="font-semibold text-white">{loan.lenderName}</p><p className="text-sm text-gray-400">{loan.type} · {loan.interestRate}% · EMI day {loan.emiDate}</p><p className="text-xs text-gray-500">Ends {formatDate(loan.endDate)}</p></div>
                <div className="text-right"><p className="font-bold">{formatCurrency(loan.remainingAmount)}</p><div className="mt-2 flex gap-2"><button className="text-xs text-accent" onClick={() => edit(loan)}>Edit</button><button className="text-xs text-red-300" onClick={() => remove(loan._id)}>Delete</button></div></div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
