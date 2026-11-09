import { createSlice } from '@reduxjs/toolkit'
import { getStoredToken, getStoredUser } from '../utils/session'

const initialState = {
  token: getStoredToken(),
  user: getStoredUser(),
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    logout: (state) => {
      state.token = null
      state.user = null
    },
  },
})

export const { login, updateUser, logout } = userSlice.actions

export default userSlice.reducer
