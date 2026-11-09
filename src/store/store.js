import { configureStore } from '@reduxjs/toolkit'
import userReducer, { logout } from '../features/user.slice'
import { setUnauthorizedHandler } from '../config/api.config'
import { clearSession } from '../utils/session'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

setUnauthorizedHandler(() => {
  clearSession()
  store.dispatch(logout())
})
