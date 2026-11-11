import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
}

export const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    setGenres: (state, action) => {
      state.list = action.payload
    },
  },
})

export const { setGenres } = genresSlice.actions

export default genresSlice.reducer
