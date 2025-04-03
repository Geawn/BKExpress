import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES } from '../constants/article_category'

async function loadCategoryList() {
  try {
    const categoryList =  AsyncStorage.getItem('categoryList')
    if (categoryList) {
      return JSON.parse(categoryList); // Parse dữ liệu thành đối tượng
    } else {
      const initialCategoryList = {};
      CATEGORIES.forEach((category) => {
        initialCategoryList[category[0]] = {
          endName: category[0],
          vieName: category[1],
          checked: category[2]
        };
      });
      await AsyncStorage.setItem('categoryList', JSON.stringify(initialCategoryList));
      return initialCategoryList;
    } 
  } catch (error) {
    console.error("Error loading category list:", error);
  }
}

async function saveCategoryList(savedArticles) {
  try {
    await AsyncStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  } catch (error) {
    console.error("Error saving savedArticles:", error);
  }
}

async function deleteCategoryList() {
  try {
    await AsyncStorage.removeItem('categoryList');
  } catch (error) {
    console.error("Error removing category list:", error);
  }
}

export { loadCategoryList, saveCategoryList };