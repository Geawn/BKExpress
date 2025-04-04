import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES } from '../constants/article_category'

async function loadCategoryList() {
  try {
    const categoryList = await AsyncStorage.getItem('categoryList')
    if (categoryList) {
      return JSON.parse(categoryList); // Parse dữ liệu thành đối tượng
    } else {
      await AsyncStorage.setItem('categoryList', JSON.stringify(CATEGORIES));
      return CATEGORIES;
    } 
  } catch (error) {
    console.error("Error loading category list:", error);
  }
}

async function updateCategoryList(engName) {
  try {
    const categoryList = await loadCategoryList();
    for (const cate of categoryList) {
      if (cate[0] === engName) {
        cate[2] = !cate[2]
        break
      }
    }
    await AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
  } catch (error) {
    console.error("Error saving categoryList:", error);
  }
}

async function deleteCategoryList() {
  try {
    await AsyncStorage.removeItem('categoryList');
  } catch (error) {
    console.error("Error removing category list:", error);
  }
}

export { loadCategoryList, updateCategoryList, deleteCategoryList };