import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  reviews: [],
  page: 1,
  pages: 0,
  total: 0,
}

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload.reviews
      state.page = action.payload.page
      state.pages = action.payload.pages
      state.total = action.payload.total
    },

    removeReview: (state, action) => {
      state.reviews = state.reviews.filter((review) => review._id !== action.payload)
      state.total -= 1
    },

    replaceReview: (state, action) => {
      state.reviews = state.reviews.map((review) =>
        review._id === action.payload._id ? action.payload : review,
      )
    },

    clearReviews: () => initialState,
  },
})

export const { setReviews, removeReview, replaceReview, clearReviews } = reviewsSlice.actions

export default reviewsSlice.reducer
