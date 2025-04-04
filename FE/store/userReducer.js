import { createSlice } from '@reduxjs/toolkit'

import { setupStartApp } from './userAction'

const initialState = {
  categoryList: [],
  accessToken: null,
  userInfo: null,
  isLoadingChangeCategory: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateCaegoryListRedux: (state, action) => {
      const newCategoryList = state.categoryList.map((item) => {
        return [...item]
      })
      const engName = action.payload.engName

      for (const cate of newCategoryList) {
        if (cate[0] === engName) {
          cate[2] = !cate[2]
          break
        }
      }

      state.categoryList = newCategoryList
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setupStartApp.fulfilled, (state, action) => {
        state.categoryList = action.payload.categoryList
        state.accessToken = action.payload.accessToken
        state.userInfo = action.payload.userInfo
      })
  },
})

// Action creators are generated for each case reducer function
export const { updateCaegoryListRedux } = userSlice.actions

export default userSlice.reducer