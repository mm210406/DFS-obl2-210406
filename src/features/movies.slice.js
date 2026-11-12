import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  movies: [],
  page: 1,
  totalPages: 0,
}

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      const { movies, page, totalPages } = action.payload
      state.movies = movies
      state.page = page
      state.totalPages = totalPages
    },

    clearMovies: () => initialState,
  },
})

export const { setMovies, clearMovies } = moviesSlice.actions

export default moviesSlice.reducer
