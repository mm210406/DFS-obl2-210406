import { configureStore } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import userReducer, { login, logout } from '../features/user.slice'
import reviewsReducer, { clearReviews } from '../features/reviews.slice'
import genresReducer from '../features/genres.slice'
import moviesReducer, { clearMovies } from '../features/movies.slice'
import { setUnauthorizedHandler } from '../config/api.config'
import { STORAGE_KEYS } from '../config/constants'
import { clearSession, getStoredToken, getStoredUser } from '../utils/session'

export const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
    genres: genresReducer,
    movies: moviesReducer,
  },
})

const endSession = () => {
  store.dispatch(logout())
  store.dispatch(clearReviews())
  store.dispatch(clearMovies())
}

setUnauthorizedHandler(() => {
  if (!store.getState().user.token) return

  clearSession()
  endSession()
  toast.info('Tu sesión terminó. Ingresá de nuevo para seguir.')
})

window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEYS.TOKEN && event.key !== STORAGE_KEYS.USER && event.key !== null) {
    return
  }

  const token = getStoredToken()
  const user = getStoredUser()
  const current = store.getState().user

  if (!token || !user) {
    if (current.token) endSession()
    return
  }

  if (token !== current.token) {
    store.dispatch(clearReviews())
    store.dispatch(clearMovies())
    store.dispatch(login({ token, user }))
  }
})
