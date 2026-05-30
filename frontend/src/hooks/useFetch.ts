import { useCallback, useEffect, useState } from 'react'
import api from '../utils/api'

export interface FetchError {
  type: 'network' | 'server' | 'error'
  message?: string
}

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FetchError | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<T>(url)
      setData(response.data)
      setError(null)
    } catch (err: any) {
      // Detect error type
      if (err.message === 'Network Error' || !navigator.onLine) {
        setError({
          type: 'network',
          message: 'No internet connection. Please check your network.',
        })
      } else if (err.response?.status >= 500) {
        setError({
          type: 'server',
          message: 'Server error. Please try again later.',
        })
      } else {
        setError({
          type: 'error',
          message: err.response?.data?.message || 'An error occurred while fetching data.',
        })
      }
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

