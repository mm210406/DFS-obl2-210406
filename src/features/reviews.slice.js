import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  reviews: [],
  page: 1,
  pages: 0,
  total: 0,
  resultsTotal: 0,
}

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews: (state, action) => {
      const { reviews, page, pages, total, filtered } = action.payload
      state.reviews = reviews
      state.page = page
      state.pages = pages
      state.resultsTotal = total
      if (!filtered) state.total = total
    },

    removeReview: (state, action) => {
      state.reviews = state.reviews.filter((review) => review._id !== action.payload)
      state.total -= 1
      state.resultsTotal -= 1
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
