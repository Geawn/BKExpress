import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveSavedArticles(savedArticles) {
  try {
    await AsyncStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  } catch (error) {
    console.error("Error saving saved articles:", error);
  }
}

async function loadSavedArticles() {
  try {
    const savedArticles = await AsyncStorage.getItem('savedArticles');
    if (savedArticles) {
      return JSON.parse(savedArticles);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error loading saved articles:", error);
  }
}

async function deleteSavedArticles() {
  try {
    await AsyncStorage.removeItem('savedArticles');
  } catch (error) {
    console.error("Error removing saved articles:", error);
  }
}

export { loadSavedArticles, saveSavedArticles };