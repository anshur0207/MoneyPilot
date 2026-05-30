import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import Layout from './components/Layout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import ExpensesPage from './pages/ExpensesPage'
import MutualFundsPage from './pages/MutualFundsPage'
import MutualFundDetailsPage from './pages/MutualFundDetailsPage'
import LoansPage from './pages/LoansPage'
import GoalsPage from './pages/GoalsPage'
import ReportsPage from './pages/ReportsPage'
import HealthScorePage from './pages/HealthScorePage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route element={<Layout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/mutual-funds" element={<MutualFundsPage />} />
            <Route path="/mutual-fund/:id" element={<MutualFundDetailsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/health-score" element={<HealthScorePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
