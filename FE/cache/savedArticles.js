import AsyncStorage from '@react-native-async-storage/async-storage';

// savedArticles: {_id: {category, time}}

async function addSavedArticle(category, _id, setSaved) {
  try {
    const data = await AsyncStorage.getItem('savedArticles');
    const savedArticles = data ? JSON.parse(data) : {};
    savedArticles[_id] = {category, time: new Date().toISOString()}

    await AsyncStorage.setItem('savedArticles', JSON.stringify(savedArticles));

    setSaved(true); // Update the saved state in the component
  } catch (error) {
    console.error("Error saving saved articles:", error);
  }
}

async function popSavedArticle(_id, setSaved) {
  try {
    const data = await AsyncStorage.getItem('savedArticles');
    const savedArticles = data ? JSON.parse(data) : {};
    delete savedArticles[_id];

    await AsyncStorage.setItem('savedArticles', JSON.stringify(savedArticles));

    setSaved(false); // Update the saved state in the component
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
      return {};
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

async function checkSaved(_id) {
  try {
    const data = await AsyncStorage.getItem('savedArticles');
    const savedArticles = data ? JSON.parse(data) : {};

    console.log("Saved articles for checking:", savedArticles);

    // Check if the article is in the saved articles list
    return savedArticles[_id] !== undefined;
  } catch (error) {
    console.error("Error checking saved articles:", error);
    return false;
  }
}

export { loadSavedArticles, addSavedArticle, popSavedArticle, checkSaved, deleteSavedArticles };