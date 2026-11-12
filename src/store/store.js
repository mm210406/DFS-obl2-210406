import { configureStore } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import userReducer, { login, logout } from '../features/user.slice'
import reviewsReducer from '../features/reviews.slice'
import genresReducer from '../features/genres.slice'
import moviesReducer from '../features/movies.slice'
import movieDetailReducer from '../features/movieDetail.slice'
import { setUnauthorizedHandler } from '../config/api.config'
import { STORAGE_KEYS } from '../config/constants'
import { clearSession, getStoredToken, getStoredUser } from '../utils/session'

export const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
    genres: genresReducer,
    movies: moviesReducer,
    movieDetail: movieDetailReducer,
  },
})

setUnauthorizedHandler(() => {
  if (!store.getState().user.token) return

  clearSession()
  store.dispatch(logout())
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
    if (current.token) store.dispatch(logout())
    return
  }

  if (token !== current.token) store.dispatch(logout())
  store.dispatch(login({ token, user }))
})
