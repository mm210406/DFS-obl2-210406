import { configureStore } from '@reduxjs/toolkit'
import userReducer, { logout } from '../features/user.slice'
import reviewsReducer, { clearReviews } from '../features/reviews.slice'
import { setUnauthorizedHandler } from '../config/api.config'
import { clearSession } from '../utils/session'

export const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
  },
})

setUnauthorizedHandler(() => {
  clearSession()
  store.dispatch(logout())
  store.dispatch(clearReviews())
})
