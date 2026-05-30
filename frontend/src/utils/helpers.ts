export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : (value / total) * 100
}

export const calculateMonthlyBurn = (expenses: any[]): number => {
  const currentMonth = new Date().getMonth()
  return expenses
    .filter((exp) => new Date(exp.date).getMonth() === currentMonth)
    .reduce((sum, exp) => sum + exp.amount, 0)
}
