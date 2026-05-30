import { create } from 'zustand'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'



interface User {
  id: string
  name: string
  email: string
  avatar?: string
  monthlySalary?: number
  currency?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  googleLogin: (token: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  
login: async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    // This will now show the REAL error from backend e.g. "User not found"
    throw new Error(err.message || 'Login failed')
  }

  const data = await response.json()
  localStorage.setItem('token', data.token)
  set({ token: data.token, user: data.user, isAuthenticated: true })
},

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) throw new Error('Registration failed')

      const data = await response.json()
      localStorage.setItem('token', data.token)
      set({ token: data.token, user: data.user, isAuthenticated: true })
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },
  
  googleLogin: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      
      if (!response.ok) throw new Error('Google login failed')
      
      const data = await response.json()
      localStorage.setItem('token', data.token)
      set({ token: data.token, user: data.user, isAuthenticated: true })
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  },
  
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
  
  setUser: (user: User) => {
    set({ user })
  },
}))
