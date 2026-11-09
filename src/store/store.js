import { configureStore } from '@reduxjs/toolkit'
import userReducer, { logout } from '../features/user.slice'
import { setUnauthorizedHandler } from '../config/api.config'
import { clearSession } from '../utils/session'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

// Token vencido o inválido: se borra la sesión y ProtectedRoute manda al login
setUnauthorizedHandler(() => {
  clearSession()
  store.dispatch(logout())
})
