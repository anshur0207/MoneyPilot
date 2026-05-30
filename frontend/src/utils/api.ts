import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
console.log('API Base URL:', baseURL)

const api = axios.create({
  baseURL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }
export default api
