import { Link } from 'react-router-dom'
import {
  BellIcon,
  WalletIcon,
  TrendingIcon,
  CardIcon,
  TargetIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '../components/MarketingIcons'

const featureCards = [
  {
    icon: <WalletIcon />,
    title: 'Smart Dashboard',
    desc: 'Get a 360 degree view of your income, expenses, investments, savings and loans.',
  },
  {
    icon: <CardIcon />,
    title: 'Expense Tracking',
    desc: 'Track every expense automatically and understand your spending.',
  },
  {
    icon: <TrendingIcon />,
    title: 'Investment Tracker',
    desc: 'Track SIPs, stocks and mutual funds in real time.',
  },
  {
    icon: <TargetIcon />,
    title: 'Goal Planner',
    desc: 'Set financial goals and achieve them faster.',
  },
  {
    icon: <SparklesIcon />,
    title: 'AI Insights',
    desc: 'Get AI powered financial recommendations.',
  },
  {
    icon: <BellIcon />,
    title: 'Smart Alerts',
    desc: 'Get notified about EMIs, budgets and due dates.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(124,58,237,0.28),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.20),transparent_26%),radial-gradient(circle_at_48%_78%,rgba(124,58,237,0.14),transparent_30%)]" />

      <nav className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-6 backdrop-blur-xl md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_35px_rgba(124,58,237,0.45)]" />
          <h1 className="text-2xl font-bold tracking-tight">MoneyPilot</h1>
        </Link>

        <div className="hidden items-center gap-10 text-gray-300 md:flex">
          <a href="#home" className="hover:text-white">Home</a>
          <a href="#features" className="hover:text-white">Features</a>
          <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          <a href="#stats" className="hover:text-white">Pricing</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/login" className="text-sm text-gray-300 transition hover:text-white sm:text-base">
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm font-medium shadow-[0_14px_40px_rgba(124,58,237,0.35)] transition hover:scale-105 sm:px-5 sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="home" className="grid items-center gap-16 px-6 py-16 md:grid-cols-2 md:px-16 md:py-20">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-purple-300">
              Your Financial Command Center
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Track.
              <br />
              Analyze.
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Grow.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
              MoneyPilot helps you track every rupee, analyze spending habits, manage loans, grow investments and build wealth intelligently.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-7 py-4 font-semibold shadow-[0_20px_60px_rgba(124,58,237,0.38)] transition hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 backdrop-blur-md transition hover:bg-white/10"
              >
                See Demo
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#050816] bg-gradient-to-br from-zinc-100 to-zinc-500 text-sm font-bold text-[#050816]"
                  >
                    {['AN', 'RI', 'SA', 'KP'][item - 1]}
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold">Trusted by 500+ users</p>
                <p className="text-yellow-400">★★★★★</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute h-[350px] w-[350px] rounded-full bg-purple-600/30 blur-[120px]" />

            <div className="relative w-full max-w-[350px] rounded-[40px] border border-white/10 bg-[#0B1120]/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold">Hello, Anshu</p>
                  <p className="text-sm text-gray-400">Here’s your financial overview</p>
                </div>
                <BellIcon className="text-gray-400" />
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-blue-500/10 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400">Net Worth</p>
                    <h2 className="mt-2 text-4xl font-bold">₹4,85,000</h2>
                  </div>

                  <div className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                    +5.6%
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex h-24 items-end gap-2">
                    {[30, 45, 35, 60, 50, 70, 85].map((height, index) => (
                      <div
                        key={index}
                        style={{ height: `${height}px` }}
                        className="flex-1 rounded-t-xl bg-gradient-to-t from-purple-500 to-blue-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <MiniCard icon={<WalletIcon />} title="Savings" amount="₹1,40,000" />
                <MiniCard icon={<TrendingIcon />} title="Investments" amount="₹2,10,000" />
                <MiniCard icon={<CardIcon />} title="Loans" amount="₹95,000" />
                <MiniCard icon={<TargetIcon />} title="Monthly Spend" amount="₹41,200" />
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex justify-between">
                  <p>This Month Overview</p>
                  <p className="text-purple-400">View all</p>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] bg-gradient-to-r from-purple-500 to-blue-500" />
                </div>

                <div className="mt-3 flex justify-between text-sm text-gray-400">
                  <p>Budget Used</p>
                  <p>68%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex md:items-center md:justify-between">
            <p className="mb-5 text-gray-300 md:mb-0">As seen in</p>
            <div className="grid grid-cols-2 gap-5 text-center text-lg font-bold text-gray-400 md:grid-cols-5 md:gap-10">
              {['Forbes', 'YourStory', 'TechCrunch', 'Analytics India', 'Inc42'].map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-24 md:px-16">
          <div className="text-center">
            <p className="mb-4 text-purple-400">Everything You Need</p>

            <h2 className="text-4xl font-bold md:text-5xl">
              All your finances. One place.
            </h2>

            <p className="mt-5 text-lg text-gray-400">
              Powerful features to help you take control of your money.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section id="stats" className="px-6 pb-20 md:px-16">
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard title="500+" subtitle="Happy Users" />
            <StatsCard title="₹10Cr+" subtitle="Money Tracked" />
            <StatsCard title="99.9%" subtitle="Data Security" />
          </div>
        </section>

        <section id="about" className="px-6 pb-20 text-center md:px-16">
          <h2 className="text-3xl font-bold">Built for clarity, speed and wealth building.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            MoneyPilot combines beautiful tracking, MongoDB-backed records and a clean dashboard so your money finally feels organized.
          </p>
        </section>
      </main>
    </div>
  )
}

function MiniCard({ icon, title, amount }: { icon: React.ReactNode; title: string; amount: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
      <div className="mb-3 text-purple-400">{icon}</div>
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-1 text-xl font-bold">{amount}</h3>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_22px_80px_rgba(124,58,237,0.24)]">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-[0_14px_40px_rgba(124,58,237,0.35)]">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-4 leading-7 text-gray-400">{desc}</p>
      <ArrowRightIcon className="mt-6 text-purple-400 transition group-hover:translate-x-2" />
    </div>
  )
}

function StatsCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
      <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent">
        {title}
      </h2>
      <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
    </div>
  )
}
