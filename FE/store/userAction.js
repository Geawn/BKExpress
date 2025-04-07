import { createAsyncThunk } from "@reduxjs/toolkit";

import { loadCategoryList } from "../cache/category";
import { loadUserInfo } from "../cache/userInfo";
import { loadSavedArticles } from "../cache/savedArticles";

export const setupStartApp = createAsyncThunk(
  "setupStartApp",
  async (setLoading) => {
    try {
      // const response = await login()
      // response.data.accessToken
      // response.data.refreshToken
      // response.data.userInfo
      // response.data.categoryList
      // response.data.savedArticles

      const accessToken = null;
      const userInfo = await loadUserInfo();
      const categoryList = await loadCategoryList();
      const savedArticles = await loadSavedArticles();

      setLoading(false);

      return {accessToken, userInfo, categoryList, savedArticles};
    } catch (error) {
      console.error("Error setting up start app:", error);
    }
  }
)

// export const changeCategoryList = createAsyncThunk(
//   "changeCategoryList",
//   async (token, categoryList, categoryName, value) => {
//     try {
//       if (token) {
//         // Call API to change category list

//         // change categoryList
//         const updatedCategoryList = {
//         return;
//       }
//       // Save the category list to cache or perform any other action
//       await loadCategoryList(categoryList);
//     } catch (error) {
//       console.error("Error changing category list:", error);
//     }
//   }
// )
