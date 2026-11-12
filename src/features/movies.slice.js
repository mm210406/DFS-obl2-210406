import { createSlice } from '@reduxjs/toolkit'
import { logout } from './user.slice'

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
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState)
  },
})

export const { setMovies } = moviesSlice.actions

export default moviesSlice.reducer
