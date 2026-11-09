import { ROLES, ROUTES, STORAGE_KEYS } from '../config/constants'

// Guarda y borra la sesión en localStorage (el slice guarda la misma info en Redux)
export const saveSession = ({ token, user }) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))
  } catch {
    return null
  }
}

export const isAdmin = (user) => user?.role === ROLES.ADMIN

// Pantalla inicial según el rol: el admin solo gestiona géneros
export const homePath = (user) => (isAdmin(user) ? ROUTES.ADMIN_GENRES : ROUTES.HOME)
