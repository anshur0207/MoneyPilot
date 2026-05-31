import type { ComponentPropsWithoutRef } from 'react'

export default function BrandLogo(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="brandGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="brandGlow" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.25" />
        </linearGradient>
        <filter id="brandShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#8b5cf6" floodOpacity="0.25" />
        </filter>
      </defs>

      <rect width="100" height="100" rx="24" fill="#050816" />
      <rect width="100" height="100" rx="24" fill="url(#brandGlow)" opacity="0.2" />

      <path
        d="M24 60V34l15 20 12-16 12 16 15-20v26"
        stroke="url(#brandGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#brandShadow)"
      />

      <rect x="26" y="58" width="10" height="18" rx="3" fill="url(#brandGradient)" />
      <rect x="42" y="50" width="10" height="26" rx="3" fill="url(#brandGradient)" />
      <rect x="58" y="42" width="10" height="34" rx="3" fill="url(#brandGradient)" />

      <path
        d="M24 58C36 52 52 42 70 30"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path d="M68 26L78 20L74 30L84 28" fill="url(#brandGradient)" />
    </svg>
  )
}
