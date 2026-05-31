import { motion } from 'framer-motion'
import { useAuthStore } from '../context/authStore'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-shell"
    >
      <div className="pt-4">
        <p className="eyebrow">Account center</p>
        <h1 className="section-title mt-2">Settings</h1>
      </div>

      {/* User Info */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-lg shadow-[0_0_35px_rgba(124,58,237,0.35)]">
            👤
          </div>
          <div>
            <p className="text-white font-semibold">{user?.name || 'User'}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">
        <button className="w-full card p-4 text-left">
          <p className="text-white font-semibold">🔐 Security</p>
          <p className="text-gray-400 text-sm">Manage password and 2FA</p>
        </button>

        <button className="w-full card p-4 text-left">
          <p className="text-white font-semibold">📱 Notifications</p>
          <p className="text-gray-400 text-sm">EMI alerts, spending limits</p>
        </button>

        <button className="w-full card p-4 text-left">
          <p className="text-white font-semibold">🎨 Appearance</p>
          <p className="text-gray-400 text-sm">Dark mode, color theme</p>
        </button>

        <button className="w-full card p-4 text-left">
          <p className="text-white font-semibold">📊 Data & Privacy</p>
          <p className="text-gray-400 text-sm">Export data, privacy policy</p>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full btn-secondary py-3 font-semibold text-red-300 hover:bg-red-500/10"
      >
        Sign Out
      </button>

      <p className="text-center text-xs text-gray-500 pb-6">
        MoneyPilot v1.0.0
      </p>
    </motion.div>
  )
}
