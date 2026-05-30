import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../context/authStore'

export default function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(form.name, form.email, form.password)
      navigate('/onboarding')
    } catch {
      setError('Unable to create this account. Try another email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(124,58,237,0.28),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.18),transparent_26%)]" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_35px_rgba(124,58,237,0.45)]" />
          <h1 className="text-2xl font-bold">MoneyPilot</h1>
        </Link>
        <Link to="/login" className="text-gray-300 hover:text-white">
          Login
        </Link>
      </nav>

      <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-10">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-2xl font-black shadow-[0_0_45px_rgba(124,58,237,0.45)]">
              M
            </div>
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-gray-400">Start with a profile, then set up your finances.</p>
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

          <label className="block text-sm text-gray-300">
            Full name
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="mt-4 block text-sm text-gray-300">
            Email
            <input className="field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="mt-4 block text-sm text-gray-300">
            Password
            <input className="field" type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>

          <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-7 py-4 font-semibold shadow-[0_20px_60px_rgba(124,58,237,0.35)] transition hover:scale-[1.02] disabled:opacity-60" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <Link to="/login" className="mt-3 block w-full rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-center font-semibold transition hover:bg-white/10">
            Back to Login
          </Link>
        </motion.form>
      </main>
    </div>
  )
}
