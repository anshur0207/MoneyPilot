import { useState } from 'react'
import api from '../utils/api'

export function useMutation(url: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST') {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (data?: any) => {
    setLoading(true)
    try {
      const response = await api({
        method,
        url,
        data,
      })
      setError(null)
      return response.data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
