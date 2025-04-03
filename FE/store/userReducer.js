import { createSlice } from '@reduxjs/toolkit'

import { setupStartApp } from './userAction'

const initialState = {
  categoryList: {},
  accessToken: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setupStartApp.fulfilled, (state, action) => {
        state.categoryList = action.payload.categoryList
        state.accessToken = action.payload.accessToken
      })
  },
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = categorySlice.actions

export default userSlice.reducer