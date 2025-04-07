import { createSlice } from '@reduxjs/toolkit'

import { setupStartApp } from './userAction'

const initialState = {
  categoryList: [],
  savedArticles: {},
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

    updateSavedArticlesRedux: (state, action) => {
      // action.payload = {save, _id, category, time}
      if (action.payload.save) {
        new_savedArticles = {
          ...state.savedArticles,
          [action.payload._id]: {category: action.payload.category, time: action.payload.time}
        }
        state.savedArticles = new_savedArticles
      } else {
        new_savedArticles = { ...state.savedArticles }
        delete new_savedArticles[action.payload._id]
        state.savedArticles = new_savedArticles
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setupStartApp.fulfilled, (state, action) => {
        state.categoryList = action.payload.categoryList
        state.accessToken = action.payload.accessToken
        state.userInfo = action.payload.userInfo
        state.savedArticles = action.payload.savedArticles
      })
  },
})

// Action creators are generated for each case reducer function
export const { updateCaegoryListRedux, updateSavedArticlesRedux } = userSlice.actions

export default userSlice.reducer