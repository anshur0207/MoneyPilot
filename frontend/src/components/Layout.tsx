import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navigation from './Navigation'
import BrandLogo from './BrandLogo'
import { useAuthStore } from '../context/authStore'
import { Search, Bell, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const formatDate = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const now = new Date()
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`
}

export default function Layout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/mutual-funds', label: 'Funds', icon: '💹' },
    { path: '/expenses', label: 'Expenses', icon: '💸' },
    { path: '/loans', label: 'Loans', icon: '💳' },
    { path: '/health-score', label: 'Health', icon: '💚' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/settings', label: 'Profile', icon: '👤' },
  ]

  const handleLogout = () => {
    logout()
    setShowMenu(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(124,58,237,0.24),transparent_28%),radial-gradient(circle_at_85%_8%,rgba(59,130,246,0.16),transparent_24%)]" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#050816]/75 backdrop-blur-2xl relative z-30">
        {/* Logo Section */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
          <BrandLogo className="h-12 w-12 rounded-2xl shadow-[0_0_35px_rgba(124,58,237,0.45)]" />
          <div>
            <p className="text-lg font-bold tracking-wide text-white">MoneyPilot</p>
            <p className="text-xs text-gray-400">Personal finance cockpit</p>
          </div>
        </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <motion.a
                key={item.path}
                href={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-500/20 border border-purple-400/30 text-white shadow-[0_0_30px_rgba(124,58,237,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.a>
            )
          })}
        </nav>

        {/* Premium Upgrade Card */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-600/10 to-blue-500/10 p-4 backdrop-blur-xl space-y-3">
            <div className="text-sm font-semibold text-white">Upgrade to Premium</div>
            <p className="text-xs text-gray-400">Unlock advanced insights and AI recommendations</p>
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-smooth">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/75 backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between px-4 md:px-8 relative">
            {/* Left: Date */}
            <div className="hidden md:flex items-center gap-3">
              <div className="inline-block rounded-full bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-gray-300 border border-white/10">
                📅 {formatDate()}
              </div>
            </div>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center gap-4">
              {/* Search - Hidden on mobile */}
              <div className="hidden lg:flex relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="rounded-full bg-white/[0.08] border border-white/10 px-4 py-2 pl-10 text-sm text-white placeholder:text-gray-500 focus:border-purple-400/50 focus:outline-none transition-smooth"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-full p-2 hover:bg-white/10 transition-smooth"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </motion.button>

              {/* Profile Menu */}
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-full w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center font-semibold text-white hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] transition-all"
                >
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </motion.button>

                {/* Dropdown menu */}
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="fixed right-4 top-16 md:absolute md:right-0 md:top-full md:mt-2 z-[9999]"
                  >
                    <div className="rounded-2xl border border-white/10 bg-[#0f1423]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-2 min-w-max">
                      <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10">
                        <div className="font-semibold text-white">{user?.name}</div>
                        <div className="text-gray-500">{user?.email}</div>
                      </div>
                      <a
                        href="/settings"
                        onClick={() => setShowMenu(false)}
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-smooth mt-1"
                      >
                        Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-smooth flex items-center gap-2 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  )
}
