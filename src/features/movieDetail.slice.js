import { createSlice } from '@reduxjs/toolkit'
import { logout } from './user.slice'

const initialState = {
  movie: null,
  reviews: [],
  myReview: null,
  page: 0,
  pages: 0,
  total: 0,
}

export const movieDetailSlice = createSlice({
  name: 'movieDetail',
  initialState,
  reducers: {
    setMovie: (state, action) => {
      state.movie = action.payload
    },

    setMovieReviews: (state, action) => {
      const { reviews, myReview, page, pages, total } = action.payload
      const othersReviews = reviews.filter((review) => !review.isMine)
      const loadedIds = new Set(state.reviews.map((review) => review._id))

      state.reviews =
        page === 1
          ? othersReviews
          : [...state.reviews, ...othersReviews.filter((review) => !loadedIds.has(review._id))]
      state.myReview = myReview
      state.page = page
      state.pages = pages
      state.total = total
    },

    setMyReview: (state, action) => {
      if (!state.myReview && action.payload) state.total += 1
      if (state.myReview && !action.payload) state.total -= 1
      state.myReview = action.payload
    },

    clearMovieDetail: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState)
  },
})

export const { setMovie, setMovieReviews, setMyReview, clearMovieDetail } = movieDetailSlice.actions

export default movieDetailSlice.reducer
