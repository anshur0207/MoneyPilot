import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { ChangeEvent, InputHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const formatIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const parseIsoDate = (value?: string | number | readonly string[] | undefined) => {
  if (!value || Array.isArray(value)) return null
  const parsed = new Date(value)
  return isNaN(parsed.getTime()) ? null : parsed
}

export default function DateInput({ label, className = '', value, onChange, min, max, disabled, ...props }: DateInputProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selectedDate = parseIsoDate(value)
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate || new Date())

  useEffect(() => {
    if (open) {
      setViewDate(selectedDate || new Date())
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const monthLabel = useMemo(() => {
    return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [viewDate])

  const days = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const firstWeekday = firstDayOfMonth.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = [] as Array<{ label: string; date: Date | null }>

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ label: '', date: null })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ label: String(day), date: new Date(year, month, day) })
    }

    return cells
  }, [viewDate])

  const triggerChange = (dateStr: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: dateStr },
      } as unknown as ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  const handleDateSelect = (date: Date) => {
    const formatted = formatIsoDate(date)
    triggerChange(formatted)
    setOpen(false)
  }

  const nextMonth = () => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  const previousMonth = () => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  return (
    <label className="block text-sm text-gray-300" ref={ref}>
      {label ? <span className="mb-2 block font-medium text-gray-300">{label}</span> : null}
      <div className="relative">
        <input
          className={`field pr-12 ${className}`}
          value={value ?? ''}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          {...props}
        />
        <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />

        {open && !disabled && (
          <div
            className="absolute inset-x-0 top-full z-50 mt-2 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between text-sm text-gray-200">
              <button
                type="button"
                onClick={previousMonth}
                className="rounded-2xl p-2 text-gray-300 hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="font-semibold">{monthLabel}</div>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-2xl p-2 text-gray-300 hover:bg-white/5"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.15em] text-gray-500">
              {dayNames.map((day) => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {days.map((cell, index) => {
                const isSelected = cell.date && selectedDate && formatIsoDate(cell.date) === formatIsoDate(selectedDate)
                const disabledDay = cell.date
                  ? (min && formatIsoDate(cell.date) < String(min)) || (max && formatIsoDate(cell.date) > String(max))
                  : false

                return (
                  <button
                    key={`${cell.label}-${index}`}
                    type="button"
                    disabled={!cell.date || disabledDay}
                    onClick={() => cell.date && handleDateSelect(cell.date)}
                    className={`rounded-2xl py-2 text-sm transition-all ${
                      !cell.date ? 'cursor-default bg-transparent' : disabledDay ? 'cursor-not-allowed text-gray-500' : isSelected ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-[0_12px_30px_rgba(124,58,237,0.35)]' : 'hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    {cell.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </label>
  )
}
