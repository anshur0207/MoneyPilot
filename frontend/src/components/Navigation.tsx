import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/mutual-funds', label: 'Funds', icon: '💹', highlight: true },
    { path: '/expenses', label: 'Expenses', icon: '💸' },
    { path: '/loans', label: 'Loans', icon: '💳' },
    { path: '/health-score', label: 'Health', icon: '💚' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/settings', label: 'Profile', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050816]/80 backdrop-blur-2xl safe-area-inset-bottom">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-around px-3 overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex-1 min-w-max">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mx-1 flex flex-col items-center justify-center rounded-2xl px-2 py-2 transition-all ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-white shadow-[0_0_35px_rgba(124,58,237,0.16)]'
                  : item.highlight
                    ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                    : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {item.highlight && location.pathname !== item.path && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
