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

// Si el token venció (401 en un pedido autenticado) se avisa para cerrar la sesión.
// El store se registra desde afuera para no crear una dependencia circular.
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && sentToken) onUnauthorized()
    return Promise.reject(error)
  },
)

// Mensaje de error que devuelve el backend ({ mensaje }) o uno genérico
export const getErrorMessage = (error, fallback = 'Ocurrió un error, intentá de nuevo') =>
  error.response?.data?.mensaje || fallback
