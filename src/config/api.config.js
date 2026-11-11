import axios from 'axios'
import { getStoredToken } from '../utils/session'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dfs-obl-210406-backend.vercel.app/v1',
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth')
    if (error.response?.status === 401 && !isAuthRequest) onUnauthorized()
    return Promise.reject(error)
  },
)

export const getErrorMessage = (error, fallback = 'Ocurrió un error, intentá de nuevo') =>
  error.response?.data?.mensaje || fallback
