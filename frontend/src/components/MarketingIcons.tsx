import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = 'h-6 w-6'

export function BellIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0" />
    </svg>
  )
}

export function WalletIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h4v4h-4a2 2 0 1 1 0-4Z" />
    </svg>
  )
}

export function TrendingIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 17 9 12l4 4 7-9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h6v6" />
    </svg>
  )
}

export function CardIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path strokeLinecap="round" d="M3 10h18M7 15h4" />
    </svg>
  )
}

export function TargetIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" d="M16.5 7.5 20 4" />
    </svg>
  )
}

export function SparklesIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  )
}

export function ArrowRightIcon({ className = '', ...props }: IconProps) {
  return (
    <svg className={`${base} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
