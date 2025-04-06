import AsyncStorage from '@react-native-async-storage/async-storage';

import { setSavedArticles } from './article';

// savedArticles: List({category, _id})

async function addSavedArticle(category, _id, setSaved) {
  try {
    const data = await AsyncStorage.getItem('savedArticles');
    const savedArticles = data ? JSON.parse(data) : [];
    const newArticle = [{category, _id}];
    console.log("Saved articles before addition:", savedArticles);
    await AsyncStorage.setItem('savedArticles', JSON.stringify(newArticle.concat(savedArticles)));
    await setSavedArticles(category, _id, true); // Update the article list in cache
    setSaved(true); // Update the saved state in the component
  } catch (error) {
    console.error("Error saving saved articles:", error);
  }
}

async function popSavedArticle(category, _id, setSaved) {
  try {
    const data = await AsyncStorage.getItem('savedArticles');
    let savedArticles = data ? JSON.parse(data) : [];

    console.log("Saved articles before removal:", savedArticles);

    // Filter out the article to be removed
    savedArticles = savedArticles.filter(article => !(article.category === category && article._id === _id));
    
    await AsyncStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    await setSavedArticles(category, _id, false); // Update the article list in cache
    setSaved(false); // Update the saved state in the component
  } catch (error) {
    console.error("Error removing saved articles:", error);
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

async function checkSaved(category, _id) {
  try {
    const data = await AsyncStorage.getItem('savedArticles');
    const savedArticles = data ? JSON.parse(data) : [];

    console.log("Saved articles for checking:", savedArticles);

    // Check if the article is in the saved articles list
    return savedArticles.some(article => article.category == category && article._id == _id);
  } catch (error) {
    console.error("Error checking saved articles:", error);
    return false;
  }
}

export { loadSavedArticles, addSavedArticle, popSavedArticle, checkSaved, deleteSavedArticles };